import { Categorie } from "../models/Categorie";
import { Fournisseur } from "../models/Fournisseur";
import { Produit } from "../models/Produit";

export interface ElectronAPI {

    logError: (message: string) => void;
    backup: () => Promise<void>;

    getCategories: () => Promise<Categorie[]>;
    addCategorie: (categorie: IdNom) => Promise<Categorie[]>;
    addAndGetCategorie: (categorie: IdNom) => Promise<Categorie>;
    updateCategorie: (categorie: IdNom) => Promise<Categorie[]>;
    deleteCategorie: (id: number) => Promise<Categorie[]>;

    getFournisseurs: () => Promise<Fournisseur[]>;
    addFournisseur: (fournisseur: IdNom) => Promise<Fournisseur[]>;
    addAndGetFournisseur: (fournisseur: IdNom) => Promise<Fournisseur>;
    updateFournisseur: (fournisseur: IdNom) => Promise<Fournisseur[]>;
    deleteFournisseur: (id: number) => Promise<Fournisseur[]>;

    getUnites: () => Promise<Unite[]>;
    addUnite: (unite: IdNom) => Promise<Unite[]>;
    addAndGetUnite: (unite: IdNom) => Promise<Unite>;
    updateUnite: (unite: IdNom) => Promise<Unite[]>;
    deleteUnite: (id: number) => Promise<Unite[]>;

    importProduits: (produits: Produit[]) => Promise<Produit[]>;
    purgeProduits: () => Promise<void>;
    getProduits: () => Promise<Produit[]>;
    rechercherProduits: (query: string) => Promise<Produit[]>;
    addProduit: (produit: Produit) => Promise<void>;
    // addProduits: (produits: Produit[]) => Promise<void>;
    updateProduit: (produit: Produit) => Promise<void>;
    deleteProduit: (id: number) => Promise<void>;

    getContacts: () => Promise<Contact[]>;
    rechercherContacts: (query: string) => Promise<Contact[]>;
    addContact: (contact: Contact) => Promise<Contact[]>;
    updateContact: (contact: Contact) => Promise<Contact[]>;
    deleteContact: (id: number) => Promise<Contact[]>;

    // notifierImportTermine: (channel: string, message: string) => void;
    onEvent: (channel: string, callback: (data: any) => void) => void;
    // removeEvent: (channel: string, callback: (data: any) => void) => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}