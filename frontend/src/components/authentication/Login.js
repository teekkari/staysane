import React from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


import API from '../Constants.js';


import './Login.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    submitLogin = (event) => {
        event.preventDefault();
        event.target.disabled = true;



    }

    render() {
        return (
            <div id="login-wrapper">
                <h1>Login</h1>
                <Form>
                    <Form.Group controlId="userEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="email" placeholder="your.email@example.com" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="your-secure-password-here" />
                    </Form.Group>

                    <Button variant="primary" type="submit" block onClick={this.submitLogin}>
                        Login
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Login;