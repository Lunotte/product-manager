import { useCallback, useEffect, useState } from "react";
import { Fournisseur } from "../../../models/Fournisseur";

export function useFournisseurs() {
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [loading, setLoading] = useState(true);

    const reloadFournisseurs = useCallback(() => {
        setLoading(true);
        window.electronAPI.getFournisseurs()
            .then((result) => setFournisseurs(result))
            .catch((err) => window.electronAPI.logError(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        reloadFournisseurs();
    }, [reloadFournisseurs]);

    return { fournisseurs, setFournisseurs, loading, reloadFournisseurs };
}
