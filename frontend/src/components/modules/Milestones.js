import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import API from '../Constants.js';


import Card from 'react-bootstrap/Card';

import './Milestones.css';

const cookies = new Cookies();

class Milestones extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            milestones: [],
        };

    }

    componentDidMount() {

        const sessionKey = cookies.get('sessionKey');

        axios.get(API.baseUrl + API.stats, { headers: { 'Authorization': 'Bearer ' + sessionKey } }).then( (res) => {
            console.log(res.data);
            this.setState({
                milestones: res.data,
            });
        }).catch( (error) => console.log(error));
    }


    renderMilestoneDays = () => {
        let output = [];
        for(let i = 0; i < 7; i++) {
            let classString = "milestones-day";
            if (this.state.milestones[i] !== undefined) {
                classString += " ";
                if (this.state.milestones[i].completed == this.state.milestones[i].total) {
                    classString += "day-complete";
                } else if (this.state.milestones[i].completed > 0) {
                    classString += "day-semicomplete";
                }
            }
            output.push(<span class={classString}></span>);
        }
        return output;
    }

    render() {
        return <section id="milestones">
            <Card style={{ margin: "10px 0px" }}>
                <Card.Body>
                    <Card.Title>Last 7 days</Card.Title>
                    <div id="last-7-days">
                        {this.renderMilestoneDays()}
                    </div>
                </Card.Body>
            </Card>
        </section>
    }
}


export default Milestones;