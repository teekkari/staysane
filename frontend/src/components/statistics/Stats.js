import React from 'react';
import { Line } from 'react-chartjs-2';
import Cookies from 'universal-cookie';

import axios from 'axios';

import API from '../Constants';


import './Stats.css';

const cookies = new Cookies();

class Stats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            data: {}
        }
    }

    componentDidMount() {
        // do fetching stuff here

        const sessionKey = cookies.get('sessionKey');

        axios.get(API.baseUrl + API.stats + '/year', { headers: { 'Authorization': 'Bearer ' + sessionKey } }).then( (res) => {
            console.log(res.data);


            let labels = [];
            let avgvalues = [];
            let numvalues = [];


            let startDate = new Date(res.data[0].date);
            const endDate = new Date();

            while (startDate < endDate) {

                const isoDate = startDate.toISOString().split('T')[0];
                let value = res.data.find(x => x.date === isoDate);

                let completed = 0;

                if (value !== undefined) {
                    completed = value.completed;
                    value = parseInt(value.completed / value.total * 100);
                } else value = 0;

                labels.push(isoDate);
                avgvalues.push(value);
                numvalues.push(completed);

                startDate.setDate(startDate.getDate() + 1);
            }

            let streak = 0;
            let index = numvalues.length - 1;
            while (numvalues[index] !== 0) {
                streak += 1;
                index += -1;
            }


            this.setState({
                isLoaded: true,
                data: {
                    streak: streak,
                    avgper: {
                        labels: labels,
                        datasets: [
                            {
                                fill: false,
                                lineTension: 0.5,
                                backgroundColor: '#0e59b9',
                                borderColor: '#0e59b9',
                                borderWidth: 3,
                                label: 'AVG completition %',
                                data: avgvalues,
                            }
                        ]
                    },
                    numof: {
                        labels: labels,
                        datasets: [
                            {
                                fill: false,
                                lineTension: 0.5,
                                backgroundColor: '#0e59b9',
                                borderColor: '#0e59b9',
                                borderWidth: 3,
                                label: '# of tasks complete',
                                data: numvalues,
                            }
                        ]
                    }
                }
            });
        }).catch( (error) => console.log(error));

    }


    printNonZero() {
        let output = this.state.data.streak;

        return output;
    }



    render() {

        if (this.state.isLoaded) {

            return <div>
                <h1>Statistics</h1>
                <div className="stat-container">
                    <h2>Non-Zero days in a row</h2>
                    <div className="nonzero-days-num">
                        {this.printNonZero()}
                    </div>
                </div>

                <div className="stat-container">
                    <h2># of tasks complete</h2>
                    <Line data={this.state.data.numof} />
                </div>

                <div className="stat-container">
                    <h2>AVG % complete</h2>
                    <Line data={this.state.data.avgper} />
                </div>
            </div>;
        } else {

            return <div>
                <h1>Statistics</h1>
                <div className="stat-container">
                    Loading statistics...
                </div>
            </div>;
        }
    }
}

export default Stats;