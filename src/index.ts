import { app, BrowserWindow, ipcMain } from 'electron';

import db from './database';

// const db = require('./src/database');

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 1000,
    width: 1200,
    // autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,  // Garder Node.js désactivé dans le rendu
      contextIsolation: true,  // Pour des raisons de sécurité
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if(!app.isPackaged){
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }
};

ipcMain.handle('get-categories', () => {
  return db.getCategories();
});

ipcMain.handle('get-categorie', (_, id: number) => {
  return db.getCategorie(id);
});

ipcMain.handle('add-categorie', (_, nom: string) => {
  db.addCategory(nom);
  return db.getCategories();
});

ipcMain.handle('update-categorie', (_, id: number, nom: string) => {
  db.updateCategory(nom, id);
  return db.getCategories();
});

ipcMain.handle('delete-categorie', (_, id: number) => {
  db.deleteCategory(id);
  return db.getCategories();
});


// ipcMain.handle('get-fournisseurs', () => {
//   console.log(db);
  
//   return db.getFournisseurs;
//   // return null;
// });


ipcMain.handle('get-fournisseurs', () => {
  return db.getFournisseurs();
});

ipcMain.handle('add-fournisseur', (_, nom: string) => {
  db.addFournisseur(nom);
  return db.getFournisseurs();
});

ipcMain.handle('update-fournisseur', (_, id: number, nom: string) => {
  db.updateFournisseur(nom, id);
  return db.getFournisseurs();
});

ipcMain.handle('delete-fournisseur', (_, id: number) => {
  db.deleteFournisseur(id);
  return db.getFournisseurs();
});



ipcMain.handle('get-unites', () => {
  return db.getUnites();
});

ipcMain.handle('add-unite', (_, nom: string) => {
  db.addUnite(nom);
  return db.getUnites();
});

ipcMain.handle('update-unite', (_, id: number, nom: string) => {
  db.updateUnite(nom, id);
  return db.getUnites();
});

ipcMain.handle('delete-unite', (_, id: number) => {
  db.deleteUnite(id);
  return db.getUnites();
});



// ipcMain.handle('get-data', (event, args) => {
//   // console.log('toto');
//   return [{
//     id: 1,
//     name: 'Toto'
//   }];
// });

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
