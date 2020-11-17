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
            return <Alert className="bounce-in" variant="danger">{this.state.errorText}</Alert>
        }
    }

    formChangeHandler = (event) => {
        this.setState({
            [event.target.attributes.id.value]: event.target.value   
        });
    }

    register = (event) => {
        event.preventDefault();


        const data = {
            email: this.state.email,
            password: this.state.password,
            repeatPassword: this.state.repeatPassword
        }

        axios.put(API.baseUrl + API.authentication, data)
            .then( (response) => {
                this.props.showSignupForm(false);
            })
            .catch( (error) => {
                // if error.response defined => server responded with a specific error
                if (error.response) {
                    console.log(error.response);

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

                    // jesari-fix to show error animation again on recurrent login attempts
                    if (this.state.showError) this.setState({ showError: false });

                    this.setState({
                        showError: true,
                        errorText: errorText
                    });
                } else { // no error.response, it's probably unhandled promise
                    console.log(error);
                }
            });
    }

    render() {
        return(
            <div id="signup-wrapper">
                <h1>Sign up</h1>
                {this.displayError()}
                <Form>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="your.email@example.com" onChange={this.formChangeHandler}/>
                        <Form.Text className="text-muted">We will not send you unsolicited email!</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="your-SeCure-p4ssw0rd-here" onChange={this.formChangeHandler} />
                        <Form.Text className="text-muted">Your password must be at least 8 characters long.</Form.Text>
                    </Form.Group>

                    <Form.Group controlId="repeatPassword">
                        <Form.Label>Repeat the password</Form.Label>
                        <Form.Control type="password" placeholder="repeat your password" onChange={this.formChangeHandler} />
                    </Form.Group>

                    <Button variant="primary" type="submit" block onClick={this.register}>
                        Create account
                    </Button>

                    <Button variant="outline-secondary" block onClick={ () => this.props.showSignupForm(false)}>
                        Back
                    </Button>

                </Form>
            </div>
        );
    }
}

export default Signup;