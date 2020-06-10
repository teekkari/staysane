import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import API from '../Constants.js';

import './BasicModule.css';

const cookies = new Cookies();

/*
 *  BasicModule is the most basic card to be displayed
 *  Has a title, body and a complete button
 *  Props:
 *      <title> : string
 *      <body> : string
 *      [color] : string default '#ebfaff'
 */
class BasicModule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: props.title,
            body: props.body,
            color: props.color || '#ebfaff',
            isDone: this.props.isDone || false,
            animateIn: false,
        }

    }

    complete = (event) => {
        const sessionKey = cookies.get('sessionKey');
        const authHeader = { 'Authorization': 'Bearer ' + sessionKey };

        axios.put(API.baseUrl + API.modules + '/' + this.props.id, { isDone: true }, { headers: authHeader })
            .then( (response) => {
                console.log(response);
            }).catch( (error) => {
                console.log(error);
            })


        event.target.classList.add("animate-out");

        // let the animation run before updating status and DOM
        setTimeout(() => {
            this.setState({
                isDone: true,
                animateIn: true,
            });
        }, 300);
        
    }

    showButton = () => {
        if (this.state.isDone) {
            return (
            <div className="module-complete">
                <Alert className={this.state.animateIn ? "animate-in" : ""} variant="success">Complete!</Alert>
            </div>);
        } else {
            return (
                <div className="module-complete">
                    <Button onClick={this.complete} variant="outline-primary" block>Done!</Button>
                </div>);
        }
    }


    render() {
        return(
            <Card style={{
                margin: "10px 0px",
                backgroundColor: this.state.color
            }}>
                <Card.Body>
                    <Card.Title className="module-title">{this.state.title}</Card.Title>
                    <Card.Text>{this.state.body}</Card.Text>
                    {this.showButton()}
                </Card.Body>
            </Card>
        );
    }
}

export default BasicModule;