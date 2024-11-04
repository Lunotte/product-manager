import { ipcMain} from 'electron';
import { Produit } from '../models/Produit';
import { Categorie } from '../models/Categorie';
import { Fournisseur } from '../models/Fournisseur';
import { Unite } from '../models/Unite';
import db from '../db/database';
import { Contact } from '../models/Contact';

export const crudHandlers = () => {
    ipcMain.handle('get-categories', (): Categorie[] => {
        return db.getCategories();
    });
    
    ipcMain.handle('add-categorie', (_, nom: string): Categorie[] => {
        db.addCategory(nom);
        return db.getCategories();
    });

    ipcMain.handle('update-categorie', (_, id: number, nom: string): Categorie[] => {
        db.updateCategory(nom, id);
        return db.getCategories();
    });
    
    ipcMain.handle('delete-categorie', (_, id: number): Categorie[] => {
        db.deleteCategory(id);
        return db.getCategories();
    });

    ipcMain.handle('get-fournisseurs', (): Fournisseur[] => {
        return db.getFournisseurs();
    });

    ipcMain.handle('add-fournisseur', (_, nom: string): Fournisseur[] => {
        db.addFournisseur(nom);
        return db.getFournisseurs();
    });

    ipcMain.handle('update-fournisseur', (_, id: number, nom: string): Fournisseur[] => {
        db.updateFournisseur(nom, id);
        return db.getFournisseurs();
    });

    ipcMain.handle('delete-fournisseur', (_, id: number): Fournisseur[] => {
        db.deleteFournisseur(id);
        return db.getFournisseurs();
    });

    ipcMain.handle('get-unites', (): Unite[] => {
        return db.getUnites();
    });

    ipcMain.handle('add-unite', (_, nom: string): Unite[] => {
        db.addUnite(nom);
        return db.getUnites();
    });

    ipcMain.handle('update-unite', (_, id: number, nom: string): Unite[] => {
        db.updateUnite(nom, id);
        return db.getUnites();
    });

    ipcMain.handle('delete-unite', (_, id: number): Unite[] => {
        db.deleteUnite(id);
        return db.getUnites();
    });

    ipcMain.handle('get-produits', (): Produit[] => {
        return db.getProduits();
    });

    ipcMain.handle('rechercher-produit', (_, query: string): Produit[] => {
        return db.rechercherProduit(query);
    });

    ipcMain.handle('add-produit', (_, produit: Produit): Produit[] => {
        db.addProduit(produit.nom, produit.prixAchat, produit.taux, produit.prixVente, produit.categorieId, produit.fournisseurId, produit.uniteId);
        return db.getProduits();
    });

    ipcMain.handle('update-produit', (_, produit: Produit): Produit[] => {
        db.updateProduit(produit.id, produit.nom, produit.prixAchat, produit.taux, produit.prixVente, produit.categorieId, produit.fournisseurId, produit.uniteId);
        return db.getProduits();
    });

    ipcMain.handle('delete-produit', (_, id: number): Produit[] => {
        db.deleteProduit(id);
        return db.getProduits();
    });


    ipcMain.handle('get-contacts', (): Contact[] => {
        return db.getContacts();
    });

    ipcMain.handle('add-contact', (_, contact: Contact): Contact[] => {
        db.addContact(contact.civilite, contact.nom, contact.prenom, contact.nom_complet, contact.adresse, contact.adresse_bis, contact.cp, contact.ville);
        return db.getContacts();
    });

    ipcMain.handle('update-contact', (_, contact: Contact): Contact[] => {
        db.updateContact(contact.civilite, contact.nom, contact.prenom, contact.nom_complet, contact.adresse, contact.adresse_bis, contact.cp, contact.ville, contact.id);
        return db.getContacts();
    });

    ipcMain.handle('delete-contact', (_, id: number): Contact[] => {
        db.deleteContact(id);
        return db.getContacts();
    });
};
