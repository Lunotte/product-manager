export type FieldSpec = {
    logicalName: string;
    variants: string[];
    mustBeNumeric?: boolean;
};

export const importRules = {
    // Champs à valider comme requis avant import
    requiredDbFields: [
        { logicalName: 'nom', variants: ['nom', 'name', 'produit', 'product', 'designation', 'designation_produit', 'nom_produit'] },
        { logicalName: 'categorieNom', variants: ['categorie', 'categorieNom', 'categorie_nom', 'category'] },
        { logicalName: 'fournisseurNom', variants: ['fournisseur', 'fournisseurNom', 'fournisseur_nom', 'supplier'] },
        { logicalName: 'uniteNom', variants: ['unite', 'uniteNom', 'unite_nom', 'unit'] },
        { logicalName: 'prixAchat', variants: ['prixAchat', 'prix_achat', 'prix achat', 'prix-achat'], mustBeNumeric: true },
        { logicalName: 'taux', variants: ['taux', 'taux_tva', 'tauxTVA', 'taux-tva'], mustBeNumeric: true },
        { logicalName: 'prixVente', variants: ['prixVente', 'prix_vente', 'prix vente', 'prix-vente', 'prix de vente', 'prixdevente'], mustBeNumeric: true },
    ] as FieldSpec[],

    // Autoriser des nombres négatifs (false par défaut)
    allowNegativeNumbers: false,

    // Si vrai, si prixVente < prixAchat alors générer un warning plutôt qu'une erreur
    prixVenteLessIsWarning: true,

    // Si true, comparer prixVente >= prixAchat (appliqué selon prixVenteLessIsWarning)
    enforcePrixVenteComparison: true,
    // Champs obligatoires minimum pour un import réussi
    mandatoryFields: ['nom', 'prixAchat', 'taux', 'prixVente'] as string[],
};
