  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    civilite TEXT NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    nom_complet TEXT NOT NULL,
    adresse TEXT NOT NULL,
    adresse_bis TEXT,
    cp INTEGER NOT NULL,
    ville TEXT NOT NULL
  );
