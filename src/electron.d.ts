export interface ElectronAPI {
    getData: () => Promise<any>;
    getCategories: () => Promise<any>;
    addCategorie: (name: string) => Promise<any>;
}
  
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}