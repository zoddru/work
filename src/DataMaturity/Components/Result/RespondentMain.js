import React from 'react';
import axios from 'axios';
import common from '../../common';
import ResultMain from './Main';
import NotSignedIn from '../NotSignedIn';
import Loading from '../Loading';
import Error from '../Error';
import ScoreLoader from '../../Scores/ScoreLoader';
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

export default class RespondentMain extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingData: false,
            responses: [],
            filters: []
        };
    }

    componentDidMount() {
        this.setState(prevState => ({ loadingData: true }));

        new ScoreLoader(surveyState)
            .loadOrganisationResponses()
            .then(responses => {
                const comparisonScore = getComparisonScore(responses, surveyState);
                this.setState(prevState => ({ comparisonScore }));
            });
    }

    render() {
        const { surveyState, score } = this.props;

        if (surveyState.loading)
            return <Loading />;

        if (!surveyState.isSignedIn || !surveyState.organisation)
            return <NotSignedIn status={surveyState.authStatus} />;

        const { loadingData, comparisonScore } = this.state;

        if (loadingData)
            return <Loading message="loading data. please wait..." />;

        const options = {
            invalidWarning: `There have not been enough responses from ${organisationLabel} to calculate an accurate score.`,
            summaryText: `Answers from ${organisationLabel} indicate that staff perceive the council to be at level`,
            initalFilters: this.state.filters,
            showComparison: true,
            comparisonType: 'organisation',
            comparisonHeading: 'Your organisation\'s score',
        };

        return <ResultMain surveyState={surveyState} score={this.aggregatedScore} options={options} type="organisation" subHeading={organisationLabel} comparisonOptions={{show: false}} />;
    }
}