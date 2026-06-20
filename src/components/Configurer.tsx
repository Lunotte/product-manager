import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Categories from './Categories';
import Fournisseurs from './Fournisseurs';
import Unites from './Unites';
import Contacts from './Contacts';
import Snackbars from './hooks/utilitaires/Snackbars';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * Panneau utilisé pour l'affichage conditionnel du contenu d'un onglet.
 * @param props `children`, `value` et `index` pour contrôler l'affichage.
 */
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Génère les attributs d'accessibilité pour un onglet donné.
 * @param index Index de l'onglet.
 * @returns Objet contenant `id` et `aria-controls`.
 */
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

/**
 * Composant de la page de configuration regroupant catégories, fournisseurs, unités et contacts.
 */
export default function Configurer() {
  const [value, setValue] = React.useState(0);
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleAction = (event: { type: 'add' | 'update' | 'delete'; message: string }): void => {
    setSnackbar({ open: true, message: event.message });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="Onglets de configuration">
          <Tab label="Catégories" {...a11yProps(0)} />
          <Tab label="Fournisseurs" {...a11yProps(1)} />
          <Tab label="Unités" {...a11yProps(2)} />
          <Tab label="Contacts" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Categories onEvent={handleAction} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Fournisseurs onEvent={handleAction} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Unites onEvent={handleAction} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Contacts onEvent={handleAction} />
      </CustomTabPanel>

      <Snackbars
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </Box>
  );
}
