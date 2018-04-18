import ScoreProperties from './ScoreProperties';
import CategoryScore from './CategoryScore';
import Respondent from '../Respondent';

function calculateScore(categories, answers) {
    const categoryScores = categories.concat().sort((a, b) => a.sort - b.sort).map(c => c.score(answers));
    return CategoryScore.sumValid(categoryScores);
}

const overallCategory = Object.freeze({ identifier: 'Overall', label: 'Overall' });

export default class SurveyScore {
    constructor({
        survey = { categories: [] },
        respondent = {},
        answers = new Map()
    } = {}) {

        const score = calculateScore(survey.categories, answers);

        Object.assign(this, score);
        this.category = overallCategory;
        this.survey = survey;
        this.respondent = respondent;
        this.mean = score.numberOfValid === 0
            ? null
            : score.sum / score.numberOfValid;

        ScoreProperties.defineProperties(this);

        Object.freeze();
    }

    get key() {
        return `${this.survey.key}-score`;
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