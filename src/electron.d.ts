export interface ElectronAPI {
    getData: () => Promise<any>;
    getCategories: () => Promise<any>;
    getCategorie: (id: number) => Promise<any>;
    addCategorie: (nom: string) => Promise<any>;
    updateCategorie: (id: number, nom: string) => Promise<any>;
    deleteCategorie: (id: number) => Promise<any>;

    getFournisseurs: () => Promise<any>;
    addFournisseur: (nom: string) => Promise<any>;
    updateFournisseur: (id: number, nom: string) => Promise<any>;
    deleteFournisseur: (id: number) => Promise<any>;

    getUnites: () => Promise<any>;
    addUnite: (nom: string) => Promise<any>;
    updateUnite: (id: number, nom: string) => Promise<any>;
    deleteUnite: (id: number) => Promise<any>;
}
  
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}