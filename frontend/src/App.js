import React, { useState } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import Tab from 'react-bootstrap/Tab';

import ModuleHandler from './components/modules/ModuleHandler.js';
import Milestones from './components/modules/Milestones.js';
import Header from './components/header/Header.js';
import Login from './components/authentication/Login.js';
import Settings from './components/settings/Settings.js';
import Stats from './components/statistics/Stats.js';


/*
 * Main handler for the application views
 * Basically controls (well, <Header /> does..) which tab is active
 * Tab keys:
 *  "modules"
 *  "stats"
 */


function App() {

  // activeView is used to manage tab keys, defaults to "modules"
  const [activeView, setView] = useState("modules");


  const [userAuthenticated, setAuthentication] = useState(false);

  if (!userAuthenticated) {
    return (<Login setAuthentication={setAuthentication} />);
  }



  return (<>
    <Header setView={setView} />

    <main>

      <Tab.Container activeKey={activeView}>

        <Tab.Content>

          <Tab.Pane eventKey="modules">
            <Milestones />
            <ModuleHandler />
          </Tab.Pane>

          <Tab.Pane eventKey="stats">
            <Stats />
          </Tab.Pane>

          <Tab.Pane eventKey="settings">
            <Settings />
          </Tab.Pane>

        </Tab.Content>

      </Tab.Container>

    </main>
  </>);
}

export default App;
