import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { Button, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Contact } from '../models/Contact';
import { Produit } from '../models/Produit';

function BarNavigation() {

  const navigate = useNavigate(); 

  const [anchorElExport, setAnchorElExport] = React.useState<null | HTMLElement>(null);
  const openExportMenu = Boolean(anchorElExport);

  const [anchorElImport, setAnchorElImport] = React.useState<null | HTMLElement>(null);
  const openImportMenu = Boolean(anchorElImport);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCloseNavMenu = (page: string) => {
    navigate(page);
  };

  const handleBackup =() => {
    window.electronAPI.backup();
  }

  const handleClickExport = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElExport(event.currentTarget);
  };
  const handleCloseExportMenu = () => {
    setAnchorElExport(null);
  };

  const exportProduits = () => {
    window.electronAPI.getProduits().then((result) => {
      const csvData = convertToCSV(result);
      downloadCSV(csvData, 'Produits.csv');
    }).catch((err) => {
        window.electronAPI.logError(err);
    });
}

  const handleExportProduits = () => {
    exportProduits();
  }

  const exportContacts = () => {
    window.electronAPI.getContacts().then((result) => {
      const csvData = convertToCSV(result);
      downloadCSV(csvData, 'Contacts.csv');
    }).catch((err) => {
      window.electronAPI.logError(err);
    });
  }

  const handleExportContacts = () => {
    exportContacts();
  }

  const convertToCSV = (data: Contact[] | Produit[]): any => {
    const headers = Object.keys(data[0]).join(";") + "\n";
    const rows = data.map(row => Object.values(row).join(";")).join("\n");
    return headers + rows;
  };
  
  const downloadCSV = (csvData: any, filename = "data.csv") => {
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url); // Libérer la mémoire
  };



