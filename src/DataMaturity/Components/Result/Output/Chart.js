import React from 'react';
import Select from 'react-select';
import Base from './Base';
import SimpleChart from './SimpleChart';
import ScoreProperties from '../../../Scores/ScoreProperties';
import Colors from './Colors';

export default class Chart extends Base {
    constructor(props) {
        super(props);

        this.state.overallScoreMode = 'line';
    }

    changeOverallScoreMode(item) {
        const overallScoreMode = item.value;
        this.setState({ overallScoreMode });
    }

    renderChildren() {
        const { overallScoreMode } = this.state;
        const chartData = this.aggregatedChart;

        return <SimpleChart id="chart" data={chartData} />;
    }

    get aggregatedChart() {
        const { overallScoreMode } = this.state;
        const { surveyState } = this.props;

        if (surveyState.loading || !surveyState.isSignedIn)
            return null;

        const scores = this.aggregatedScores;

        const { survey, options } = surveyState;
        const categories = survey.categories;

        const colorMap = Colors.getColorMap(scores);
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

const overallScoreModes = [
    { value: 'line', label: 'Show overall scores as lines' },
    { value: 'column', label: 'Show overall scores as bars' },
    { value: 'none', label: 'Hide overall scores' }
];

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
