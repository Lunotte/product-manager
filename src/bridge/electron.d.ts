import { Contact } from "src/models/Contact";
import { Categorie } from "../models/Categorie";
import { Fournisseur } from "../models/Fournisseur";
import { Produit } from "../models/Produit";

export interface ElectronAPI {

    logError: (message: string) => void;
    backup: () => void;
    
    getCategories: () => Promise<Categorie[]>;
    addCategorie: (nom: string) => Promise<Categorie[]>;
    updateCategorie: (id: number, nom: string) => Promise<Categorie[]>;
    deleteCategorie: (id: number) => Promise<Categorie[]>;

    getFournisseurs: () => Promise<Fournisseur[]>;
    addFournisseur: (nom: string) => Promise<Fournisseur[]>;
    updateFournisseur: (id: number, nom: string) => Promise<Fournisseur[]>;
    deleteFournisseur: (id: number) => Promise<Fournisseur[]>;

    getUnites: () => Promise<Unite[]>;
    addUnite: (nom: string) => Promise<Unite[]>;
    updateUnite: (id: number, nom: string) => Promise<Unite[]>;
    deleteUnite: (id: number) => Promise<Unite[]>;

    getProduits: () => Promise<Produit[]>;
    rechercherProduits: (query: string) => Promise<Produit[]>;
    addProduit: (produit: Produit) => Promise<void>;
    updateProduit: (produit: Produit) => Promise<void>;
    deleteProduit: (id: number) => Promise<void>;

    getContacts: () => Promise<Contact[]>;
    rechercherContacts: (query: string) => Promise<Contact[]>;
    addContact: (contact: Contact) => Promise<void>;
    updateContact: (contact: Contact) => Promise<void>;
    deleteContact: (id: number) => Promise<void>;
}
  
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}