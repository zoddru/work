import React from 'react';
import Nav from './Nav';
import NavHelper from '../NavHelper';
import Summary from './Summary';
import Loading from '../Loading';
import NotSignedIn from '../NotSignedIn';
import content from './content';
import Chart from './Output/ChartTable';
import ScoreChart from './Output/ScoreChart';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        NavHelper.scrollToHash();
    }

    render() {
        const { score, surveyState, options = options || {}, subHeading = subHeading || 'Your results', scoreHeading = scoreHeading || 'Your score' } = this.props;

        if (!surveyState.isSignedIn)
            return <NotSignedIn status={surveyState.authStatus} />;

        if (surveyState.loading)
            return <Loading />;

        const categoryScores = score.categoryScores.map(cs => {
            const scoreChart = <ScoreChart title={scoreHeading} score={cs} />;
            return <Summary key={cs.key} score={cs} content={content[cs.identifier]} options={options} scoreChart={scoreChart} />;
        });

        const scoreChart = <ScoreChart title={scoreHeading} score={score} />;
        const chart = <Chart surveyState={surveyState} options={options} />;

        return <section class="main-content capped-width">
            <Nav score={score} scoreChart={chart} />
            <article>
                <header className="print-only">
                    <h1>Local Government Data Maturity Self Assessment Tool</h1>
                    <h2>{subHeading}</h2>
                </header>
                <Summary score={score} content={content.Overall} options={options} scoreChart={scoreChart} chart={chart} />
                {categoryScores}
            </article>
        </section>;
    }
}