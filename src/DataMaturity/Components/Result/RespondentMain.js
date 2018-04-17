import React from 'react';
import axios from 'axios';
import common from '../../common';
import Main from './Main';
import NotSignedIn from '../NotSignedIn';
import Loading from '../Loading';
import Error from '../Error';
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
        const surveyState = this.props.surveyState;

        new ScoreLoader(surveyState)
            .loadOrganisationResponses()
            .then(responses => {
                if (this.unmounted)
                    return;
                const comparisonScore = getComparisonScore(responses, surveyState);
                this.setState(prevState => ({ comparisonScore }));
            });
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    render() {
        const { surveyState, score } = this.props;

        if (surveyState.loading)
            return <Loading />;

        if (!surveyState.isSignedIn || !surveyState.organisation)
            return <NotSignedIn status={surveyState.authStatus} />;

        const { loadingData, comparisonScore } = this.state;

        const organisationLabel = surveyState.organisationLabel;
        const comparisonScoreHeading = `${organisationLabel}'s score`;
        const mainOptions = Object.assign({}, this.options, { comparisonScoreHeading });

        return <Main surveyState={surveyState} score={score} options={mainOptions} comparisonScore={comparisonScore} />;
    }
}