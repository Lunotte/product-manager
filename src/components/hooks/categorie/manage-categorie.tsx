import { useEffect, useState } from "react";
import { Categorie } from "../../../models/Categorie";

/**
 * Hook React pour charger les catégories depuis le main process.
 * @returns `{ categories, setCategories, loading }`.
 */
export function useCategories() {
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.electronAPI.getCategories()
            .then((result) => setCategories(result))
            .catch((err) => window.electronAPI.logError(err))
            .finally(() => setLoading(false));
    }, []);

    return { categories, setCategories, loading };
}