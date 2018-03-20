import React from 'react';
import Highcharts from 'highcharts-more-node';
import theme from './highcharts.theme.js';

Highcharts.setOptions(theme);

export default class SimpleChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div id={this.props.id} className="chart summary"></div>;
    }

    componentDidMount() {
        this.chart = Highcharts.chart(this.props.id, this.props.data);
    }
}