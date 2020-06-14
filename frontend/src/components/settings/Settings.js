import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import API from '../Constants.js';

const cookies = new Cookies();

/*
 *  Handles settings for the application
 *  
 */

class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            moduleResetTime: "04:00"
        }
    }

    formChangeHandler = (event) => {
        this.setState({ [event.target.id]: event.target.value })
    }

    saveSettings = () => {
        const data = {
            moduleResetTime: this.state.moduleResetTime,
            UTCOffset: new Date().getTimezoneOffset()
        }

        const sessionKey = cookies.get('sessionKey');
        const authHeader = { 'Authorization' : 'Bearer ' + sessionKey };
        axios.post(API.baseUrl + API.settings, data, { headers: authHeader })
            .then( (response) => {
                console.log(response);
            }).catch( (error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div id="settings-wrapper">
                <h1>Settings</h1>
                <section>
                    <Form.Group>
                        <Form.Label>Card reset time</Form.Label>
                        <Form.Control id="moduleResetTime" type="time" onChange={this.formChangeHandler} />
                        <Form.Text className="text-muted">This will get rounded down to 30 minute steps.<br/>04:25 -&gt; 04:00</Form.Text>
                    </Form.Group>
                </section>

                <Button role="submit" onClick={this.saveSettings}>Save settings</Button>
            </div>
        );
    }
}

export default Settings;