import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';

import ModuleHandler from './components/modules/ModuleHandler.js';
import Header from './components/header/Header.js';

function App() {
  return (<>
    <Header />
    
    <main>

      <Tab.Container defaultActiveKey="modules">

        <Nav justify variant="pills">

          <Nav.Item>
            <Nav.Link eventKey="modules">Modules</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="stats">Stats</Nav.Link>
          </Nav.Item>

        </Nav>

        <hr />

        <Tab.Content>

          <Tab.Pane eventKey="modules">
            <ModuleHandler />
          </Tab.Pane>

          <Tab.Pane eventKey="stats">
            stats here
          </Tab.Pane>

        </Tab.Content>

      </Tab.Container>
    </main>
  </>);
}

export default App;
