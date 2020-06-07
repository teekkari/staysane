import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


import API from '../Constants.js';


import './Login.css';

const cookies = new Cookies();

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
        }
    }

    formChangeHandler = (event) => {
        this.setState({
            [event.target.attributes.id.value]: event.target.value   
        });
    }

    // submits a POST request to authentication API
    submitLogin = (event) => {
        event.preventDefault();

        const loginButton = event.target;
        loginButton.disabled = true;

        const data = {
            email: this.state.email,
            password: this.state.password
        }

        axios.post(API.baseUrl + API.authentication, data)
            .then( (response) => {
  
                // store session key in a cookie and mark session as authenticated
                cookies.set('sessionKey', response.data.key, { maxAge: 60*60*24*14, sameSite: true });
                this.props.setAuthentication(true);
            })
            .catch( (error) => {
                console.log(error);
                loginButton.disabled = false;
            });
    }

    register = (event) => {
        event.preventDefault();


        const data = {
            email: this.state.email,
            password: this.state.password
        }

        axios.put(API.baseUrl + API.authentication, data)
            .then( (response) => {
                console.log(response);
            })
            .catch( (error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div id="login-wrapper">
                <h1>Login</h1>
                <Form>
                    <Form.Group controlId="email">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="email" placeholder="your.email@example.com" onChange={this.formChangeHandler}/>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="your-SeCure-p4ssw0rd-here" onChange={this.formChangeHandler} />
                    </Form.Group>

                    <Button variant="primary" type="submit" block onClick={this.submitLogin}>
                        Login
                    </Button>

                    <Button variant="outline-secondary" block onClick={this.register}>
                        Sign up
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Login;