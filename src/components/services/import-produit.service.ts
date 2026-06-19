import { Categorie } from "../../models/Categorie";
import { Produit } from "../../models/Produit";
import { Fournisseur } from "../../models/Fournisseur";
import { Unite } from "../../models/Unite";
import { ConfigurationType, gestionImportProduits } from "./produit.service";


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
const parseCSVToProduits = async (csvData: string): Promise<Produit[]> => {
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
        console.warn('Le CSV ne contient pas assez de données (entêtes + au moins une ligne de données).');
        return [];
    }

    const headers = rows[headerRowIndex].map(h => (h ?? '').trim());

    const listIndexCache: WeakMap<ConfigurationType[], Map<string, ConfigurationType>> = new WeakMap();
    const categories: Categorie[] = [];
    const fournisseurs: Fournisseur[] = [];
    const unites: Unite[] = [];
    const produits: Produit[] = [];

    for (let i = headerRowIndex + 1; i < rows.length; i++) {
        const rowValues = rows[i];
        const allEmpty = !rowValues || rowValues.every(v => (v ?? '').trim() === '');
        if (allEmpty) continue;

        const produitData: Record<string, string> = {};
        headers.forEach((header, index) => {
            produitData[header] = rowValues.length > index ? (rowValues[index] ?? '') : '';
        });

        try {
            const produit: Produit = await gestionImportProduits(produitData, categories, fournisseurs, unites, listIndexCache);
            produits.push(produit);
        } catch (error: unknown) {
            const errText = getErrorMessage(error);
            window.electronAPI.logError(`Erreur lors du traitement du produit à la ligne ${i + 1}: ${errText}`);
            // continuer le traitement des autres lignes
        }
    }

    return produits;
}


export const handleImportProduitsFileSelected = async (event: React.ChangeEvent<HTMLInputElement>): Promise<boolean> => {
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

        // 2. Parser le CSV
        const importedProduits = await parseCSVToProduits(text);

        if (importedProduits.length > 0) {
            // 3. Attendre l'import Electron
            try {
                await window.electronAPI.importProduits(importedProduits);
            } catch (error: unknown) {
                const errMsg = getErrorMessage(error);
                throw new Error(`Erreur lors de l'import des produits en base de données : ${errMsg}`);
            }
            return true;
        } else {
            throw new Error("Aucun produit valide trouvé dans le fichier ou fichier vide.");
        }
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
