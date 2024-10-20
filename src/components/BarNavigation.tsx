import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { Button, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BarNavigation() {

  const navigate = useNavigate(); 

  const handleCloseNavMenu = (page: string) => {
    navigate(page);
  };

  const handleBackup =() => {
    window.electronAPI.backup();
  }

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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default BarNavigation;
