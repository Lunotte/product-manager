CREATE TABLE IF NOT EXISTS contacts_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  civilite TEXT NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT,
  nom_complet TEXT,
  adresse TEXT,
  adresse_bis TEXT,
  cp INTEGER,
  ville TEXT,
  telephone TEXT,
  email TEXT
);

INSERT INTO contacts_new (id, civilite, nom, prenom, nom_complet, adresse, adresse_bis, cp, ville)
SELECT id, civilite, nom, prenom, nom_complet, adresse, adresse_bis, cp, ville FROM contacts;

DROP TABLE contacts;

ALTER TABLE contacts_new RENAME TO contacts;
