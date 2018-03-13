import ScoreProperties from './ScoreProperties';
import Respondent from '../Respondent';

function calculateScore(categories, answers) {
    return categories.concat().sort((a, b) => a.sort - b.sort).reduce((acc, c) => {

        const categoryScore = c.score(answers);
        acc.categoryScores.push(categoryScore);

        if (!categoryScore.isValid) {
            return acc;
        }

        acc.numberOfValid += 1;
        acc.sum += categoryScore.mean;

        return acc;

    }, {
            categoryScores: [],
            sum: 0,
            numberOfValid: 0
        }
    );
}

export default class SurveyScore {
    constructor({
        survey = { categories: [] },
        respondent = {},
        answers = new Map()
    } = {}) {

        const score = calculateScore(survey.categories, answers);

        Object.assign(this, score);
        this.survey = survey;
        this.respondent = respondent;
        this.mean = score.numberOfValid === 0
            ? null
            : score.sum / score.numberOfValid;

        ScoreProperties.defineProperties(this);

        Object.freeze();
    }

    get identifier() {
        return 'Overall';
    }

    get label() {
        return 'Overall';
    }

    get key() {
        return `${this.survey.key}.score`;
    }

    get columnChartData() {
        return {
            chart: {
                type: 'column',
                marginBottom: 70
            },
            title: {
                text: 'Overall scores broken down by category'
            },
            xAxis: {
                categories: this.categoryScores.map(cs => cs.label),
                crosshair: true
            },
            yAxis: {
                min: 0,
                max: 5,
                title: {
                    text: 'Score'
                }
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<p><label style="color:{series.color};">{series.name}</label>: <strong>{point.y:.1f}</strong></p>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: this.categoryScores.map((cs, i) => ({
                name: cs.label,
                data: [{ x: i, y: cs.mean }]
            })),
            legend: {
                enabled: false
            }
        };
    }


    get spiderChartData() {
        return {
            chart: {
                polar: true,
                type: 'line',
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 60,
                marginRight: 60,
                height: null
            },
            title: {
                text: null
            },
            xAxis: {
                categories: this.categoryScores.map(cs => cs.label),
                tickmarkPlacement: 'on',
                lineWidth: 0,
                labels: {
                    style: {
                        textOverflow: 'none'
                    }
                }
            },
            yAxis: {
                tickInterval: 1,
                minorTickInterval: null,
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0,
                labels: {
                    enabled: false
                }
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<p><label style="color:{series.color};">{point.name}</label>: <strong>{point.y:.1f}</strong></p>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                data: this.categoryScores.map(cs => ({ name: cs.label, y: cs.mean })),
                pointPlacement: 'on'
            }],
            legend: {
                enabled: false
            }
        };
    }

    static createArray(survey, results) {
        return results.map(result => {
            const respondent = new Respondent(result.respondent);
            const responses = result.responses || [];
            const answers = survey.createQAMap(responses);
            return new SurveyScore({ survey, respondent, answers });
        });
    }
}