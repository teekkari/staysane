import React from 'react';
import { Line } from 'react-chartjs-2';
import Cookies from 'universal-cookie';

import axios from 'axios';

import API from '../Constants';


import './Stats.css';
import Button from 'react-bootstrap/Button';

const cookies = new Cookies();

class Stats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            dataAvailable: false,
            show: 'week',
            labels: [],
            avgvalues: [],
            numvalues: [],
            streak: 0,
        }
    }

    componentDidMount() {
        // do fetching stuff here

        const sessionKey = cookies.get('sessionKey');

        axios.get(API.baseUrl + API.stats + '/year', { headers: { 'Authorization': 'Bearer ' + sessionKey } }).then( (res) => {
            console.log(res.data);

            // no stats yet for user
            if (res.data.length < 1) {
                this.setState({
                    isLoaded: true,
                    dataAvailable: false,
                });
                return;
            }

            let labels = [];
            let avgvalues = [];
            let numvalues = [];


            let startDate = new Date(res.data[0].date);
            const endDate = new Date();

            while (startDate < endDate) {
                console.log(startDate);

                const isoDate = startDate.toISOString().split('T')[0];
                const value = res.data.find(x => x.date === isoDate);

                let completed = 0;
                let avgvalue = 0;

                if (value !== undefined) {
                    completed = value.completed;
                    avgvalue = parseInt(value.completed / value.total * 100);
                }

                labels.push(isoDate.slice(-5));
                avgvalues.push(avgvalue);
                numvalues.push(completed);

                startDate.setDate(startDate.getDate() + 1);
                console.log(startDate);
            }

            console.log(numvalues);

            let streak = 0;
            let index = numvalues.length - 1;
            while (index >= 0 && numvalues[index] > 0) {
                streak += 1;
                index += -1;
            }

            console.log(streak);


            // todo tämä allaolevaan liittyvä
            this.setState({
                isLoaded: true,
                dataAvailable: true,
                streak: streak,
                labels: labels,
                avgvalues: avgvalues,
                numvalues: numvalues
            });

        }).catch( (error) => console.log(error));

        console.log("comp mounted");
        return;
    }


    getFormattedData = (type) => {

        let data = null;
        let title = "";
        let labels = this.state.labels;

        switch (type) {
            case 'avg':
                title = "AVG completition %";
                data = this.state.avgvalues;
                break;
            case 'num':
                title = "# of habits complete";
                data = this.state.numvalues;
                break;
            default:
                break;
        }

        switch (this.state.show) {
            case 'week':
                data = data.slice(-7);
                labels = labels.slice(-7);
                break;
            case 'month':
                data = data.slice(-31);
                labels = labels.slice(-31);
                break;
            case 'year':
                // data in year format by default
                break;
        }

        return {
                labels: labels,
                datasets: [
                    {
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: '#0e59b9',
                        borderColor: '#0e59b9',
                        borderWidth: 3,
                        label: title,
                        data: data,
                    }
                ]
            };

    }

    handleTimespanChange = (timespan) => {
        this.setState({ show: timespan });
    }


    printNonZero() {
        let output = this.state.streak;

        return output;
    }



    render() {

        if (this.state.isLoaded) {

            if (!this.state.dataAvailable) {
                return <div>
                    <h1>Satistics</h1>
                    <p>No data available yet.</p>
                </div>;
            }

            return <div>
                <h1>Statistics</h1>
                <div className="stat-container">
                    <h2>Non-Zero days in a row</h2>
                    <div className="nonzero-days-num">
                        {this.printNonZero()}
                    </div>
                </div>

                <div className="stat-view-select-container">
                    <Button onClick={() => this.handleTimespanChange('week')}>Week</Button>
                    <Button onClick={() => this.handleTimespanChange('month')}>Month</Button>
                    <Button onClick={() => this.handleTimespanChange('year')}>Year</Button>
                </div>

                <div className="stat-container">
                    <h2># of tasks complete</h2>
                    <Line data={this.getFormattedData('num')} />
                </div>

                <div className="stat-container">
                    <h2>AVG % complete</h2>
                    <Line data={this.getFormattedData('avg')} />
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