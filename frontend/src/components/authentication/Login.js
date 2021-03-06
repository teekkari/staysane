import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import Signup from './Signup.js';


import API from '../Constants.js';


import './Login.css';

const cookies = new Cookies();

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            showSignup: false,
            showError: false,
            errorText: "",
        }

        // check if user is already authenticated
        // we dont care about the actual key here, it will be checked upon further requests
        const sessionKey = cookies.get('sessionKey');
        if (sessionKey !== undefined) {
            const authHeader = { 'Authorization': 'Bearer ' + sessionKey };
            axios.get(API.baseUrl + API.authentication, { headers: authHeader })
                .then( (response) => this.props.setAuthentication(true) )
                .catch( (error) => this.props.setAuthentication(false) );
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
                cookies.set('sessionKey', response.data.sessionKey, { maxAge: 60*60*24*14, sameSite: true });
                this.props.setAuthentication(true);
            })
            .catch( (error) => {
                console.log(error);
                loginButton.disabled = false;

                // jesari-fix to show error animation again on recurrent login attempts
                if (this.state.showError) this.setState({ showError: false });

                this.setState({
                    showError: true,
                    errorText: "We couldn't log you in. Is your email and password correct?",
                });
            });
    }

    showSignupForm = (bool) => {
        this.setState({ showSignup: bool });
    }

    register = (event) => {
        event.preventDefault();
        this.showSignupForm(true);
    }

    displayError = () => {
        if (this.state.showError) {
            return <Alert className="bounce-in" variant="danger">{this.state.errorText}</Alert>
        }
    }


    render() {

        if (this.state.showSignup) {
            return <Signup showSignupForm={this.showSignupForm} />;
        }

        return (
            <div id="login-wrapper">
                <img class="habitti-logo" src={process.env.PUBLIC_URL + '/habittilogo.png'} />
                <h1>Login</h1>
                {this.displayError()}
                <Form>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
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