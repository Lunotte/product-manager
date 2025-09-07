import { Categorie } from "../../models/Categorie";
import { Produit } from "../../models/Produit";
import { Fournisseur } from "../../models/Fournisseur";
import { Unite } from "../../models/Unite";
import { ConfigurationType, gestionImportProduits } from "./produit.service";


/**
 * Parse le CSV en tableau de produits.
 */
const parseCSVToProduits = (csvData: string): Produit[] => {

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

    // Cache d'index par référence de tableau pour éviter de reconstruire à chaque appel
    const listIndexCache: WeakMap<ConfigurationType[], Map<string, ConfigurationType>> = new WeakMap();
    const categories: Categorie[] = [];
    const fournisseurs: Fournisseur[] = [];
    const unites: Unite[] = [];
    const produits: Produit[] = [];


    for (let i = headerLineIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Ignorer les lignes vides

        const values = line.split(';');
        const produitData: any = {};
        headers.forEach((header, index) => {
            produitData[header] = values.length > index ? (values[index] || '').trim() : '';
        });

        produits.push(gestionImportProduits(produitData, categories, fournisseurs, unites, listIndexCache));
        // TODO : Ajout en bdd
    }

    // console.log("Configurations importées - Catégories:", categories, "Fournisseurs:", fournisseurs, "Unités:", unites, listIndexCache);
    return produits;
};


/**
    * Handler pour l'import de produits depuis un fichier CSV
   * TODO : Il faut alerter de la suppression de tous les produits avant l'importation
   * @param event 
   */
export const handleImportProduitsFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            if (text) {
                try {
                    const importedProduits = parseCSVToProduits(text);
                    console.log("Produits importés:", importedProduits, importedProduits.length);

                    if (importedProduits.length > 0) {
                        await window.electronAPI.importProduits(importedProduits);
                        // console.log('Produits importés avec succès! Veuillez rafraîchir la liste des produits si nécessaire.');
                        alert('Produits importés avec succès! Veuillez rafraîchir la liste des produits si nécessaire.');
                        // Envisagez une manière plus intégrée de rafraîchir la liste des produits,
                        // par exemple, via une mise à jour du contexte ou un bus d'événements.
                    } else {
                        // console.warn('Aucun produit valide trouvé dans le fichier ou fichier vide.');
                        alert('Aucun produit valide trouvé dans le fichier ou fichier vide.');
                    }
                } catch (error: any) {
                    // console.error("Erreur lors de l'importation des produits:", error);
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