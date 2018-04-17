import React from 'react';
import Nav from './Nav';
import NavHelper from '../NavHelper';
import Summary from './Summary';
import Loading from '../Loading';
import NotSignedIn from '../NotSignedIn';
import content from './content';
import Chart from './Output/ChartTable';
import ScoreChart from './Output/ScoreChart';
import Colors from './Output/Colors';
import ScoreLoader from '../../Scores/ScoreLoader';
import ResponseFilters from '../../Scores/ResponseFilters';
import ResponseAggregator from '../../Scores/ResponseAggregator';

const defaultOptions = Object.freeze({
    invalidWarning: 'You haven\'t filled in enough of the survey to calculate an accurate score.',
    summaryText: 'Your answers indicate that you perceive your council to be at level',
    initalFilters: null,
    type: 'respondent',
    subHeading: 'Your results',
    showComparison: true,
    scoreHeading: 'Your score',
    comparisonType: 'organisation',
    comparisonScoreHeading: 'Your organisation\'s score',
});

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        NavHelper.scrollToHash();
    }

    get options() {
        const options = this.props.options || {};
        return Object.assign({}, defaultOptions, options);
    }

    buildSummaryControls() {
        const { score, comparisonScore } = this.props;

        if (!score)
            return null;

        const options = this.options;
        const { type, scoreHeading, showComparison, comparisonType, comparisonScoreHeading } = options;

        const color = Colors.byType[type];
        const comparisonColor = Colors.byType[comparisonType];

        return score.categoryScores.map(cs => {
            const scoreChart = <ScoreChart title={scoreHeading} score={cs} color={color} />;

            if (!showComparison || !comparisonScore || !comparisonScore.categoryScores)
                return <Summary key={cs.key} score={cs} content={content[cs.identifier]} options={options} scoreChart={scoreChart} />;

            const categoryComparisonScore = comparisonScore.categoryScores.find(s => s.category.identifier === cs.category.identifier);
            const comparisonScoreChart = categoryComparisonScore && <ScoreChart title={comparisonScoreHeading} score={categoryComparisonScore} color={comparisonColor} />;

            return <Summary key={cs.key} score={cs} content={content[cs.identifier]} options={options} scoreChart={scoreChart} comparisonScoreChart={comparisonScoreChart} />;
        });
    }

    render() {
        const { score, surveyState } = this.props;

        if (!surveyState.isSignedIn)
            return <NotSignedIn status={surveyState.authStatus} />;

        if (surveyState.loading)
            return <Loading />;

        const options = this.options;
        const { subHeading, type, scoreHeading } = options;

        const color = Colors.byType[type];
        const scoreChart = <ScoreChart title={scoreHeading} score={score} color={color} />;

        const { showComparison, comparisonType, comparisonScoreHeading } = options;
        const { comparisonScore } = this.props;
        const comparisonColor = Colors.byType[comparisonType];
        const comparisonScoreChart = showComparison && !!comparisonScore
            ? <ScoreChart title={comparisonScoreHeading} score={comparisonScore} color={comparisonColor} />
            : null;

        const chart = <Chart surveyState={surveyState} options={options} />;

        const categoryScores = this.buildSummaryControls();

        return <section class="main-content capped-width">
            <Nav score={score} scoreChart={chart} />
            <article>
                <header className="print-only">
                    <h1>Local Government Data Maturity Self Assessment Tool</h1>
                    <h2>{subHeading}</h2>
                </header>
                <Summary score={score} content={content.Overall} options={options} scoreChart={scoreChart} chart={chart} comparisonScoreChart={comparisonScoreChart} />
                {categoryScores}
            </article>
        </section>;
    }
}