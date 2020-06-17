import React from 'react';

import Card from 'react-bootstrap/Card';

import './Milestones.css';

// TODO: get stats from DB

class Milestones extends React.Component {
    constructor(props) {
        super(props);
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