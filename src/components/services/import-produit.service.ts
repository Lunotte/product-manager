import { Categorie } from "../../models/Categorie";
import { Produit } from "../../models/Produit";
import { Fournisseur } from "../../models/Fournisseur";
import { Unite } from "../../models/Unite";
import { ConfigurationType, gestionImportProduits } from "./produit.service";
import { importRules } from '../../../import-rules';


const getErrorMessage = (error: unknown): string => {
    if (!error) return 'Erreur inconnue';
    if (error instanceof Error) return error.message;
    return String(error);
}


/**
 * Parse le CSV en tableau de produits.
 * - Support basique des champs quote-encapsulés (double quotes)
 * - Détection du séparateur le plus probable (; , ou \t)
 * - Respect des espaces dans les champs quote-encapsulés
 */
type ParseResult = {
    produits: Produit[];
    erreursParse: string[];
    warnings?: string[];
};

const parseCSVToProduits = async (csvData: string): Promise<ParseResult> => {
    const text = csvData.replace(/^\uFEFF/, ''); // Supprimer BOM

    // Choisit le séparateur en examinant la première ligne non vide (compte hors quotes)
    const firstLineMatch = text.match(/.*(?:\r?\n|$)/);
    const firstLine = firstLineMatch ? firstLineMatch[0].replace(/\r?\n$/, '') : '';

    const countSepOutsideQuotes = (line: string, sep: string) => {
        let count = 0;
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const currentChar = line[i];
            if (currentChar === '"') {
                if (inQuotes && line[i + 1] === '"') { i++; continue; }
                inQuotes = !inQuotes;
            } else if (!inQuotes && currentChar === sep) {
                count++;
            }
        }
        return count;
    };

    const candidates = [';', ',', '\t'];
    let delimiter = candidates[0];
    let maxCount = -1;
    for (const candidate of candidates) {
        const candidateCount = countSepOutsideQuotes(firstLine, candidate);
        if (candidateCount > maxCount) { maxCount = candidateCount; delimiter = candidate; }
    }

    // Parser robuste qui gère les quotes et les sauts de ligne dans un champ
    const rows: string[][] = [];
    let field = '';
    let row: string[] = [];
    let inQuotes = false;
    let fieldWasQuoted = false;

    for (let i = 0; i < text.length; i++) {
        const currentChar = text[i];

        if (inQuotes) {
            if (currentChar === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; continue; }
                inQuotes = false;
            } else {
                field += currentChar;
            }
        } else {
            switch (currentChar) {
                case '"':
                    // début d'un champ quote-encapsulé (si champ vide jusqu'ici)
                    inQuotes = true;
                    fieldWasQuoted = true;
                    break;
                case delimiter:
                    row.push(fieldWasQuoted ? field : field.trim());
                    field = '';
                    fieldWasQuoted = false;
                    break;
                case '\r':
                    // ignorer, gestion du \r\n ci-dessous
                    if (text[i + 1] === '\n') { i++; }
                    row.push(fieldWasQuoted ? field : field.trim());
                    rows.push(row);
                    row = [];
                    field = '';
                    fieldWasQuoted = false;
                    break;
                case '\n':
                    row.push(fieldWasQuoted ? field : field.trim());
                    rows.push(row);
                    row = [];
                    field = '';
                    fieldWasQuoted = false;
                    break;
                default:
                    field += currentChar;
            }
        }
    }

    // push dernier champ/ligne
    if (inQuotes) {
        // champ non fermé — on le considère comme terminé mais loggue un warning
        window.electronAPI.logError('CSV: champ quote non fermé détecté.');
        // on laisse field tel quel
        row.push(fieldWasQuoted ? field : field.trim());
        rows.push(row);
    } else if (field.length > 0 || row.length > 0) {
        row.push(fieldWasQuoted ? field : field.trim());
        rows.push(row);
    }

    // Trouver la première ligne d'entêtes non vide
    let headerRowIndex = 0;
    while (headerRowIndex < rows.length) {
        const headerCandidateRow = rows[headerRowIndex];
        const anyNonEmpty = headerCandidateRow.some(cell => cell != null && String(cell).trim() !== '');
        if (anyNonEmpty) break;
        headerRowIndex++;
    }

    if (headerRowIndex >= rows.length || rows.length < headerRowIndex + 2) {
        const msg = 'Le CSV ne contient pas assez de données (entêtes + au moins une ligne de données).';
        console.warn(msg);
        return { produits: [], erreursParse: [msg] };
    }

    const headers = rows[headerRowIndex].map(h => (h ?? '').trim());

    const listIndexCache: WeakMap<ConfigurationType[], Map<string, ConfigurationType>> = new WeakMap();
    const categories: Categorie[] = [];
    const fournisseurs: Fournisseur[] = [];
    const unites: Unite[] = [];
    const produits: Produit[] = [];
    const erreursParse: string[] = [];
    const warnings: string[] = [];

    for (let i = headerRowIndex + 1; i < rows.length; i++) {
        const rowValues = rows[i];
        const allEmpty = !rowValues || rowValues.every(v => (v ?? '').trim() === '');
        if (allEmpty) continue;

        const produitData: Record<string, string> = {};
        headers.forEach((header, index) => {
            produitData[header] = rowValues.length > index ? (rowValues[index] ?? '') : '';
        });
        // Validation supplémentaire côté parsing pour détecter des erreurs
        // qui provoqueront un échec côté base (ex: NOT NULL sur `prix_achat`).
        // Cela permet de fournir des messages plus lisibles à l'utilisateur
        // avant d'envoyer les données au process principal.
        const rowErrors: string[] = [];

        // Helper pour récupérer une valeur depuis produitData en testant
        // plusieurs variantes de nom de colonne (camelCase, snake_case, espaces, tirets)
        const getFieldValue = (keys: string[]): string | undefined => {
            for (const k of keys) {
                // recherche insensible à la casse
                const foundKey = Object.keys(produitData).find(h => h.toLowerCase() === k.toLowerCase());
                if (foundKey) return (produitData[foundKey] ?? '').trim();
            }
            return undefined;
        };

        // Champs obligatoires côté base à vérifier avant import
        // Pour chaque champ on définit des variantes d'en-têtes courantes
        const requiredDbFields = importRules.requiredDbFields;

        for (const fieldSpec of requiredDbFields) {
            const rawValue = getFieldValue(fieldSpec.variants);
            const isMandatory = Array.isArray(importRules.mandatoryFields) && importRules.mandatoryFields.includes(fieldSpec.logicalName);

            // Si le champ est obligatoire et manquant/vidE -> erreur
            if (isMandatory && (rawValue === undefined || rawValue === '')) {
                rowErrors.push(`Ligne ${i + 1} : champ requis '${fieldSpec.logicalName}' manquant ou vide.`);
                continue;
            }

            // Si une valeur est fournie et doit être numérique, la valider
            if (rawValue !== undefined && rawValue !== '' && fieldSpec.mustBeNumeric) {
                const normalized = rawValue.replace(',', '.');
                const numericValue = Number(normalized);
                if (isNaN(numericValue)) {
                    rowErrors.push(`Ligne ${i + 1} : valeur invalide pour '${fieldSpec.logicalName}' : '${rawValue}'. Attendu un nombre.`);
                } else if (!importRules.allowNegativeNumbers && numericValue < 0) {
                    rowErrors.push(`Ligne ${i + 1} : valeur négative interdite pour '${fieldSpec.logicalName}' : '${rawValue}'.`);
                }
            }
        }

        // Vérification métier spécifique : prixVente >= prixAchat (optionnelle)
        if (importRules.enforcePrixVenteComparison) {
            const prixAchatVal = getFieldValue(['prixAchat', 'prix_achat', 'prix achat', 'prix-achat']);
            const prixVenteVal = getFieldValue(['prixVente', 'prix_vente', 'prix vente', 'prix-vente', 'prix de vente', 'prixdevente']);
            if (prixAchatVal && prixVenteVal) {
                const a = Number(prixAchatVal.replace(',', '.'));
                const v = Number(prixVenteVal.replace(',', '.'));
                if (!isNaN(a) && !isNaN(v)) {
                    if (v < a) {
                        const msg = `Ligne ${i + 1} : prixVente (${prixVenteVal}) inférieur au prixAchat (${prixAchatVal}).`;
                        if (importRules.prixVenteLessIsWarning) {
                            warnings.push(msg);
                        } else {
                            rowErrors.push(msg);
                        }
                    }
                }
            }
        }

        if (rowErrors.length > 0) {
            // Ne pas tenter d'ajouter cet item en base — on accumule les erreurs lisibles
            erreursParse.push(...rowErrors);
            // logger pour debug
            rowErrors.forEach(msg => window.electronAPI.logError(msg));
            continue;
        }

        try {
            const produit: Produit = await gestionImportProduits(produitData, categories, fournisseurs, unites, listIndexCache);
            produits.push(produit);
        } catch (error: unknown) {
            const errText = getErrorMessage(error);
            const message = `Ligne ${i + 1} : ${errText}`;
            erreursParse.push(message);
            window.electronAPI.logError(`Erreur lors du traitement du produit à la ligne ${i + 1}: ${errText}`);
            // continuer le traitement des autres lignes
        }
    }

    const result: ParseResult = { produits, erreursParse };
    if (warnings.length > 0) result.warnings = warnings;
    return result;
}


