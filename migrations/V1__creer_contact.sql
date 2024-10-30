  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    adresse TEXT NOT NULL,
    adresse_bis TEXT,
    cp INTEGER NOT NULL,
    ville TEXT NOT NULL
  );
