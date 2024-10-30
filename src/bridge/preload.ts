// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

import { Produit } from "../models/Produit";
import { Contact } from '../models/Contact';

contextBridge.exposeInMainWorld('electronAPI', {

  logError: (message: string) => ipcRenderer.send('log-error', message),
  backup: (url: string) => ipcRenderer.send('backup', url),

  getCategories: () => ipcRenderer.invoke('get-categories'),
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

  getProduits: () => ipcRenderer.invoke('get-produits'),
  rechercherProduits: (query: string) => ipcRenderer.invoke('rechercher-produit', query),
  addProduit: (produit: Produit) => ipcRenderer.invoke('add-produit', produit),
  updateProduit: (produit: Produit) => ipcRenderer.invoke('update-produit', produit),
  deleteProduit: (id: number) => ipcRenderer.invoke('delete-produit', id),

  getContacts: () => ipcRenderer.invoke('get-contacts'),
  addContact: (contact: Contact) => ipcRenderer.invoke('add-contact', contact),
  updateContact: (contact: Contact) => ipcRenderer.invoke('update-contact', contact),
  deleteContact: (id: number) => ipcRenderer.invoke('delete-contact', id),
});