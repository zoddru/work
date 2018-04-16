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

const getComparisonScore = (responses, surveyState) => {
    const { survey, organisation } = surveyState;
    if (!organisation || !responses || !responses.length)
        return null;
    const filter = ResponseFilters.createOrganisationFilter(organisation);
    if (!filter)
        return null;
    return new ResponseAggregator({ survey, responses }).byCategory(filter);
};

const defaultComparisonOptions = Object.freeze({
    type: 'organisation',
    heading: 'Your organisation\'s score',
    load: (surveyState, onDone) => {

        new ScoreLoader(surveyState)
            .loadOrganisationResponses()
            .then(responses => {
                const comparisonScore = getComparisonScore(responses, surveyState);
                onDone(comparisonScore);
            });
    }
});

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = { comparisonScore: null };
    }

    componentDidMount() {
        NavHelper.scrollToHash();

        const { surveyState, comparisonOptions = comparisonOptions || defaultComparisonOptions } = this.props;

        comparisonOptions.load(surveyState, comparisonScore => this.setState(prevState => ({ comparisonScore })));
    }

    render() {
        const {
            score,
            surveyState,
            options = options || {},
            type = type || 'respondent',
            subHeading = subHeading || 'Your results',
            scoreHeading = scoreHeading || 'Your score',
            comparisonOptions = comparisonOptions || defaultComparisonOptions
        } = this.props;

        if (!surveyState.isSignedIn)
            return <NotSignedIn status={surveyState.authStatus} />;

        if (surveyState.loading)
            return <Loading />;

        const { comparisonScore } = this.state;
        const color = Colors.byType[type];
        const comparisonColor = Colors.byType[comparisonOptions.type];

        const categoryScores = score.categoryScores.map(cs => {
            const scoreChart = <ScoreChart title={scoreHeading} score={cs} color={color} />;
            return <Summary key={cs.key} score={cs} content={content[cs.identifier]} options={options} scoreChart={scoreChart} />;
        });

        const scoreChart = <ScoreChart title={scoreHeading} score={score} color={color} />;
        const comparisonScoreChart = !!comparisonScore ? <ScoreChart title={comparisonOptions.heading} score={comparisonScore} color={comparisonColor} /> : null;
        const chart = <Chart surveyState={surveyState} options={options} />;

        return <section class="main-content capped-width">
            <Nav score={score} scoreChart={chart} />
            <article>
                <header className="print-only">
                    <h1>Local Government Data Maturity Self Assessment Tool</h1>
                    <h2>{subHeading}</h2>
                </header>
                <Summary score={score} content={content.Overall} options={options} scoreChart={scoreChart} comparisonScoreChart={comparisonScoreChart} chart={chart} />
                {categoryScores}
            </article>
        </section>;
    }
}