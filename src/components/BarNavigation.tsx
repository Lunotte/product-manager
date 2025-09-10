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
import { handleImportProduitsFileSelected } from './services/import-produit.service';
import DialogDialog, { DataDialog, TypeAlert } from './dialogs/AlerteDialog';

function BarNavigation() {

  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [eventImport, setEventImport] = React.useState<'PURGE' | 'BACKUP' | 'IMPORT' | 'NONE'>('NONE');
  const [dataDialog, setDataDialog] = React.useState<DataDialog>(null);

  const [anchorElExport, setAnchorElExport] = React.useState<null | HTMLElement>(null);
  const openExportMenu = Boolean(anchorElExport);

  const [anchorElImport, setAnchorElImport] = React.useState<null | HTMLElement>(null);
  const openImportMenu = Boolean(anchorElImport);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const fileRef = React.useRef<React.ChangeEvent<HTMLInputElement>>(null);

  const handleCloseNavMenu = (page: string) => {
    navigate(page);
  };

  const handleBackup = async () => {
    try {
      await window.electronAPI.backup();
    } catch (err) {
      window.electronAPI.logError(`Erreur backup avant import: ${err.message || err}`);
    }
  };

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

  /**
   *  Fermer le menu d'abord
   * Puis déclencher l'input de fichier
   */
  const triggerProduitsImportInput = () => {
    handleCloseImportMenu();
    fileInputRef.current?.click();
  };

  // const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const closeDialog = async () => {

    switch (eventImport) {
      case "PURGE":
        setOpenDialog(false);
        await handleBackup();
        setEventImport("BACKUP");
        setDataDialog({ message: "Backup terminé !", type: "success" });
        setOpenDialog(true);
        break;
      case "BACKUP":
        setOpenDialog(false);
        await handleImportProduitsFileSelected(fileRef.current);
        setEventImport("IMPORT");
        setDataDialog({ message: "Importation terminée !", type: "success" });
        setOpenDialog(true);
        break;
      default:
        setOpenDialog(false);
        setEventImport("NONE");
        setDataDialog(null);
        break;
    }
  }

  /**
   * Ouvre le dialog pour notifier l’utilisateur
   * @param event Le fichier
   */
  const handleOpenDialog = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventImport("PURGE");
    setDataDialog({ message: "Les données seront supprimées définitivement. Un backup est réalisé avant l'importation !", type: "warning" });
    setOpenDialog(true);
    fileRef.current = event;
  };


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Inventory2OutlinedIcon
            onClick={() => handleCloseNavMenu('/main_window')}
            style={{ cursor: 'pointer' }}
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

            <Button
              onClick={() => handleBackup()}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              <Tooltip title="Faire une sauvegarde" arrow>
                <span>Backup</span>
              </Tooltip>
            </Button>

            <Button
              sx={{ my: 2, color: 'white', display: 'block' }}
              aria-controls={openExportMenu ? 'export-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openExportMenu ? 'true' : undefined}
              onClick={handleClickExport}
            >
              <Tooltip title="Faire un export CSV" arrow>
                <span>Exports</span>
              </Tooltip>
            </Button>

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


            <Button
              sx={{ my: 2, color: 'white', display: 'block' }}
              aria-controls={openImportMenu ? 'import-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openImportMenu ? 'true' : undefined}
              onClick={handleClickImport}
            >
              <Tooltip title="Importer des données CSV" arrow>
                <span>Imports</span>
              </Tooltip>
            </Button>

            <Menu
              id="import-menu"
              anchorEl={anchorElImport}
              open={openImportMenu}
              onClose={handleCloseImportMenu}
              MenuListProps={{
                'aria-labelledby': 'import-button',
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
        onChange={e => handleOpenDialog(e)}
      />
      <DialogDialog
        open={openDialog}
        onClose={() => closeDialog()}
        data={dataDialog}
      />
    </AppBar>
  );
}
export default BarNavigation;
