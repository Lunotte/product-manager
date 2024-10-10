// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // getData: () => ipcRenderer.invoke('get-data'),
  getCategories: () => ipcRenderer.invoke('get-categories'),
  getCategorie: (id: number) => ipcRenderer.invoke('get-categories', id),
  addCategorie: (nom: string) => ipcRenderer.invoke('add-categorie', nom),
  updateCategorie: (id: number, nom: string) => ipcRenderer.invoke('update-categorie', id, nom),
  deleteCategorie: (id: number) => ipcRenderer.invoke('delete-categorie', id),

  getFournisseurs: () => ipcRenderer.invoke('get-fournisseurs'),
  addFournisseur: (nom: string) => ipcRenderer.invoke('add-fournisseur', nom),
  updateFournisseur: (id: number, nom: string) => ipcRenderer.invoke('update-fournisseur', id, nom),
  deleteFournisseur: (id: number) => ipcRenderer.invoke('delete-fournisseur', id),

  getUnites: () => ipcRenderer.invoke('get-unites'),
  addUnite: (nom: string) => ipcRenderer.invoke('add-unite', nom),
  updateUnite: (id: number, nom: string) => ipcRenderer.invoke('update-unite', id, nom),
  deleteUnite: (id: number) => ipcRenderer.invoke('delete-unite', id),
});