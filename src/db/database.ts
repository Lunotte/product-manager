import Database, { RunResult } from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import log from 'electron-log';

import { Categorie } from "../models/Categorie";
import { Fournisseur } from "../models/Fournisseur";
import { Produit } from "../models/Produit";
import { Unite } from "../models/Unite";
import { Contact } from '../models/Contact';
import { IdNom } from '../models/IdNom';

/**
 * Retourne le chemin du fichier de base de données selon le mode (packagé ou dev).
 * @returns Chemin absolu vers le fichier SQLite utilisé par l'application.
 */
export const dbPath = () => {
  return app.isPackaged
    ? path.join(app.getPath('userData'), 'database.db')
    : path.join(__dirname, '../../', 'public/database.db')
}

/**
 * Établit une connexion à la base de données SQLite.
 * @returns Une instance de la base de données ouverte.
 */
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
/**
 * Vérifie si un script de migration a déjà été enregistré dans l'historique.
 * @param scriptName Nom du script SQL à vérifier.
 * @returns `true` si le script a déjà été exécuté, sinon `false`.
 */
function hasScriptBeenExecuted(scriptName: string) {
  const row = db.prepare('SELECT 1 FROM migration_history WHERE script_name = ?').get(scriptName);
  return !!row;
}

// Fonction pour exécuter un script SQL
/**
 * Exécute un fichier SQL et enregistre son exécution dans l'historique des migrations.
 * @param scriptPath Chemin vers le fichier SQL à exécuter.
 */
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
  const scriptsDirectory = app.isPackaged ? path.join(process.resourcesPath, 'migrations') : './migrations';
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

  purgeEntite(entite: string): void {
    const resultat = db.prepare(`DELETE FROM ${entite}`).run();
    log.debug(`Purge de l'entité ${entite} effectuée. ${resultat.changes} lignes supprimées.`, resultat);
  },
  getCategorie(id: number): Categorie {
    return db.prepare<number, Categorie>('SELECT * FROM categories WHERE id=?').get(id);
  },
  getCategories(): Categorie[] {
    return db.prepare<unknown[], Categorie>('SELECT * FROM categories ORDER BY LOWER(nom) ASC').all();
  },
  addCategory(categorie: IdNom): RunResult {
    const stmt = db.prepare('INSERT INTO categories (nom) VALUES (?)');
    return stmt.run(categorie.nom);
  },
  updateCategory(categorie: IdNom): void {
    const stmt = db.prepare('UPDATE categories SET nom=? WHERE id=?');
    stmt.run(categorie.nom, categorie.id);
  },
  deleteCategory(id: number): void {
    const stmt = db.prepare('DELETE FROM categories WHERE id=?');
    stmt.run(id);
  },
  getFournisseur(id: number): Fournisseur {
    return db.prepare<number, Fournisseur>('SELECT * FROM fournisseurs WHERE id=?').get(id);
  },
  getFournisseurs(): Fournisseur[] {
    return db.prepare<unknown[], Fournisseur>('SELECT * FROM fournisseurs ORDER BY LOWER(nom) ASC').all();
  },
  addFournisseur(fournisseur: IdNom): RunResult {
    const stmt = db.prepare('INSERT INTO fournisseurs (nom) VALUES (?)');
    return stmt.run(fournisseur.nom);
  },
  updateFournisseur(fournisseur: IdNom): void {
    const stmt = db.prepare('UPDATE fournisseurs SET nom=? WHERE id=?');
    stmt.run(fournisseur.nom, fournisseur.id);
  },
  deleteFournisseur(id: number): void {
    const stmt = db.prepare('DELETE FROM fournisseurs WHERE id=?');
    stmt.run(id);
  },
  getUnite(id: number): Unite {
    return db.prepare<number, Unite>('SELECT * FROM unites WHERE id=?').get(id);
  },
  getUnites(): Unite[] {
    return db.prepare<unknown[], Unite>('SELECT * FROM unites ORDER BY LOWER(nom) ASC').all();
  },
  addUnite(unite: IdNom): RunResult {
    const stmt = db.prepare('INSERT INTO unites (nom) VALUES (?)');
    return stmt.run(unite.nom);
  },
  updateUnite(unite: IdNom): void {
    const stmt = db.prepare('UPDATE unites SET nom=? WHERE id=?');
    stmt.run(unite.nom, unite.id);
  },
  deleteUnite(id: number): void {
    const stmt = db.prepare('DELETE FROM unites WHERE id=?');
    stmt.run(id);
  },
  getProduits(): Produit[] {
    return db.prepare<unknown[], Produit>("SELECT produits.id, produits.nom AS nom, produits.prix_achat as prixAchat, produits.date_maj_prix as dateMajPrix, produits.taux, produits.prix_vente as prixVente, produits.categorie_id AS categorieId, categories.nom AS categorieNom, produits.fournisseur_id AS fournisseurId, fournisseurs.nom AS fournisseurNom, produits.unite_id AS uniteId, unites.nom AS uniteNom FROM produits LEFT JOIN categories ON produits.categorie_id = categories.id LEFT JOIN fournisseurs ON produits.fournisseur_id = fournisseurs.id LEFT JOIN unites ON produits.unite_id = unites.id ORDER BY LOWER(produits.nom) ASC").all();
  },
  rechercherProduit(query: string): Produit[] {
    return db.prepare<unknown[], Produit>("SELECT produits.id, produits.nom AS nom, produits.prix_achat as prixAchat, produits.date_maj_prix as dateMajPrix, produits.taux, produits.prix_vente as prixVente, produits.categorie_id AS categorieId, categories.nom AS categorieNom, produits.fournisseur_id AS fournisseurId, fournisseurs.nom AS fournisseurNom, produits.unite_id AS uniteId, unites.nom AS uniteNom FROM produits LEFT JOIN categories ON produits.categorie_id = categories.id LEFT JOIN fournisseurs ON produits.fournisseur_id = fournisseurs.id LEFT JOIN unites ON produits.unite_id = unites.id WHERE produits.nom LIKE ?1 OR categories.nom LIKE ?1 OR fournisseurs.nom LIKE ?1 ORDER BY LOWER(produits.nom) ASC").all({ 1: '%' + query + '%' });
  },
  addProduit(nom: string, prixAchat: number, taux: number, prixVente: number, categorie_id: number, fournisseur_id: number, unite_id: number): void {
    const stmt = db.prepare('INSERT INTO produits (nom, prix_achat, date_maj_prix, taux, prix_vente, categorie_id, fournisseur_id, unite_id) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)');
    stmt.run(nom, prixAchat, taux, prixVente, categorie_id, fournisseur_id, unite_id);
  },
  addProduits(produits: Produit[]): void {
    const stmt = db.prepare('INSERT INTO produits (nom, prix_achat, date_maj_prix, taux, prix_vente, categorie_id, fournisseur_id, unite_id) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)');

    const insertMany = db.transaction((produits: Produit[]) => {
      for (const produit of produits) {
        stmt.run(produit.nom, produit.prixAchat, produit.taux, produit.prixVente, produit.categorieId, produit.fournisseurId, produit.uniteId);
      }
    });

    insertMany(produits);
  },
  updateProduit(id: number, nom: string, prixAchat: number, taux: number, prixVente: number, categorieId: number, fournisseurId: number, uniteId: number): void {
    const stmt = db.prepare('UPDATE produits SET nom=?, prix_achat=?, date_maj_prix=CURRENT_TIMESTAMP, taux=?, prix_vente=?, categorie_id=?, fournisseur_id=?, unite_id=? WHERE id=?');
    stmt.run(nom, prixAchat, taux, prixVente, categorieId, fournisseurId, uniteId, id);
  },
  deleteProduit(id: number): void {
    const stmt = db.prepare('DELETE FROM produits WHERE id=?');
    stmt.run(id);
  },
  getContacts(): Contact[] {
    return db.prepare<unknown[], Contact>('SELECT * FROM contacts ORDER BY LOWER(nom) ASC, LOWER(prenom) ASC').all();
  },
  rechercherContacts(query: string): Contact[] {
    return db.prepare<unknown[], Contact>("SELECT * FROM contacts WHERE contacts.nom LIKE ?1 OR contacts.prenom LIKE ?1 OR (contacts.nom || ' ' || contacts.prenom) LIKE ?1 OR (contacts.prenom || ' ' || contacts.nom) LIKE ?1 ORDER BY nom ASC, prenom ASC").all({ 1: '%' + query + '%' });
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