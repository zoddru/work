import React from 'react';
import axios from 'axios';
import common from '../../common';
import Main from './Main';
import NotSignedIn from '../NotSignedIn';
import Loading from '../Loading';
import Error from '../Error';
import ScoreLoader from '../../Scores/ScoreLoader';
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
                if (this.unmounted)
                    return;
                const filters = allFilters.filter(f => f.type === 'organisation' || f.type === 'areaGroup');
                this.setState(prevState => ({ loadingData: false, responses, filters }));
            });
    }

    componentWillUnmount() {
        this.unmounted = true;
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
            initalFilters: this.state.filters,
            subHeading: organisationLabel,
            type: 'organisation',
            scoreHeading: `${organisationLabel}'s score`,
            showComparison: false
        };

        return <Main surveyState={surveyState} score={this.aggregatedScore} options={options} />;
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