// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

import { Produit } from "../models/Produit";
import { Contact } from '../models/Contact';
import { IdNom } from '../models/IdNom';

contextBridge.exposeInMainWorld('electronAPI', {

  logError: (message: string) => ipcRenderer.send('log-error', message),
  backup: () => ipcRenderer.send('backup'),

  getCategories: () => ipcRenderer.invoke('get-categories'),
  addCategorie: (categorie: IdNom) => ipcRenderer.invoke('add-categorie', categorie),
  updateCategorie: (categorie: IdNom) => ipcRenderer.invoke('update-categorie', categorie),
  deleteCategorie: (id: number) => ipcRenderer.invoke('delete-categorie', id),

  getFournisseurs: () => ipcRenderer.invoke('get-fournisseurs'),
  addFournisseur: (fournisseur: IdNom) => ipcRenderer.invoke('add-fournisseur', fournisseur),
  updateFournisseur: (fournisseur: IdNom) => ipcRenderer.invoke('update-fournisseur', fournisseur),
  deleteFournisseur: (id: number) => ipcRenderer.invoke('delete-fournisseur', id),

  getUnites: () => ipcRenderer.invoke('get-unites'),
  addUnite: (unite: IdNom) => ipcRenderer.invoke('add-unite', unite),
  updateUnite: (unite: IdNom) => ipcRenderer.invoke('update-unite', unite),
  deleteUnite: (id: number) => ipcRenderer.invoke('delete-unite', id),



  importProduits: (produits: Produit[]) => ipcRenderer.invoke('import-produits', produits),

  getProduits: () => ipcRenderer.invoke('get-produits'),
  rechercherProduits: (query: string) => ipcRenderer.invoke('rechercher-produit', query),
  addProduit: (produit: Produit) => ipcRenderer.invoke('add-produit', produit),
  updateProduit: (produit: Produit) => ipcRenderer.invoke('update-produit', produit),
  deleteProduit: (id: number) => ipcRenderer.invoke('delete-produit', id),

  getContacts: () => ipcRenderer.invoke('get-contacts'),
  rechercherContacts: (query: string) => ipcRenderer.invoke('rechercher-contacts', query),
  addContact: (contact: Contact): Promise<Contact[]> => ipcRenderer.invoke('add-contact', contact),
  updateContact: (contact: Contact): Promise<Contact[]> => ipcRenderer.invoke('update-contact', contact),
  deleteContact: (id: number): Promise<Contact[]> => ipcRenderer.invoke('delete-contact', id),
});