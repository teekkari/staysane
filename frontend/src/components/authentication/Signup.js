import React from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import './Signup.css';

import API from '../Constants.js';


class Signup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            repeatPassword: "",
            showError: false,
            errorText: "",
        }

    }

    displayError = () => {
        if (this.state.showError) {
            return <Alert variant="danger">{this.state.errorText}</Alert>
        }
    }

    register = (event) => {
        event.preventDefault();


        const data = {
            email: this.state.email,
            password: this.state.password
        }

        axios.put(API.baseUrl + API.authentication, data)
            .then( (response) => {
                this.showSignupForm(false);
            })
            .catch( (error) => {

                let errorText = "";
                switch(error.response.data) {
                    case 'email_in_use':
                        errorText = "That email address is already in use!";
                        break;
                    case 'bad_email':
                        errorText = "Your email address is invalid.";
                        break;
                    case 'bad_password':
                        errorText = "Your password does not match the criteria.";
                        break;
                    case 'repeat_mismatch':
                        errorText = "Your passwords dont match.";
                        break;
                    default:
                        errorText = "Something went wrong while creating your account! Please try again."
                }

                this.setState({
                    showError: true,
                    errorText: errorText
                });
            });
    }

    render() {
        return(
            <div id="signup-wrapper">
                <h1>Sign up</h1>
                {this.displayError()}
                <Form>
                    <Form.Group controlId="email">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="email" placeholder="your.email@example.com" onChange={this.formChangeHandler}/>
                        <Form.Text className="text-muted">We will not send you unsolicited email!</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="your-SeCure-p4ssw0rd-here" onChange={this.formChangeHandler} />
                    </Form.Group>

                    <Form.Group controlId="repeat-password" className="hidden">
                        <Form.Label>Repeat the password</Form.Label>
                        <Form.Control type="password" placeholder="repeat your password" onChange={this.formChangeHandler} />
                    </Form.Group>

                    <Button variant="primary" type="submit" block onClick={this.register}>
                        Create account
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Signup;