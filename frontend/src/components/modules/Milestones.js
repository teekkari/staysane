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
            console.log(res);
            /*this.setState({
                milestones: res,
            });*/
        }).catch( (error) => console.log(error));
    }

    render() {
        return <section id="milestones">
            <Card style={{ margin: "10px 0px" }}>
                <Card.Body>
                    <Card.Title>Last 7 days</Card.Title>
                    <div id="last-7-days">
                        <span class="milestones-day"></span>
                        <span class="milestones-day"></span>
                        <span class="milestones-day day-complete"></span>
                        <span class="milestones-day day-semicomplete"></span>
                        <span class="milestones-day"></span>
                        <span class="milestones-day day-complete"></span>
                        <span class="milestones-day"></span>
                    </div>
                </Card.Body>
            </Card>
        </section>
    }
}


export default Milestones;