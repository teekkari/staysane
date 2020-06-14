import React, { useState } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import ModuleHandler from './components/modules/ModuleHandler.js';
import Header from './components/header/Header.js';
import Login from './components/authentication/Login.js';
import Settings from './components/settings/Settings.js';


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
            <ModuleHandler />
          </Tab.Pane>

          <Tab.Pane eventKey="stats">
            stats here
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
