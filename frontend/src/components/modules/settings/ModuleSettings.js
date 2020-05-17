import React from 'react';

import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import './ModuleSettings.css';

import EditModule from './EditModule.js';

/*
 * Manages module list
 * Can be used to add and reorder modules
 * Shown in "Manage modules" modal (from ModuleHandler.js)
 */

class ModuleSettings extends React.Component {
    constructor(props) {
        super(props);
    }


    showModuleList = () => {
        let output = [];

        for (let module of this.props.modules) {
            output.push(
                <EditModule module={module} />
            );
        }

        return output;
    }


    render() {
        return(
            <div id="settings-module-list">
                {this.showModuleList()}
                <hr/>

                <div id="settings-add-module">

                    <h5 className="mb-3">Add custom card</h5>

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Title</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Title" />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Text</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl as="textarea" aria-label="Text" placeholder="Remember to sleep 7-8 hours a day" />
                    </InputGroup>

                    <Button block variant="primary">Add New</Button>
                </div>
            </div>
        );
    }
}


export default ModuleSettings;