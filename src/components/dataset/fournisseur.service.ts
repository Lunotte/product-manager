import { useEffect, useState } from "react";
import { Fournisseur } from "../..//models/Fournisseur";

export function useFournisseurs() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.electronAPI.getFournisseurs()
      .then((result) => setFournisseurs(result))
      .catch((err) => window.electronAPI.logError(err))
      .finally(() => setLoading(false));
  }, []);

  return { fournisseurs, setFournisseurs, loading };
}