import { ipcMain } from 'electron';
import { Produit } from '../models/Produit';
import { Categorie } from '../models/Categorie';
import { Fournisseur } from '../models/Fournisseur';
import { Unite } from '../models/Unite';
import db from '../db/database';
import { Contact } from '../models/Contact';
import log from 'electron-log';
import { IdNom } from '../models/IdNom';

/**
 * Enregistre les handlers IPC pour les opérations CRUD exposées au renderer.
 * Appelle les méthodes de `db` pour effectuer les opérations demandées.
 */
export const crudHandlers = () => {

    /****************************/
    /*           CRUD           */
    /****************************/

    ipcMain.handle('purge-produits', (_): void => {
        db.purgeEntite('produits');
        db.purgeEntite('categories');
        db.purgeEntite('fournisseurs');
        db.purgeEntite('unites');
    });

    /****************************/
    /*          Categorie       */
    /****************************/

    ipcMain.handle('get-categories', (): Categorie[] => {
        return db.getCategories();
    });

    ipcMain.handle('add-categorie', (_, categorie: IdNom): Categorie[] => {
        db.addCategory(categorie);
        return db.getCategories();
    });

    ipcMain.handle('add-get-categorie', (_, categorie: IdNom): Categorie => {
        const result = db.addCategory(categorie);
        return db.getCategorie(result.lastInsertRowid as number);
    });

    ipcMain.handle('update-categorie', (_, categorie: IdNom): Categorie[] => {
        db.updateCategory(categorie);
        return db.getCategories();
    });

    ipcMain.handle('delete-categorie', (_, id: number): Categorie[] => {
        db.deleteCategory(id);
        return db.getCategories();
    });

    /****************************/
    /*      Fournisseur         */
    /****************************/
    ipcMain.handle('get-fournisseurs', (): Fournisseur[] => {
        return db.getFournisseurs();
    });

    ipcMain.handle('add-fournisseur', (_, fournisseur: IdNom): Fournisseur[] => {
        db.addFournisseur(fournisseur);
        return db.getFournisseurs();
    });

    ipcMain.handle('add-get-fournisseur', (_, fournisseur: IdNom): Fournisseur => {
        const result = db.addFournisseur(fournisseur);
        return db.getFournisseur(result.lastInsertRowid as number);
    });

    ipcMain.handle('update-fournisseur', (_, fournisseur: IdNom): Fournisseur[] => {
        db.updateFournisseur(fournisseur);
        return db.getFournisseurs();
    });

    ipcMain.handle('delete-fournisseur', (_, id: number): Fournisseur[] => {
        db.deleteFournisseur(id);
        return db.getFournisseurs();
    });


    /****************************/
    /*          Unite           */
    /****************************/

    ipcMain.handle('get-unites', (): Unite[] => {
        return db.getUnites();
    });

    ipcMain.handle('add-unite', (_, unite: IdNom): Unite[] => {
        db.addUnite(unite);
        return db.getUnites();
    });

    ipcMain.handle('add-get-unite', (_, unite: IdNom): Unite => {
        const result = db.addUnite(unite);
        return db.getUnite(result.lastInsertRowid as number);
    });

    ipcMain.handle('update-unite', (_, unite: IdNom): Unite[] => {
        db.updateUnite(unite);
        return db.getUnites();
    });

    ipcMain.handle('delete-unite', (_, id: number): Unite[] => {
        db.deleteUnite(id);
        return db.getUnites();
    });

    /****************************/
    /*          Produit         */
    /****************************/

    ipcMain.handle('import-produits', async (_, produits: Produit[]): Promise<void> => {
        log.info('Importation de produits:');
        db.addProduits(produits);
    });

    ipcMain.handle('get-produits', (): Produit[] => {
        return db.getProduits();
    });

    ipcMain.handle('rechercher-produit', (_, query: string): Produit[] => {
        return db.rechercherProduit(query);
    });

    ipcMain.handle('add-produit', (_, produit: Produit): void => {
        db.addProduit(produit.nom, produit.prixAchat, produit.taux, produit.prixVente, produit.categorieId, produit.fournisseurId, produit.uniteId);
    });

    ipcMain.handle('update-produit', (_, produit: Produit): void => {
        db.updateProduit(produit.id, produit.nom, produit.prixAchat, produit.taux, produit.prixVente, produit.categorieId, produit.fournisseurId, produit.uniteId);
    });

    ipcMain.handle('delete-produit', (_, id: number): void => {
        db.deleteProduit(id);
    });

    /****************************/
    /*          Contact         */
    /****************************/

    ipcMain.handle('get-contacts', (): Contact[] => {
        return db.getContacts();
    });

    ipcMain.handle('rechercher-contacts', (_, query: string): Contact[] => {
        return db.rechercherContacts(query);
    });

    ipcMain.handle('add-contact', (_, contact: Contact): Contact[] => {
        db.addContact(contact.civilite, contact.nom, contact.prenom, contact.nom_complet, contact.adresse, contact.adresse_bis, contact.cp, contact.ville, contact.telephone, contact.email);
        return db.getContacts();
    });

    ipcMain.handle('update-contact', (_, contact: Contact): Contact[] => {
        db.updateContact(contact.civilite, contact.nom, contact.prenom, contact.nom_complet, contact.adresse, contact.adresse_bis, contact.cp, contact.ville, contact.telephone, contact.email, contact.id);
        return db.getContacts();
    });

    ipcMain.handle('delete-contact', (_, id: number): Contact[] => {
        db.deleteContact(id);
        return db.getContacts();
    });
};
