import React from 'react';
import axios from 'axios';
import common from '../../common';
import ResultMain from './Main';
import NotSignedIn from '../NotSignedIn';
import Loading from '../Loading';
import ScoreLoader from '../../Scores/ScoreLoader';
import ResponseFilters from '../../Scores/ResponseFilters';
import ResponseAggregator from '../../Scores/ResponseAggregator';

export default class OrganisationMain extends React.Component {
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

        new ScoreLoader(this.props.surveyState)
            .loadFiltersAndOrganisationResponses()
            .then(([ allFilters, responses ]) => {
                const filters = allFilters.filter(f => f.type === 'organisation' || f.type === 'areaGroup');
                this.setState(prevState => ({ loadingData: false, responses, filters }));
            });
    }

    render() {
        const { surveyState } = this.props;

        if (surveyState.loading)
            return <Loading />;

        if (!surveyState.isSignedIn || !surveyState.organisation)
            return <NotSignedIn status={surveyState.authStatus} />;

        const { loadingData } = this.state;

        if (loadingData)
            return <Loading message="loading data. please wait..." />;

        const organisation = surveyState.organisation;
        const options = {
            summaryText: `Answers from ${organisation.shortLabel || organisation.label} indicate that staff perceive the council to be at level`,
            initalFilters: this.state.filters
        };

        return <ResultMain surveyState={surveyState} score={this.aggregatedScore} options={options} />;
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