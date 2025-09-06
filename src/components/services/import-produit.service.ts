import { Categorie } from "../../models/Categorie";
import { Fournisseur } from "../../models/Fournisseur";
import { Produit } from "../..//models/Produit";
import { Unite } from "../../models/Unite";

/**
 * Convertit une chaîne en float optionnel (gère la virgule comme séparateur décimal)
 */
const parseOptionalFloat = (value: string | undefined): number | undefined => {
    if (value === undefined || value === null || value.trim() === '') return undefined;
    // Gérer la virgule comme séparateur décimal
    const sanitizedValue = value.replace(',', '.');
    const num = parseFloat(sanitizedValue);
    return isNaN(num) ? undefined : num;
};

/**
 * Parse le CSV en tableau de produits.
 */
const parseCSVToProduits = (csvData: string, categories: Categorie[], fournisseurs: Fournisseur[], unites: Unite[]): Produit[] => {

    const lines = csvData.replace(/^\uFEFF/, '').split(/\r?\n/); // Supprimer BOM, séparer les lignes

    let headerLineIndex = 0;
    while (headerLineIndex < lines.length && !lines[headerLineIndex].trim()) {
        headerLineIndex++; // Ignorer les lignes vides au début
    }

    if (headerLineIndex >= lines.length || lines.length < headerLineIndex + 2) {
        console.warn("Le CSV ne contient pas assez de données (entêtes + au moins une ligne de données).");
        return [];
    }

    const headers = lines[headerLineIndex].split(';').map(h => h.trim());
    const produits: Produit[] = [];

    for (let i = headerLineIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Ignorer les lignes vides

        const values = line.split(';');
        const produitData: any = {};
        headers.forEach((header, index) => {
            produitData[header] = values.length > index ? (values[index] || '').trim() : '';
        });

        // Vérification des champs requis
        if (!produitData.nom || !produitData.categorieNom || !produitData.fournisseurNom || !produitData.uniteNom) {
            console.error("Import annulé, champs requis manquants:", produitData);
            break;
        }

        const hasCategorie = categories.some((categorie: Categorie) => (categorie.nom == produitData.categorieNom));
        const hasFournisseur = fournisseurs.some((fournisseur: Fournisseur) => (fournisseur.nom == produitData.fournisseurNom));
        const hasUnite = unites.some((unite: Unite) => (unite.nom == produitData.uniteNom));

        console.log(hasCategorie, hasFournisseur, hasUnite, unites, produitData);

        if (!hasCategorie || !hasFournisseur || !hasUnite) {
            console.error(`Import annulé, car il manque des références valides (Catégorie et/ou Fournisseur et/ou Unité): ${JSON.stringify(produitData)}`);
            break;
        }

        const produit: Produit = {
            nom: produitData.nom || '',
            prixAchat: parseOptionalFloat(produitData.prixAchat),
            taux: parseOptionalFloat(produitData.taux),
            prixVente: parseOptionalFloat(produitData.prixVente),
            fournisseurNom: produitData.fournisseurNom || undefined,
            categorieNom: produitData.categorieNom || undefined,
            uniteNom: produitData.uniteNom || undefined,
            dateMajPrix: produitData.dateMajPrix || undefined,
        };

        // TODO : Ajouter d'autres validations pour verifier l'intégrité des données
        if (produit.nom) { // Validation de base: un produit doit avoir un nom
            produits.push(produit);
        } else {
            console.warn("Produit ignoré car nom manquant:", produitData);
        }
    }

    console.log("Produits importés:", produits, produits.length);

    return produits;
};


/**
    * Handler pour l'import de produits depuis un fichier CSV
   * TODO : Il faut alerter de la suppression de tous les produits avant l'importation
   * @param event 
   */
export const handleImportProduitsFileSelected = (
    event: React.ChangeEvent<HTMLInputElement>,
    categories: Categorie[],
    fournisseurs: Fournisseur[],
    unites: Unite[]) => {

    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            if (text) {
                try {
                    const importedProduits = parseCSVToProduits(text, categories, fournisseurs, unites);
                    console.log("Produits importés:", importedProduits);

                    if (importedProduits.length > 0) {
                        await window.electronAPI.importProduits(importedProduits);
                        console.log('Produits importés avec succès! Veuillez rafraîchir la liste des produits si nécessaire.');
                        // alert('Produits importés avec succès! Veuillez rafraîchir la liste des produits si nécessaire.');
                        // Envisagez une manière plus intégrée de rafraîchir la liste des produits,
                        // par exemple, via une mise à jour du contexte ou un bus d'événements.
                    } else {
                        console.warn('Aucun produit valide trouvé dans le fichier ou fichier vide.');
                        // alert('Aucun produit valide trouvé dans le fichier ou fichier vide.');
                    }
                } catch (error: any) {
                    console.error("Erreur lors de l'importation des produits:", error);
                    window.electronAPI.logError(`Erreur importation CSV Produits: ${error.message || error}`);
                    alert(`Erreur lors de l'importation: ${error.message || 'Erreur inconnue'}`);
                }
            }
        };
        reader.onerror = (error) => {
            console.error("Erreur de lecture du fichier:", error);
            window.electronAPI.logError("Erreur de lecture du fichier CSV pour importation.");
            alert("Erreur de lecture du fichier.");
        };
        reader.readAsText(file, 'UTF-8');
    }
    // Réinitialiser l'input pour permettre de sélectionner à nouveau le même fichier
    if (event.target) {
        event.target.value = '';
    }
};