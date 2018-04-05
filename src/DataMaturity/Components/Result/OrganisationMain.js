import React from 'react';
import axios from 'axios';
import common from '../../common';
import ResultMain from './Main';
import NotSignedIn from '../NotSignedIn';
import Loading from '../Loading';
import Error from '../Error';
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
            .then(([allFilters, responses]) => {
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

        const { organisation, organisationLabel } = surveyState;

        if (!organisation || !organisation.identifier)
            return <Error message="You are not associated with an organisation." />;

        const options = {
            invalidWarning: `There have not been enough responses from ${organisationLabel} to calculate an accurate score.`,
            summaryText: `Answers from ${organisationLabel} indicate that staff perceive the council to be at level`,
            initalFilters: this.state.filters
        };

        return <ResultMain surveyState={surveyState} score={this.aggregatedScore} options={options} subHeading={organisationLabel} />;
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