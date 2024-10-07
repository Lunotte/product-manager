export interface ElectronAPI {
    getData: () => Promise<any>;
  }
  
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}