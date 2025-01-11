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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleCloseNavMenu = (page: string) => {
    navigate(page);
  };

  const handleBackup =() => {
    window.electronAPI.backup();
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                Exports
              </Button>
            </Tooltip>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleExportProduits}>Produits</MenuItem>
              <MenuItem onClick={handleExportContacts}>Contacts</MenuItem>
            </Menu>
           
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default BarNavigation;
