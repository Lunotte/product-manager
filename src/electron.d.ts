export interface ElectronAPI {
    getData: () => Promise<any>;
    getCategories: () => Promise<any>;
  }
  
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}