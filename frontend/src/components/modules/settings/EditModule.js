import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import API from '../../Constants.js';

const cookies = new Cookies();

class EditModule extends React.Component {

    constructor(props) {
        super(props);

        this.saveCounter = 0;

        this.state = {
            open: false,
            confirmDeletion: false,
            id: this.props.module.props.id,
            title: this.props.module.props.title,
            body: this.props.module.props.body,
        };

        console.log(this.props);

    }

    toggleCollapse = () => {
        this.setState({
            open: !this.state.open
        });
    }


    handleChange = (event) => {

        // 'body-text' or 'title-text'
        const target = event.currentTarget;
        const targetRole = target.getAttribute('role');

        switch (targetRole) {
            case 'title-text':
                this.setState({ title: target.value });
            case 'body-text':
                this.setState({ body: target.value });
                break;
        }


        // auto save created by stacking adding and delayed substract
        const waitingTime = 1200; // ms

        this.saveCounter += 1;
        setTimeout( () => {

            this.saveCounter += -1;
            if (this.saveCounter == 0) {

                this.updateBackend();
            }

        }, waitingTime);
        
    }


    updateBackend = () => {
        const data = {
            title: this.state.title,
            body: this.state.body
        };

        const sessionKey = cookies.get('sessionKey');
        const authHeader = { 'Authorization': 'Bearer ' + sessionKey };

        const id = '/' + this.state.id;

        axios.put(API.baseUrl + API.modules + id, data, { headers: authHeader })
            .then( (response) => {

                console.log("updated db");

            }).catch( error => console.log(error));

    }



    delete = () => {
        if (this.state.confirmDeletion) {
            const sessionKey = cookies.get('sessionKey');
            const authHeader = { 'Authorization': 'Bearer ' + sessionKey };
            const moduleID = this.props.module.props.id;
            console.log(moduleID);

            axios.delete(API.baseUrl + API.modules + '/' + moduleID, { headers: authHeader }).then( (response) => {
                console.log(response);
                this.props.removeModule(moduleID);
            }).catch( (error) => {
                console.log(error.response);
            });
        } else {
            this.setState({ confirmDeletion: true });
        }
    }

    // TODO: fix cancel chaining
    cancelDelete = (event) => {
        if (event.target.toString() === '[object HTMLButtonElement]') return;
        this.setState({ confirmDeletion: false });
    }

    render() {
        return(
            <div class="settings-edit-module-wrapper" onTouchStart={this.cancelDelete} >

                <div className="settings-module" onClick={this.toggleCollapse} >
                    <div className="settings-module-title">{this.props.module.props.title}</div>
                    <div className="settings-module-actions">
                    <svg class="bi bi-chevron-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" clip-rule="evenodd"/>
                    </svg>
                    </div>
                </div>

                <Collapse in={this.state.open}>
                    <div class="settings-module-fields">
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Title</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Title" role="title-text" onChange={this.handleChange} value={this.state.title} />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Details</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl as="textarea"  role="body-text" aria-label="Desc." onChange={this.handleChange} value={this.state.body} />
                        </InputGroup>
                        <Button className="mb-3" block size="sm" variant={this.state.confirmDeletion ? 'danger' : 'outline-danger'} onClick={this.delete} onBlur={this.cancelDelete}>
                            {this.state.confirmDeletion ? 'Confirm removal' : 'Remove'}
                        </Button>
                    </div>
                </Collapse>
            </div>
        );
    }

}

export default EditModule;