import React from 'react';
import axios from 'axios';
import common from '../../common';
import ResultMain from './Main';
import NotSignedIn from '../NotSignedIn';
import Loading from '../Loading';
import ScoreLoader from '../../Scores/ScoreLoader';
import ResponseAggregator from '../../Scores/ResponseAggregator';

export default class OrganisationMain extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingResponses: false,
            responses: []
        };
    }

    loadResponses() {
        this.setState(prevState => ({ loadingResponses: true }));

        new ScoreLoader(this.props.surveyState)
            .loadOrganisationResponses()
            .then(responses => {
                this.setState(prevState => ({ loadingResponses: false, responses }));
            });
    }

    componentDidMount() {
        this.loadResponses();
    }

    render() {
        const { surveyState } = this.props;

        if (surveyState.loading)
            return <Loading />;

        if (!surveyState.isSignedIn)
            return <NotSignedIn status={surveyState.authStatus} />;

        const { loadingResponses } = this.state;

        if (loadingResponses)
            return <Loading message="loading responses. please wait..." />;

        return <ResultMain surveyState={surveyState} score={this.aggregatedScore} />;
    }

    get aggregatedScore() {
        const { surveyState } = this.props;

        if (surveyState.loading || !surveyState.isSignedIn)
            return null;

        const { survey, organisation } = surveyState;
        const { responses } = this.state;

        const filter = v => v.respondent.organisation === organisation.identifier;
        const aggregator = new ResponseAggregator({ survey, responses });
        return aggregator.byCategory({ key: `${survey.key}-score`, filter });
    }
}