ALTER TABLE produits ADD date_maj_prix DATETIME;
UPDATE produits SET date_maj_prix = CURRENT_TIMESTAMP;