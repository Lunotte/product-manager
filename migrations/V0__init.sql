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
