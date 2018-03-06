import ScoreProperties from './ScoreProperties';

function calculateScore(categories, answers) {
    return categories.reduce((acc, c) => {
            
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
    });
}

export default class SurveyScore {
    constructor({
        survey = { categories: [] },
        answers = new Map()
    } = {}) {

        const score = calculateScore(survey.categories, answers);

        Object.assign(this, score);
        this.survey = survey;
        this.mean = score.numberOfValid === 0
            ? null
            : score.sum / score.numberOfValid;

        ScoreProperties.defineProperties(this);

        Object.freeze();
    }

    get identifier() {
        return 'overall';
    }

    get label() {
        return 'Overall';
    }

    get key() {
        return `${this.survey.key}.score`;
    }

    get columnChartData() {


        return  {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Overall scores broken down'
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
}