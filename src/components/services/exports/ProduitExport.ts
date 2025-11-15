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
