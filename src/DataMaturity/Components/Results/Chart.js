import React from 'react';
import Highcharts from 'highcharts';
import theme from './highcharts.theme.js';

Highcharts.setOptions(theme);

export default class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Highcharts.chart(this.props.id, this.props.data);
    }

    render() {
        return <div>
            <div id={this.props.id}></div>
        </div>
    }
}