import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

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

    addNew = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

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
            this.setState({
                newModuleTitle: "",
                newModuleBody: ""
            });
            form.reset();
        }).catch( error => console.log(error));
    }


    render() {
        return(
            <div id="settings-module-list">
                {this.showModuleList()}
                <hr/>

                <div id="settings-add-module">

                    <h5 className="mb-3">Add custom card</h5>
                    <Form onSubmit={this.addNew}>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Title</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control id="newModuleTitle" aria-label="Title" required value={this.state.newModuleTitle} onChange={this.formChangeHandler} />
                            </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Text</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control id="newModuleBody" as="textarea" aria-label="Text" value={this.state.newModuleBody} onChange={this.formChangeHandler} />
                        </InputGroup>

                        <Button block variant="primary" type="submit">Add New</Button>
                    </Form>
                </div>
            </div>
        );
    }
}


export default ModuleSettings;