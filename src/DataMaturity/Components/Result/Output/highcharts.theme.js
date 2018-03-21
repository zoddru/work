const axisStyle = Object.freeze({
    lineColor: '#d2d3d7',
    gridLineColor: '#d2d3d7',
    tickColor: '#d2d3d7',
    minorGridLineColor: '#E2E3E7',
    minorTickColor: '#E2E3E7',
    minorGridLineDashStyle: 'longdash'
});

export default {
    colors: ['#B43F6B', '#737D27', '#CF7B25', '#8EAA94', '#C7B757'],
    chart: {
        backgroundColor: null,
        style: {
            fontFamily: 'inherit'
        }
    },
    title: {
        style: {
        }
    },
    tooltip: {
        padding: 10,
        borderWidth: 4,
        color: '#000000',
        backgroundColor: 'rgba(239, 239, 239, 0.8)',
        shadow: false
    },
    legend: {
        symbolRadius: 0,
        itemStyle: {
            color: '#000000'
        }
    },
    xAxis: Object.assign({}, axisStyle, {
        gridLineWidth: 1,
        labels: {
            style: {
                color: '#000000'
            }
        }
    }),
    yAxis: Object.assign({}, axisStyle, {
        minorTickInterval: 'auto',
        title: {
            style: {
                color: '#000000'
            }
        },
        labels: {
            style: {
                color: '#000000'
            }
        }
    }),
    plotOptions: {
        series: {
            animation: false,
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    }
};