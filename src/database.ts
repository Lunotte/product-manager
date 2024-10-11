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
    prix_vente REAL NOT NULL,
    unite_id INTEGER,
    FOREIGN KEY (categorie_id) REFERENCES categories (id) ON DELETE CASCADE,
    FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs (id) ON DELETE CASCADE,
    FOREIGN KEY (unite_id) REFERENCES unites (id) ON DELETE CASCADE
  );
`);

const dbMethods = {
  getCategories() {
    return db.prepare('SELECT * FROM categories').all();
  },
  getCategorie(id: number) {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  },
  addCategory(nom: string) {
    const stmt = db.prepare('INSERT INTO categories (nom) VALUES (?)');
    const info = stmt.run(nom);
    console.log(info);
    
    return info.lastInsertRowid;
  },
  updateCategory(nom: string, id: number) {
    const stmt = db.prepare('UPDATE categories SET nom=? WHERE id=?');
    stmt.run(nom, id);
  },
  deleteCategory(id: number) {
    const stmt = db.prepare('DELETE FROM categories WHERE id=?');
    stmt.run(id);
  },
  getFournisseurs() {
    return db.prepare('SELECT * FROM fournisseurs').all();
  },
  addFournisseur(nom: string) {
    const stmt = db.prepare('INSERT INTO fournisseurs (nom) VALUES (?)');
    stmt.run(nom);
  },
  updateFournisseur(nom: string, id: number) {
    const stmt = db.prepare('UPDATE fournisseurs SET nom=? WHERE id=?');
    stmt.run(nom, id);
  },
  deleteFournisseur(id: number) {
    const stmt = db.prepare('DELETE FROM fournisseurs WHERE id=?');
    stmt.run(id);
  },
  getUnites() {
    return db.prepare('SELECT * FROM unites').all();
  },
  addUnite(nom: string) {
    const stmt = db.prepare('INSERT INTO unites (nom) VALUES (?)');
    stmt.run(nom);
  },
  updateUnite(nom: string, id: number) {
    const stmt = db.prepare('UPDATE unites SET nom=? WHERE id=?');
    stmt.run(nom, id);
  },
  deleteUnite(id: number) {
    const stmt = db.prepare('DELETE FROM unites WHERE id=?');
    stmt.run(id);
  },
  getProduits() {
    return db.prepare("SELECT produits.id, produits.nom AS produit_nom, produits.price_achat, produits.price_vente, categories.nom AS categorie_nom, fournisseurs.nom AS fournisseur_nom, unites.nom AS unite_nom FROM produits LEFT JOIN categories ON produits.categorie_id = categories.id LEFT JOIN fournisseurs ON produits.fournisseur_id = fournisseurs.id LEFT JOIN unites ON produits.unite_id = unites.id ").all();
  },
  getProducts() {
    return db.prepare('SELECT * FROM produits').all();
  },
  addProduit(nom: string, prixAchat: number, prixVente: number, categorie_id: number, fournisseur_id: number, unite_id: number): void {
    console.log(nom, prixAchat, prixVente, categorie_id, fournisseur_id, unite_id);
    
    const stmt = db.prepare('INSERT INTO produits (nom, prix_achat, prix_vente, categorie_id, fournisseur_id, unite_id) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(nom, prixAchat, prixVente, categorie_id, fournisseur_id, unite_id);
  },
  updateProduit(nom: string, id: number) {
    const stmt = db.prepare('UPDATE produits SET nom=? WHERE id=?');
    stmt.run(nom, id);
  },
  deleteProduit(id: number) {
    const stmt = db.prepare('DELETE produits unites WHERE id=?');
    stmt.run(id);
  },
};

export default dbMethods;