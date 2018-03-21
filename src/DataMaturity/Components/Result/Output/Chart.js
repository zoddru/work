import React from 'react';
import Select from 'react-select';
import Base from './Base';
import SimpleChart from './SimpleChart';
import ScoreProperties from '../../../Scores/ScoreProperties';

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
            if (!cs)
                return;
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

    return series.concat(scores.map(score => {
        const color = colorMap.get(score);
        const y = score.mean;
        const category = 'Overall';
        return {
            type: 'line',
            showInLegend: false,
            name: score.key.label,
            xAxis: 1,
            data: [{
                y,
                x: -10, // off the chart to the left
                score,
                category
            }, {
                y,
                x: 0.5, // the center of the chart
                score,
                category
            }, {
                y,
                x: 20, // off the chart to the right
                score,
                category
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
            yAxis: [
                {
                    tickPositions: [0, 1, 1.8, 2.6, 3.4, 4.2, 5],
                    minorGridLineWidth: 0,
                    tickWidth: 1,
                    title: {
                        text: 'Score (avg)',
                        enabled: false
                    },
                    labels: {
                        overflow: 'justify',
                        enabled: false
                    }
                },
                {
                    tickPositions: [1.4, 2.2, 3, 3.8, 4.6],
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    linkedTo: 0,
                    title: {
                        enabled: false
                    },
                    labels: {
                        formatter: function () {
                            return ScoreProperties.getBandLabel(this.value);
                        }
                    }
                }
            ],
            tooltip: {
                formatter: function () {
                    const { options, series, category } = this.point;
                    const score = options.score;
                    const categoryLabel = options.category || category;
                    const label = `<b>${series.name}</b><br />${categoryLabel}<br />${score.rankLabel} (${score.meanDisplayName})`;
                    return label;
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
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

const fakeScores = [
    {
        categoryScores: [
            {
                category: { identifier: "Management", label: "Data Management", sort: 1 },
                mean: 1.8,
                numberNotKnown: 0,
                numberNotUnderstood: 0,
                hasMean: true,
                isValid: true,
                meanDisplayName: "1.8",
                rankLabel: ScoreProperties.getBandLabel(1.8)
            },
            {
                category: { identifier: "Use", label: "Data Use", sort: 2 },
                mean: 5,
                numberNotKnown: 0,
                numberNotUnderstood: 0,
                hasMean: true,
                isValid: true,
                meanDisplayName: "5.0",
                rankLabel: ScoreProperties.getBandLabel(5)
            }
        ],
        key: { identifier: "1a33f4bb-8a7a-4447-9808-9f1199ff2dc4", label: "My score", type: "respondent" },
        mean: 3,
        numberOfValid: 5,
        sum: 15,
        hasMean: true,
        isValid: true,
        meanDisplayName: "3.0",
        offsetMean: 2.2,
        rankLabel: "Intermediate"
    }
];