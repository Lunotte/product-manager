import { IdNom } from "./IdNom";

export interface Contact extends IdNom {
    readonly adresse: string;
    readonly adresse_bis: string;
    readonly cp: number;
    readonly ville: string;
}