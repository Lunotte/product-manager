export interface ElectronAPI {
    getData: () => Promise<any>;
    getCategories: () => Promise<any>;
    getCategorie: (id: number) => Promise<any>;
    addCategorie: (nom: string) => Promise<any>;
    updateCategorie: (id: number, nom: string) => Promise<any>;
    deleteCategorie: (id: number) => Promise<any>;
}
  
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}