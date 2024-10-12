import { IdNom } from "./IdNom";

export interface Produit extends IdNom {
    readonly prixAchat: number;
    readonly taux: number;
    readonly prixVente: number;
    readonly categorieId: number;
    readonly fournisseurId: number;
    readonly uniteId: number;
    readonly categorieNom?: string;
    readonly fournisseurNom?: string;
    readonly uniteNom?: string;
}