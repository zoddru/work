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

export default class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        NavHelper.scrollToHash();
    }

    buildSummaryControls() {
        const {
            score,
            type = type || 'respondent',
            subHeading = subHeading || 'Your results',
            scoreHeading = scoreHeading || 'Your score',
            comparisonOptions = comparisonOptions || defaultComparisonOptions
        } = this.props;
        
        const { comparisonScore } = this.state;
    
        const color = Colors.byType[type];
        const comparisonColor = Colors.byType[comparisonOptions.type];
    
        return score.categoryScores.map(cs => {
            const scoreChart = <ScoreChart title={scoreHeading} score={cs} color={color} />;
    
            if (!comparisonOptions.show || !!comparisonScore || !!comparisonScore.categoryScores)
                return <Summary key={cs.key} score={cs} content={content[cs.identifier]} options={options} scoreChart={scoreChart} />;
                
            const categoryComparisonScore = comparisonScore.categoryScores.find(s => s.category.identifier === cs.category.identifier);
            const comparisonScoreChart = categoryComparisonScore && <ScoreChart title={comparisonOptions.heading} score={categoryComparisonScore} color={comparisonColor} />;
    
            return <Summary key={cs.key} score={cs} content={content[cs.identifier]} options={options} scoreChart={scoreChart} comparisonScoreChart={comparisonScoreChart} />;
        });
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
        const scoreChart = <ScoreChart title={scoreHeading} score={score} color={color} />;
        const comparisonScoreChart = comparisonOptions.show && !!comparisonScore
            ? <ScoreChart title={comparisonOptions.heading} score={comparisonScore} color={comparisonColor} />
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
                <Summary score={score} content={content.Overall} options={options} scoreChart={scoreChart} comparisonScoreChart={comparisonScoreChart} chart={chart} />
                {categoryScores}
            </article>
        </section>;
    }
}