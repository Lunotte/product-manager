import Database from 'better-sqlite3';
import {app} from 'electron';
import path from 'path';
// import fs from 'fs';
import fs from 'fs-extra';
import log from 'electron-log';

import { Categorie } from "../models/Categorie";
import { Fournisseur } from "../models/Fournisseur";
import { Produit } from "../models/Produit";
import { Unite } from "../models/Unite";
import { Contact } from '../models/Contact';

export const dbPath = () => {
  return app.isPackaged
        ?  path.join(app.getPath('userData'), 'database.db')
        : path.join(__dirname, '../../', 'public/database.db')
}

function connect() {  
  return Database(
    dbPath(), { fileMustExist: false },
    // dbPath, { verbose: console.log, fileMustExist: false },
  );
}

const db = connect();

// Crée les tables si elles n'existent pas
db.exec(`
  CREATE TABLE IF NOT EXISTS migration_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    script_name TEXT NOT NULL,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

/**
 * Fonction pour vérifier si un script a déjà été exécuté
 * 
 * @param scriptName 
 * @returns 
 */
function hasScriptBeenExecuted(scriptName: string) {
  const row = db.prepare('SELECT 1 FROM migration_history WHERE script_name = ?').get(scriptName);
  return !!row;
}

// Fonction pour exécuter un script SQL
function executeScript(scriptPath: string) {
  const script = fs.readFileSync(scriptPath, 'utf8');
  db.exec(script);
  const scriptName = path.basename(scriptPath);
  db.prepare('INSERT INTO migration_history (script_name) VALUES (?)').run(scriptName);
}


/**
 * Lire les fichiers SQL dans le répertoire et les exécuter s'ils n'ont jamais été exécutés
 */
export const verifierEtExecuterMigration = () => {
  const scriptsDirectory = app.isPackaged ? path.join(process.resourcesPath,'migrations') : './migrations';
  log.info('Répertoire de migration', scriptsDirectory);

  fs.readdirSync(scriptsDirectory).forEach((file: string) => {
    const scriptPath = path.join(scriptsDirectory, file);
    if (!hasScriptBeenExecuted(file)) {
      log.info(`Script ${file} doit être exécuté.`);
      
      executeScript(scriptPath);
      log.info(`Script ${file} exécuté avec succès.`);
      
    } else {
      log.info(`Script ${file} a déjà été exécuté.`);
    }
  });
}


const dbMethods = {
  getCategories(): Categorie[] {
    return db.prepare<unknown[] , Categorie>('SELECT * FROM categories ORDER BY LOWER(nom) ASC').all();
  },
  addCategory(nom: string): void {
    const stmt = db.prepare('INSERT INTO categories (nom) VALUES (?)');
    stmt.run(nom);
  },
  updateCategory(nom: string, id: number): void {
    const stmt = db.prepare('UPDATE categories SET nom=? WHERE id=?');
    stmt.run(nom, id);
  },
  deleteCategory(id: number): void {
    const stmt = db.prepare('DELETE FROM categories WHERE id=?');
    stmt.run(id);
  },
  getFournisseurs(): Fournisseur[] {
    return db.prepare<unknown[] , Fournisseur>('SELECT * FROM fournisseurs ORDER BY LOWER(nom) ASC').all();
  },
  addFournisseur(nom: string): void {
    const stmt = db.prepare('INSERT INTO fournisseurs (nom) VALUES (?)');
    stmt.run(nom);
  },
  updateFournisseur(nom: string, id: number): void {
    const stmt = db.prepare('UPDATE fournisseurs SET nom=? WHERE id=?');
    stmt.run(nom, id);
  },
  deleteFournisseur(id: number): void {
    const stmt = db.prepare('DELETE FROM fournisseurs WHERE id=?');
    stmt.run(id);
  },
  getUnites(): Unite[] {
    return db.prepare<unknown[] , Unite>('SELECT * FROM unites ORDER BY LOWER(nom) ASC').all();
  },
  addUnite(nom: string): void {
    const stmt = db.prepare('INSERT INTO unites (nom) VALUES (?)');
    stmt.run(nom);
  },
  updateUnite(nom: string, id: number): void {
    const stmt = db.prepare('UPDATE unites SET nom=? WHERE id=?');
    stmt.run(nom, id);
  },
  deleteUnite(id: number): void {
    const stmt = db.prepare('DELETE FROM unites WHERE id=?');
    stmt.run(id);
  },
  getProduits(): Produit[] {
    return db.prepare<unknown[] , Produit>("SELECT produits.id, produits.nom AS nom, produits.prix_achat as prixAchat, produits.taux, produits.prix_vente as prixVente, produits.categorie_id AS categorieId, categories.nom AS categorieNom, produits.fournisseur_id AS fournisseurId, fournisseurs.nom AS fournisseurNom, produits.unite_id AS uniteId, unites.nom AS uniteNom FROM produits LEFT JOIN categories ON produits.categorie_id = categories.id LEFT JOIN fournisseurs ON produits.fournisseur_id = fournisseurs.id LEFT JOIN unites ON produits.unite_id = unites.id ORDER BY LOWER(nom) ASC").all();
  },
  rechercherProduit(query: string): Produit[] {
    return db.prepare<unknown[] , Produit>("SELECT produits.id, produits.nom AS nom, produits.prix_achat as prixAchat, produits.taux, produits.prix_vente as prixVente, produits.categorie_id AS categorieId, categories.nom AS categorieNom, produits.fournisseur_id AS fournisseurId, fournisseurs.nom AS fournisseurNom, produits.unite_id AS uniteId, unites.nom AS uniteNom FROM produits LEFT JOIN categories ON produits.categorie_id = categories.id LEFT JOIN fournisseurs ON produits.fournisseur_id = fournisseurs.id LEFT JOIN unites ON produits.unite_id = unites.id WHERE produits.nom LIKE ?1 OR categories.nom LIKE ?1 OR fournisseurs.nom LIKE ?1 ORDER BY LOWER(nom) ASC").all( { 1: '%' + query + '%' });
  }, 
  addProduit(nom: string, prixAchat: number, taux: number, prixVente: number, categorie_id: number, fournisseur_id: number, unite_id: number): void {
    const stmt = db.prepare('INSERT INTO produits (nom, prix_achat, taux, prix_vente, categorie_id, fournisseur_id, unite_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(nom, prixAchat, taux, prixVente, categorie_id, fournisseur_id, unite_id);
  },
  updateProduit(id: number, nom: string, prixAchat: number, taux: number, prixVente: number, categorieId: number, fournisseurId: number, uniteId: number): void {
    const stmt = db.prepare('UPDATE produits SET nom=?, prix_achat=?, taux=?, prix_vente=?, categorie_id=?, fournisseur_id=?, unite_id=? WHERE id=?');
    stmt.run(nom, prixAchat, taux, prixVente, categorieId, fournisseurId, uniteId, id);
  },
  deleteProduit(id: number): void {
    const stmt = db.prepare('DELETE FROM produits WHERE id=?');
    stmt.run(id);
  },

  getContacts(): Contact[] {
    return db.prepare<unknown[] , Contact>('SELECT * FROM contacts ORDER BY LOWER(nom) ASC, LOWER(prenom) ASC').all();
  },
  rechercherContacts(query: string): Contact[] {
    return db.prepare<unknown[], Contact>("SELECT * FROM contacts WHERE contacts.nom LIKE ?1 OR contacts.prenom LIKE ?1 OR (contacts.nom || ' ' || contacts.prenom) LIKE ?1 OR (contacts.prenom || ' ' || contacts.nom) LIKE ?1 ORDER BY nom ASC, prenom ASC").all( { 1: '%' + query + '%' });
  }, 
  addContact(civilite: string, nom: string, prenom: string, nom_complet: string, adresse: string, adresse_bis: string, cp: number, ville: string, telephone: string, email: string): void {
    const stmt = db.prepare('INSERT INTO contacts (civilite, nom, prenom, nom_complet, adresse, adresse_bis, cp, ville, telephone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(civilite, nom, prenom, nom_complet, adresse, adresse_bis, cp, ville, telephone, email);
  },
  updateContact(civilite: string, nom: string, prenom: string, nom_complet: string, adresse: string, adresse_bis: string, cp: number, ville: string, telephone: string, email: string, id: number): void {
    const stmt = db.prepare('UPDATE contacts SET civilite=?, nom=?, prenom=?, nom_complet=?, adresse=?, adresse_bis=?, cp=?, ville=?, telephone=?, email=? WHERE id=?');
    stmt.run(civilite, nom, prenom, nom_complet, adresse, adresse_bis, cp, ville, telephone, email, id);
  },
  deleteContact(id: number): void {
    const stmt = db.prepare('DELETE FROM contacts WHERE id=?');
    stmt.run(id);
  },
};

export default dbMethods;