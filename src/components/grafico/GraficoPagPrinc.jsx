import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import GraficoGastosFijos from "./GraficoGastosFijos"
import GraficoSaldos from './GraficoSaldos';


const TabContainer = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabSelect = (index) => {
    setSelectedTab(index);
  };

  return (
    <div className='contenedor-tabs'>
      <Tabs selectedIndex={selectedTab} onSelect={handleTabSelect}>
        <TabList>
          <Tab>Gastos Fijos</Tab>
          <Tab> Saldo</Tab>
        </TabList>

        <TabPanel>          
           <GraficoGastosFijos />  
        </TabPanel>
        <TabPanel>          
           <GraficoSaldos />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabContainer;
