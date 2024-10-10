// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getData: () => ipcRenderer.invoke('get-data'),
  getCategories: () => ipcRenderer.invoke('get-categories'),
  getCategorie: (id: number) => ipcRenderer.invoke('get-categories', id),
  addCategorie: (nom: string) => ipcRenderer.invoke('add-categorie', nom),
  updateCategorie: (id: number, nom: string) => ipcRenderer.invoke('update-categorie', id, nom),
  deleteCategorie: (id: number) => ipcRenderer.invoke('delete-categorie', id),
});