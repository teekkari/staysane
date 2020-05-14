import React from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import BasicModule from './BasicModule.js';
import './BasicModule.css';


const Colors = {
    blue: "blue",
    red: "red",
}

// Predefined modules for basic health needs
// Can be rendered by just calling DefaultModules.modulename in JSX
const DefaultModules = {
    sleep: <BasicModule title="sleep" body="You should sleep for 7-8 hours a day!" />,
    exercise: <BasicModule title="exercise" body="Exercise at least twice a week." />,
    food: <BasicModule title="nutrition" body="Remember to eat your greens" />,
    creativity: <BasicModule title="creativity" body="Do something creative or new today!" />,
    comfortzone: <BasicModule title="comfort zone" body="Do a single thing outside of your comfort zone, big or small (or very small!)." />,
    testmodule: <BasicModule
                    title="this title is so long that it doesnt fit"
                    body="this body is also very long and takes up multiple lines and hopefully still works fine and i see no reason why it shouldnt work fine. its just a paragraph after all."
                />
}

/*
 * ModuleHandler takes care of the whole module list.
 * The modules are stored in state.modules
 * Props: None
 */

class ModuleHandler extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            showNewModuleModal: false,
            modules: [
                DefaultModules.testmodule,
                DefaultModules.sleep,
                DefaultModules.exercise,
                DefaultModules.comfortzone,
            ]
        }

    }

    addNewModule = () => {
        this.setState({
            showNewModuleModal: true
        });
    }

    renderModules = () => {
        return this.state.modules;
    }

    renderAddNewModule = () => {
        return(
            <div id="add-module" className="fake-module" onClick={this.addNewModule}>
                <svg className="bi bi-plus-circle" width="70px" height="70px" viewBox="0 0 16 16" fill="#aaa" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H4a.5.5 0 010-1h3.5V4a.5.5 0 01.5-.5z" clipRule="evenodd"/>
                    <path fillRule="evenodd" d="M7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8.5V12a.5.5 0 01-1 0V8z" clipRule="evenodd"/>
                    <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z" clipRule="evenodd"/>
                </svg>
            </div>
        );
    }

    renderNewModuleModal = () => {
        //if (!this.state.showNewModuleModal) return;

        return(
            <Modal show={this.state.showNewModuleModal} onHide={ () => { this.setState({ showNewModuleModal: false }); }}>
                <Modal.Header closeButton>
                    <Modal.Title>New health module!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Options for new modals go here.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={ () => { this.setState({ showNewModuleModal: false })}}>
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        return (
            <div id="module-list">
                {this.renderModules()}
                {this.renderAddNewModule()}
                {this.renderNewModuleModal()}
            </div>
        )
    }

}

export default ModuleHandler;