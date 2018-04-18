import React from 'react';
import Nav from './Nav';
import NavHelper from '../NavHelper';
import Summary from './Summary';
import Loading from '../Loading';
import NotSignedIn from '../NotSignedIn';
import content from './content';
import Dials from './Output/Dials';
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
    subHeading: 'Your results'
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
        const { score, surveyState } = this.props;

        if (!score)
            return null;

        const options = this.options;
        const { type, scoreHeading } = options;

        return score.categoryScores.map(cs => {
            const dials = <Dials surveyState={surveyState} options={options} showFilters={false} className="score-dials" category={cs.category} />;
            return <Summary key={cs.key} score={cs} content={content[cs.category.identifier]} options={options} dials={dials} />;
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

        const dials = <Dials surveyState={surveyState} options={options} showFilters={false} className="score-dials" />;
        const chart = <Chart surveyState={surveyState} options={options} />;

        const categoryScores = this.buildSummaryControls();

        return <section class="main-content capped-width">
            <Nav score={score} />
            <article>
                <header className="print-only">
                    <h1>Local Government Data Maturity Self Assessment Tool</h1>
                    <h2>{subHeading}</h2>
                </header>
                <Summary score={score} content={content.Overall} options={options} dials={dials} chart={chart} />
                {categoryScores}
            </article>
        </section>;
    }
}