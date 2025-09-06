import { Produit } from "../../models/Produit";
import { cleanStartAndEndString } from "../divers/Utils";

import { Categorie } from "../../models/Categorie";
import { Fournisseur } from "../../models/Fournisseur";
import { Unite } from "../../models/Unite";

export const gestionImportProduits = (produitData: any): Produit => {


  // Vérification des champs requis
  if (!produitData.nom || !produitData.categorieNom || !produitData.fournisseurNom || !produitData.uniteNom) {
    // console.error("Import annulé, champs requis manquants:", produitData);
    throw new Error(`Champs requis manquants parmis le nom du produit / catégorie / fournisseur / unité ${produitData}`);

  }
  const categorieNom = cleanStartAndEndString(produitData.categorieNom);
  const fournisseurNom = cleanStartAndEndString(produitData.fournisseurNom);
  const uniteNom = cleanStartAndEndString(produitData.uniteNom);
  const produitNom = cleanStartAndEndString(produitData.nom);

  const categories: Categorie[] = [];
  const fournisseurs: Fournisseur[] = [];
  const unites: Unite[] = [];


  // TODO : Ajouter un throw sur les erreurs d'ajout
  // TODO : Optimiser la recherche avec une Map ou un objet indexé par nom
  // TODO : Faire un save pour pouvoir récupérer les IDs
  // Rechercher si la référence existe déjà, sinon la créer et l'ajouter
  let existingCategorie = categories.find((c: Categorie) => c.nom === categorieNom);
  if (!existingCategorie) {
    const newCategorie: Categorie = { nom: categorieNom } as Categorie;
    categories.push(newCategorie);
    existingCategorie = newCategorie;
    console.log("Nouvelle catégorie créée:", newCategorie);
  }

  let existingFournisseur = fournisseurs.find((f: Fournisseur) => f.nom === fournisseurNom);
  if (!existingFournisseur) {
    const newFournisseur: Fournisseur = { nom: fournisseurNom } as Fournisseur;
    fournisseurs.push(newFournisseur);
    existingFournisseur = newFournisseur;
    console.log("Nouveau fournisseur créé:", newFournisseur);
  }

  let existingUnite = unites.find((u: Unite) => u.nom === uniteNom);
  if (!existingUnite) {
    const newUnite: Unite = { nom: uniteNom } as Unite;
    unites.push(newUnite);
    existingUnite = newUnite;
    console.log("Nouvelle unité créée:", newUnite);
  }

  // TODO : Ajouter d'autres validations pour verifier l'intégrité des données
  if (!produitNom) { // Validation de base: un produit doit avoir un nom
    console.error("Produit ignoré, car nom manquant:", produitData);
  }

  return {
    nom: produitNom,
    prixAchat: parseOptionalFloat(produitData.prixAchat),
    taux: parseOptionalFloat(produitData.taux),
    prixVente: parseOptionalFloat(produitData.prixVente),
    fournisseurId: existingFournisseur.id || undefined,
    categorieId: existingCategorie.id || undefined,
    uniteId: existingUnite.id || undefined,
    dateMajPrix: produitData.dateMajPrix || undefined,
  } as Produit;
}

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