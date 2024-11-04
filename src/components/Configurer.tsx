import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import EditProduitDialog from './dialogs/EditProduitDialog';
import Categories from './Categories';
import Fournisseurs from './Fournisseurs';
import Unites from './Unites';
import Contacts from './Contacts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Configurer() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Catégories" {...a11yProps(0)} />
                <Tab label="Fournisseurs" {...a11yProps(1)} />
                <Tab label="Unités" {...a11yProps(2)} />
                <Tab label="Contacts" {...a11yProps(3)} />
            </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
            <Categories/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
            <Fournisseurs/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
            <Unites/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
            <Contacts/> 
        </CustomTabPanel>
    </Box>
  );
}
