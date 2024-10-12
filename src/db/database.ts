import { Categorie } from "../models/Categorie";
import { Fournisseur } from "../models/Fournisseur";
import { Produit } from "../models/Produit";
import { Unite } from "../models/Unite";

const { app } = require('electron');
const Database = require('better-sqlite3');
const path = require('path');

function connect() {

  const dbPath = app.isPackaged
        ? path.join(app.getPath('userData'), 'database.db')
        : path.join(__dirname, '../../', 'public/database.db')
  
  return Database(
    dbPath, { verbose: console.log, fileMustExist: false },
  );
}

const db = connect();

// Crée les tables si elles n'existent pas
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS fournisseurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS unites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    categorie_id INTEGER,
    fournisseur_id INTEGER,
    prix_achat REAL NOT NULL,
    taux REAL NOT NULL,
    prix_vente REAL NOT NULL,
    unite_id INTEGER,
    FOREIGN KEY (categorie_id) REFERENCES categories (id) ON DELETE CASCADE,
    FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs (id) ON DELETE CASCADE,
    FOREIGN KEY (unite_id) REFERENCES unites (id) ON DELETE CASCADE
  );
`);

// try {
//   db.exec(`
//     ALTER TABLE produits
//     RENAME COLUMN price_achat TO prix_achat;

//     ALTER TABLE produits
//     RENAME COLUMN price_vente TO prix_vente;
//   `)
// } catch (error) {
//   console.error('La table a déjà été migrée', error);
// }

const dbMethods = {
  getCategories(): Categorie[] {
    return db.prepare('SELECT * FROM categories').all();
  },
  addCategory(nom: string): void {
    const stmt = db.prepare('INSERT INTO categories (nom) VALUES (?)');
    const info = stmt.run(nom);
    
    return info.lastInsertRowid;
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
    return db.prepare('SELECT * FROM fournisseurs').all();
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
    return db.prepare('SELECT * FROM unites').all();
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
    return db.prepare("SELECT produits.id, produits.nom AS nom, produits.prix_achat as prixAchat, produits.taux, produits.prix_vente as prixVente, produits.categorie_id AS categorieId, categories.nom AS categorieNom, produits.fournisseur_id AS fournisseurId, fournisseurs.nom AS fournisseurNom, produits.unite_id AS uniteId, unites.nom AS uniteNom FROM produits LEFT JOIN categories ON produits.categorie_id = categories.id LEFT JOIN fournisseurs ON produits.fournisseur_id = fournisseurs.id LEFT JOIN unites ON produits.unite_id = unites.id").all();
  },
  rechercherProduit(query: string): Produit[] {
    return db.prepare("SELECT produits.id, produits.nom AS nom, produits.prix_achat as prixAchat, produits.taux, produits.prix_vente as prixVente, produits.categorie_id AS categorieId, categories.nom AS categorieNom, produits.fournisseur_id AS fournisseurId, fournisseurs.nom AS fournisseurNom, produits.unite_id AS uniteId, unites.nom AS uniteNom FROM produits LEFT JOIN categories ON produits.categorie_id = categories.id LEFT JOIN fournisseurs ON produits.fournisseur_id = fournisseurs.id LEFT JOIN unites ON produits.unite_id = unites.id WHERE produits.nom LIKE ?1 OR categories.nom LIKE ?1 OR fournisseurs.nom LIKE ?1").all( { 1: '%' + query + '%' });
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
};

export default dbMethods;