export const handleImportProduitsFileSelected = async (event: React.ChangeEvent<HTMLInputElement>): Promise<ParseResult> => {
    const input = (event.currentTarget || event.target) as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) throw new Error("Aucun fichier sélectionné pour l'import.");

    // Validation fichier basique
    // Taille maximale du fichier CSV accepté (modifiable) : 10 MB
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const lowerName = file.name ? file.name.toLowerCase() : '';
    if (!lowerName.endsWith('.csv') && !file.type.startsWith('text')) {
        throw new Error('Le fichier sélectionné ne semble pas être un CSV.');
    }
    // Vérification de la taille désactivée pour l'instant. Pour la réactiver,
    // remplacer la condition ci-dessous par `if (file.size > MAX_SIZE) { ... }`
    const ENABLE_SIZE_CHECK = false; // set to true to enable max size validation
    if (ENABLE_SIZE_CHECK && file.size > MAX_SIZE) {
        throw new Error('Le fichier est trop volumineux (> 10MB).');
    }

    try {
        // 1. Lire le fichier en texte via une Promise
        const text = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (loadEvent) => resolve(loadEvent.target?.result as string);
            reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
            reader.onabort = () => reject(new Error('Lecture du fichier annulée'));
            try {
                reader.readAsText(file, 'UTF-8');
            } catch (readException) {
                reject(readException);
            }
        });

        // 2. Parser le CSV (prévalidation côté client)
        const parseResult = await parseCSVToProduits(text);

        // Ne pas lancer l'import ici — le caller décidera s'il souhaite continuer après inspection des erreurs
        return parseResult;
    } catch (error: unknown) {
        const errText = getErrorMessage(error);
        window.electronAPI.logError(`Erreur importation CSV Produits: ${errText}`);
        throw error;
    } finally {
        // 4. Réinitialiser l’input pour pouvoir réimporter le même fichier plus tard
        try {
            if (input) input.value = '';
        } catch (_) {
            // ignore
        }
    }
}
