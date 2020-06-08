import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import './ModuleSettings.css';

import EditModule from './EditModule.js';
import BasicModule from '../BasicModule.js';

import API from '../../Constants.js';


const cookies = new Cookies();

/*
 * Manages module list
 * Can be used to add and reorder modules
 * Shown in "Manage modules" modal (from ModuleHandler.js)
 */

class ModuleSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newModuleTitle: "",
            newModuleBody: "",
        }
    }


    showModuleList = () => {
        let output = [];

        for (let module of this.props.modules) {
            output.push(
                <EditModule module={module} removeModule={this.props.removeModule} />
            );
        }

        return output;
    }

    formChangeHandler = (event) => {
        this.setState({
            [event.target.attributes.id.value]: event.target.value
        });
    }

    addNew = () => {

        const data = {
            title: this.state.newModuleTitle,
            body: this.state.newModuleBody
        };

        const sessionKey = cookies.get('sessionKey');
        const authHeader = { 'Authorization': 'Bearer ' + sessionKey };

        axios.post(API.baseUrl + API.modules, data, {
            headers: authHeader
        }).then( (response) => {
            const insertedID = response.data;
            this.props.setModules( [...this.props.modules, <BasicModule key={insertedID} id={insertedID} title={data.title} body={data.body} />] );
        }).catch( error => console.log(error));
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
                        <FormControl id="newModuleTitle" aria-label="Title" onChange={this.formChangeHandler} />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Text</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl id="newModuleBody" as="textarea" aria-label="Text" onChange={this.formChangeHandler} placeholder="Remember to sleep 7-8 hours a day" />
                    </InputGroup>

                    <Button block variant="primary" onClick={this.addNew}>Add New</Button>
                </div>
            </div>
        );
    }
}


export default ModuleSettings;