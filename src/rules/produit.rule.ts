const validateProduit = (produitData: any): boolean => {
  // Vérification des champs requis
  if (!produitData.id || !produitData.nom || !produitData.categorieNom || !produitData.fournisseurNom || !produitData.uniteNom) {
    return false;
  }

  // Vérification des types de données
  if (!isNaN(produitData.id) ||
      typeof produitData.prixAchat !== 'number' ||
      typeof produitData.dateMajPrix !== 'string' ||
      typeof produitData.taux !== 'number' ||
      typeof produitData.prixVente !== 'number' ||
      typeof produitData.nom !== 'string' ||
      typeof produitData.categorieNom !== 'string' ||
      typeof produitData.fournisseurNom !== 'string' ||
      typeof produitData.uniteNom !== 'string') {
    return false;
  }

  // Vérification de la validité de l'ID
  const parsedId = parseInt(produitData.id, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    return false;
  }

  return true;
}