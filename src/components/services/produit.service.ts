import { Produit } from "../../models/Produit";
import { cleanStartAndEndString } from "../divers/Utils";

import { Categorie } from "../../models/Categorie";
import { Fournisseur } from "../../models/Fournisseur";
import { Unite } from "../../models/Unite";
import { IdNom } from "../../models/IdNom";

export type ConfigurationType = Categorie | Fournisseur | Unite;

export const gestionImportProduits = async (produitData: any, categories: Categorie[], fournisseurs: Fournisseur[], unites: Unite[], listIndexCache: WeakMap<ConfigurationType[], Map<string, ConfigurationType>>): Promise<Produit> => {

  // Vérification des champs requis
  if (!produitData.nom || !produitData.categorieNom || !produitData.fournisseurNom || !produitData.uniteNom) {
    throw new Error(`Champs requis manquants parmi le nom du produit / catégorie / fournisseur / unité ${JSON.stringify(produitData, null, 2)}`);
  }

  const categorieNom = cleanStartAndEndString(produitData.categorieNom);
  const fournisseurNom = cleanStartAndEndString(produitData.fournisseurNom);
  const uniteNom = cleanStartAndEndString(produitData.uniteNom);
  const produitNom = cleanStartAndEndString(produitData.nom);

  const existingCategorie = await addItem<Categorie>(categorieNom, categories, listIndexCache, window.electronAPI.addAndGetCategorie);
  const existingFournisseur = await addItem<Fournisseur>(fournisseurNom, fournisseurs, listIndexCache, window.electronAPI.addAndGetFournisseur);
  const existingUnite = await addItem<Unite>(uniteNom, unites, listIndexCache, window.electronAPI.addAndGetUnite);

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
 * Si le nom n'existe pas dans la liste, l'ajouter
 * 
 * @param nom Nom de la configuration à ajouter
 * @param liste À laquelle ajouter l'élément
 * @throws Error si une erreur survient lors de l'ajout
 */
const addItem = async <T extends ConfigurationType>(nom: string, liste: T[], listIndexCache: WeakMap<ConfigurationType[], Map<string, ConfigurationType>>, addFn: (item: IdNom) => Promise<T>): Promise<T> => {

  try {
    // Récupérer ou construire l'index pour ce tableau
    let index = listIndexCache.get(liste) as Map<string, T> | undefined;
    if (!index) {
      index = new Map<string, T>();
      for (const item of liste) {
        if (item?.nom) {
          index.set(item.nom, item as T);
        }
      }
      listIndexCache.set(liste, index as Map<string, ConfigurationType>);
    }

    // Recherche optimisée via la map
    let existingItem = index.get(nom);
    if (!existingItem) {
      const newItem = { nom } as T;
      liste.push(newItem);
      index.set(nom, newItem);
      existingItem = await addFn(newItem as IdNom);
    }
    return existingItem;
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout de l'élément '${nom}': ${error}`);
  }
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
