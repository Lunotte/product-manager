import { Produit } from "../../../models/Produit";

export interface ProduitExport {
    readonly nom: string;
    readonly prixAchat: number;
    readonly dateMajPrix: Date;
    readonly taux: number;
    readonly prixVente: number;
    readonly categorieNom: string;
    readonly fournisseurNom: string;
    readonly uniteNom: string;
}

/**
 * Convertit un tableau de `Produit` en format `ProduitExport` destiné à l'export CSV.
 * @param produits Liste des produits à convertir.
 * @returns Liste des produits au format d'export.
 */
export const convertProduitsToProduitExport = (produits: Produit[]): ProduitExport[] => {
    return produits.map(produit => ({
        nom: produit.nom,
        prixAchat: produit.prixAchat,
        dateMajPrix: produit.dateMajPrix,
        taux: produit.taux,
        prixVente: produit.prixVente,
        categorieNom: produit.categorieNom,
        fournisseurNom: produit.fournisseurNom,
        uniteNom: produit.uniteNom
    }));
}
