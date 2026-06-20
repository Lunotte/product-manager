import { useCallback, useEffect, useState } from "react";
import { Contact } from "../../models/Contact";

/**
 * Hook React pour charger et recharger la liste des contacts depuis le main process.
 * @returns `{ contacts, setContacts, loading, reloadContacts }`.
 */
export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadContacts = useCallback(() => {
    setLoading(true);
    window.electronAPI.getContacts()
      .then((result) => setContacts(result))
      .catch((err) => window.electronAPI.logError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reloadContacts();
  }, [reloadContacts]);


  return { contacts, setContacts, loading, reloadContacts };
}