/**********************************
 * 
 *    Importation de produits 
 * 
 ***********************************/

  const handleClickImport = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElImport(event.currentTarget);
  };

  const handleCloseImportMenu = () => {
    setAnchorElImport(null);
  };


  const parseOptionalFloat = (value: string | undefined): number | undefined => {
    if (value === undefined || value === null || value.trim() === '') return undefined;
    // Gérer la virgule comme séparateur décimal
    const sanitizedValue = value.replace(',', '.');
    const num = parseFloat(sanitizedValue);
    return isNaN(num) ? undefined : num;
  };

  const parseCSVToProduits = (csvData: string): Produit[] => {
    const lines = csvData.replace(/^\uFEFF/, '').split(/\r?\n/); // Supprimer BOM, séparer les lignes
    
    let headerLineIndex = 0;
    while(headerLineIndex < lines.length && !lines[headerLineIndex].trim()) {
        headerLineIndex++; // Ignorer les lignes vides au début
    }

    if (headerLineIndex >= lines.length || lines.length < headerLineIndex + 2) {
        console.warn("Le CSV ne contient pas assez de données (entêtes + au moins une ligne de données).");
        return [];
    }

    const headers = lines[headerLineIndex].split(';').map(h => h.trim());
    const produits: Produit[] = [];

    for (let i = headerLineIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Ignorer les lignes vides

        const values = line.split(';');
        const produitData: any = {};
        headers.forEach((header, index) => {
            produitData[header] = values.length > index ? (values[index] || '').trim() : '';
        });

        let parsedId: number | null = null;
        if (produitData.id && produitData.id.toLowerCase() !== 'null' && produitData.id !== '') {
          const numId = parseInt(produitData.id, 10);
          if (!isNaN(numId)) { 
            parsedId = numId; 
          } else {
            console.warn(`ID invalide "${produitData.id}" trouvé pour le produit "${produitData.nom || 'N/A'}". L'ID sera traité comme nul.`);
          }
        }

        const produit: Produit = {
            id: parsedId,
            nom: produitData.nom || '',
            prixAchat: parseOptionalFloat(produitData.prixAchat),
            taux: parseOptionalFloat(produitData.taux),
            prixVente: parseOptionalFloat(produitData.prixVente),
            fournisseurNom: produitData.fournisseurNom || undefined,
            categorieNom: produitData.categorieNom || undefined,
            uniteNom: produitData.uniteNom || undefined,
            dateMajPrix: produitData.dateMajPrix || undefined,
        };
        
        if (produit.nom) { // Validation de base: un produit doit avoir un nom
            produits.push(produit);
        } else {
            console.warn("Produit ignoré car nom manquant:", produitData);
        }
    }
    return produits;
  };

  const handleImportProduitsFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        if (text) {
          try {
            const importedProduits = parseCSVToProduits(text);
            console.log("Produits importés:", importedProduits);
            
            if (importedProduits.length > 0) {
              await window.electronAPI.importProduits(importedProduits); 
              alert('Produits importés avec succès! Veuillez rafraîchir la liste des produits si nécessaire.');
              // Envisagez une manière plus intégrée de rafraîchir la liste des produits,
              // par exemple, via une mise à jour du contexte ou un bus d'événements.
            } else {
              alert('Aucun produit valide trouvé dans le fichier ou fichier vide.');
            }
          } catch (error: any) {
            console.error("Erreur lors de l'importation des produits:", error);
            window.electronAPI.logError(`Erreur importation CSV Produits: ${error.message || error}`);
            alert(`Erreur lors de l'importation: ${error.message || 'Erreur inconnue'}`);
          }
        }
      };
      reader.onerror = (error) => {
        console.error("Erreur de lecture du fichier:", error);
        window.electronAPI.logError("Erreur de lecture du fichier CSV pour importation.");
        alert("Erreur de lecture du fichier.");
      };
      reader.readAsText(file, 'UTF-8'); // Spécifier l'encodage
    }
    // Réinitialiser l'input pour permettre de sélectionner à nouveau le même fichier
    if (event.target) {
      event.target.value = ''; 
    }
  };

  const triggerProduitsImportInput = () => {
    handleCloseImportMenu(); // Fermer le menu d'abord
    fileInputRef.current?.click(); // Puis déclencher l'input de fichier
  };
  

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <Inventory2OutlinedIcon 
          onClick={() => handleCloseNavMenu('/main_window')}
          style={{cursor: 'pointer'}}
          sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} 
        />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
            <Button
                onClick={() => handleCloseNavMenu('/main_window')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Catalogue
            </Button>
            <Button
                onClick={() => handleCloseNavMenu('/configurer')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Configurer
            </Button>
            <Button
                onClick={() => handleCloseNavMenu('/panier')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Facture
            </Button>
            <Tooltip title="Faire une sauvegarde" arrow>
              <Button
                  onClick={() => handleBackup()}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Backup
              </Button>
            </Tooltip>

            <Tooltip title="Faire un export CSV" arrow>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                aria-controls={openExportMenu ? 'export-menu' : undefined}
                aria-haspopup="true"
                 aria-expanded={openExportMenu ? 'true' : undefined}
                onClick={handleClickExport}
              >
                Exports
              </Button>
            </Tooltip>
            <Menu
              id="export-menu"
              anchorEl={anchorElExport}
              open={openExportMenu}
              onClose={handleCloseExportMenu}
              MenuListProps={{
                'aria-labelledby': 'export-button',
              }}
            >
              <MenuItem onClick={handleExportProduits}>Produits</MenuItem>
              <MenuItem onClick={handleExportContacts}>Contacts</MenuItem>
            </Menu>

            <Tooltip title="Importer des données CSV" arrow>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                aria-controls={openImportMenu ? 'import-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openImportMenu ? 'true' : undefined}
                onClick={handleClickImport}
              >
                Imports
              </Button>
            </Tooltip>
            <Menu
              id="import-menu"
              anchorEl={anchorElImport}
              open={openImportMenu}
              onClose={handleCloseImportMenu}
              MenuListProps={{
                'aria-labelledby': 'import-button', // Assurez-vous que le bouton a cet id si nécessaire
              }}
            >
              <MenuItem onClick={triggerProduitsImportInput}>Importer Produits (CSV)</MenuItem>
            </Menu>
           
          </Box>
        </Toolbar>
      </Container>
        {/* Input de fichier caché pour l'importation CSV */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".csv"
        onChange={handleImportProduitsFileSelected}
      />
    </AppBar>
  );
}
export default BarNavigation;
