import React from 'react';
import axios from 'axios';
import common from '../../common';
import ResultMain from './Main';
import NotSignedIn from '../NotSignedIn';
import Loading from '../Loading';
import ResponseAggregator from '../../Scores/ResponseAggregator';
import ResponseFilters from '../../Scores/ResponseFilters';
const { responsesCache } = common;

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

        getResponses(this.props.surveyState)
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
            return <Loading message="loading responses. hang on..." />;

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

const getResponses = (surveyState) => {
    const { organisation, created } = surveyState;

    if (!organisation || !organisation.identifier)
        return Promise.resolve([]);

    const cached = responsesCache.get(organisation.identifier);
    if (cached && cached.created === created)
        return Promise.resolve(cached.responses);

    return axios.get(`/dmApi/responses?organisation=${organisation.identifier}`)
        .then(r => {
            const responses = (r.data || []);
            responsesCache.set(organisation.identifier, { created, responses });
            return responses;
        });
};