import React from 'react';
import Select from 'react-select';
import Base from './Base';
import SimpleChart from './SimpleChart';

const colors = ['#B43F6B', '#737D27', '#CF7B25', '#8EAA94', '#C7B757', '#0056b3', '#f8c27c', '#c2a0f5', '#acd5b6', '#83128d', '#d75466', '#e3125c', '#422d5e', '#17a2b8', '#076443', '#ffb3dc', '#ff9e45', '#72ba3a', '#f0d000', '#5e8579', '#343a40'];

const overallScoreModes = [
    { value: 'line', label: 'Show overall scores as lines' },
    { value: 'column', label: 'Show overall scores as bars' },
    { value: 'none', label: 'Hide overall scores' }
];

const getColorMap = (scores) => {
    const colorMap = new Map();
    scores.forEach((s, i) => colorMap.set(s, colors[i % colors.length]));
    return colorMap;
};

const getSeries = (scores, colorMap, categories, overallScoreMode) => {    
    const series = scores.map(s => {
        const data = [];
        const color = colorMap.get(s);

        categories.forEach(c => {
            const cs = s.categoryScores.find(cs => cs.category.identifier === c.identifier);
            data.push({ y: cs.mean, score: cs });
        });

        if (overallScoreMode === 'column') {
            data.push({ y: s.mean, score: s });
        }

        return {
            name: s.key.label,
            data: data,
            color
        };
    });

    if (overallScoreMode !== 'line')
        return series;

    return series.concat(scores.map(s => {
        const color = colorMap.get(s);
        return {
            type: 'line',
            showInLegend: false,
            name: s.key.label,
            xAxis: 1,
            data: [{
                y: s.mean,
                x: 0,
                score: s
            }, {
                y: s.mean,
                x: 1,
                score: s
            }],
            color
        };
    }));
};

const getXAxis = (categories, overallScoreMode) => {
    const chartCategories = categories.map(c => c.identifier).concat(['Overall']);

    if (overallScoreMode !== 'line')
        return { categories: chartCategories };

    return [
        { categories: chartCategories },
        {
            min: 0,
            max: 1,
            type: 'linear',
            lineWidth: 0,
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            minorGridLineDashStyle: 'none',
            lineColor: 'transparent',
            labels: {
                enabled: false
            },
            minorTickLength: 0,
            tickLength: 0
        }
    ];
};

export default class Chart extends Base {
    constructor(props) {
        super(props);

        this.state = {
            overallScoreMode: 'line'
        };
    }

    changeOverallScoreMode(item) {
        const overallScoreMode = item.value;
        this.setState({ overallScoreMode });
    }

    renderChildren() {
        const { overallScoreMode } = this.state;
        const chartData = this.aggregatedChart;

        return <div>
            <form>
                <div className="form-item">
                    <label>Overall</label>
                    <div className="value">
                        <Select
                            name="overallScoreDisplay"
                            clearable={false}
                            value={overallScoreMode}
                            onChange={this.changeOverallScoreMode.bind(this)}
                            options={overallScoreModes}
                        />
                    </div>
                </div>
            </form>
            <SimpleChart id="chart" data={chartData} />
        </div>;
    }

    get aggregatedChart() {
        const { overallScoreMode } = this.state;
        const { surveyState } = this.props;

        if (surveyState.loading || !surveyState.isSignedIn)
            return null;

        const scores = this.aggregatedScores;
        const { survey, options } = surveyState;
        const categories = survey.categories;

        console.log(scores);

        const colorMap = getColorMap(scores);
        const xAxis = getXAxis(categories, overallScoreMode);
        const series = getSeries(scores, colorMap, categories, overallScoreMode);

        return {
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis,
            yAxis: {
                min: 0,
                title: {
                    text: 'Score (avg)'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                formatter: function () {
                    const point = this.point;
                    const series = point.series;
                    const score = point.options.score;
                    const label = `<b>${series.name}</b><br />${point.category}<br />${score.rankLabel} (${score.meanDisplayName})`;
                    return label;
                }
            },
            legend: {
                layout: 'vertical',
                align: 'center',
                verticalAlign: 'bottom',
                floating: false,
                borderWidth: 1,
                backgroundColor: '#FFFFFF'
            },
            credits: {
                enabled: false
            },
            series
        };
    }
}