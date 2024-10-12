import { Produit } from "../models/Produit";
import db from "../db/database-knex";

export const getAllProduit = async (): Promise<Produit[]> => {
    return db("produits").select("*");
};

export const addProduit = async (produit: Produit): Promise<number[]> => {
    return db("produits").insert(produit);
};