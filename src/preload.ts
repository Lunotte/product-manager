// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getData: () => ipcRenderer.invoke('get-data'),
  getCategories: () => ipcRenderer.invoke('get-categories'),
  addCategorie: (name: string) => ipcRenderer.invoke('add-categorie', name),
});