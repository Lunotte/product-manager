import { IdNom } from "./IdNom";

export interface Produit extends IdNom {
    readonly categorieId: number;
    readonly fournisseurId: number;
    readonly uniteId: number;
    readonly prixAchat: number;
    readonly prixVente: number;
}