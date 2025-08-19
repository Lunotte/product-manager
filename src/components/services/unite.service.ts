import { useEffect, useState } from "react";
import { Unite } from "../../models/Unite";

export function useUnites() {
  const [unites, setUnites] = useState<Unite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.electronAPI.getUnites()
      .then((result) => setUnites(result))
      .catch((err) => window.electronAPI.logError(err))
      .finally(() => setLoading(false));
  }, []);

  return { unites, setUnites, loading };
}