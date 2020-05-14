import React from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import './BasicModule.css';

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
            status: 'default'
        }

    }

    complete = (event) => {
        event.target.classList.add("animate-out");

        // let the animation run before updating status and DOM
        setTimeout(() => {
            this.setState({
                status: 'complete'
            });
        }, 300);
        
    }

    showButton = () => {
        if (this.state.status === 'complete') {
            return (
            <div className="module-complete">
                <Alert className="animate-in" variant="success">Complete!</Alert>
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