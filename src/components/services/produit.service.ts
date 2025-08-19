import { useCallback, useEffect, useState } from "react";
import { Produit } from "../../models/Produit";

export function useProduits() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadProduits = useCallback(() => {
    setLoading(true);
    window.electronAPI.getProduits()
      .then((result) => setProduits(result))
      .catch((err) => window.electronAPI.logError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reloadProduits();
  }, [reloadProduits]);

  return { produits, setProduits, loading, reloadProduits };
}
