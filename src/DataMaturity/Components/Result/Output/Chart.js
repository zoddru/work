import React from 'react';
import Select from 'react-select';
import Base from './Base';
import SimpleChart from './SimpleChart';

export default class Chart extends Base {
    constructor(props) {
        super(props);
    }

    renderChildren() {
        const chartData = this.aggregatedChart;

        return <SimpleChart id="chart" data={chartData} />;
    }

    get aggregatedChart() {
        const { surveyState } = this.props;

        if (surveyState.loading || !surveyState.isSignedIn)
            return null;

        const scores = this.aggregatedScores;
        const { survey, options } = surveyState;
        const categories = survey.categories;

        const series = scores.map(s => {
            const data = [];

            categories.forEach(c => {
                const cs = s.categoryScores.find(cs => cs.category.identifier === c.identifier);
                data.push({ y: cs.mean, score: cs });
            });

            data.push({ y: s.mean, score: s });

            return {
                name: s.key.label,
                data: data
            };
        });

        const chartCategories = categories.map(c => c.identifier).concat(['Overall']);

        console.log(chartCategories);

        return {
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: chartCategories
            },
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
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series
        };
    }
}