import React from 'react';
import Select from 'react-select';
import Base from './Base';
import Chart from './Chart';
import Table from './Table';
const Fragment = React.Fragment;

const modes = {
    chart: 'chart',
    table: 'table'
};

export default class ChartTable extends Base {
    constructor(props) {
        super(props);

        this.state.mode = modes.chart;
        this.state.overallScoreMode = 'line';
    }

    toggleMode() {
        const mode = this.state.mode === modes.chart ? modes.table : modes.chart;
        this.setState({ mode });
    }

    renderChildren() {
        const { mode } = this.state;

        const chartOrTable = mode === modes.chart
            ? this.renderChartChildren()
            : this.renderTableChildren();

    return <Fragment>
            <form className="chart-sub-options">
                <a onClick={this.toggleMode.bind(this)}>{ mode === modes.chart ? 'show table' : 'show chart' }</a>
            </form>
            {chartOrTable}
        </Fragment>;
    }

    // renderAfterForm() {
    //     return <a className="button" onClick={this.toggleMode.bind(this)}>x</a>;
    // }
}

Object.defineProperties(ChartTable.prototype, {
    aggregatedChart: {
        get: Object.getOwnPropertyDescriptor(Chart.prototype, 'aggregatedChart').get
    },

    renderChartChildren: {
        value: Object.getOwnPropertyDescriptor(Chart.prototype, 'renderChildren').value
    },

    aggregatedTable: {
        get: Object.getOwnPropertyDescriptor(Table.prototype, 'aggregatedTable').get
    },

    renderTableChildren: {
        value: Object.getOwnPropertyDescriptor(Table.prototype, 'renderChildren').value
    }
});
