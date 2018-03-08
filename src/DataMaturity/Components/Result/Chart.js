import React from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts-more-node';
import theme from './highcharts.theme.js';

Highcharts.setOptions(theme);

export default class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    handleResize() {
        console.log('resize');
        if (!this.chart)
            return;
            this.chart.destroy();
            this.chart = Highcharts.chart(this.props.id, this.props.data);
    }

    render() {
        return <div>
            <div id={this.props.id} className="chart"></div>
        </div>
    }

    componentDidMount() {
        this.chart = Highcharts.chart(this.props.id, this.props.data);
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize.bind(this));
    }
}