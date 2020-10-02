import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Cookies from 'universal-cookie';

import axios from 'axios';

import API from '../Constants';


import './Stats.css';

const cookies = new Cookies();

class Stats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    componentDidMount() {
        // do fetching stuff here

        const sessionKey = cookies.get('sessionKey');

        axios.get(API.baseUrl + API.stats + '/year', { headers: { 'Authorization': 'Bearer ' + sessionKey } }).then( (res) => {
            console.log(res.data);


            let labels = [];
            let values = [];


            let startDate = new Date(res.data[0].date);
            const endDate = new Date();

            while (startDate < endDate) {

                const isoDate = startDate.toISOString().split('T')[0];
                let value = res.data.find(x => x.date == isoDate);

                if (value !== undefined) value = parseFloat(value.completed / value.total);
                else value = 0;

                labels.push(isoDate);
                values.push(value);

                startDate.setDate(startDate.getDate() + 1);
            }

            console.log(labels);
            console.log(values);

            this.setState({
                labels: labels,
                datasets: [
                    {
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: '#0e59b9',
                        borderColor: '#0e59b9',
                        borderWidth: 3,
                        label: 'AVG completition %',
                        data: values,
                    }
                ]
            });
        }).catch( (error) => console.log(error));

    }

    render() {
        return <div>
            <h1>Statistics</h1>
            <Bar data={this.state} />
        </div>;
    }
}

export default Stats;