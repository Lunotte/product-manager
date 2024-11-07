import { IdNom } from "./IdNom";

export interface Contact extends IdNom {
    readonly prenom: string;
    readonly nom_complet: string;
    readonly civilite: string;
    readonly adresse: string;
    readonly adresse_bis: string;
    readonly cp: number;
    readonly ville: string;
    readonly telephone: string;
    readonly email: string;
}