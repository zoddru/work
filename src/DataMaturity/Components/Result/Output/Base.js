import React from 'react';
import Select from 'react-select';
import SignInDetails from '../../SignInDetails';
import Loading from '../../Loading';
import NotSignedIn from '../../NotSignedIn';
import SimpleTable from './SimpleTable';
import ScoreLoader from '../../../Scores/ScoreLoader';
import ResponseAggregator from '../../../Scores/ResponseAggregator';
import ResponseFilters from '../../../Scores/ResponseFilters';
import { create } from 'domain';
import common from '../../../common';
const { filtersCache, responsesCache } = common;

const startSortOrder = { respondent: 1, role: 2, department: 3, organisation: 4 };

export default class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFilters: [],

            loadingFilters: false,
            filters: [],

            useLocalData: true,

            loadingResponses: false,
            responses: [],

            loadingScores: false,
            scores: []
        };

        this.dataPromise = null;
        this.scoresPromise = null;
    }

    hasOrganisationChanged(nextProps) {
        const currentOrg = this.props.surveyState.organisation;
        const nextOrg = nextProps.surveyState.organisation;
        return (currentOrg !== nextOrg);
    }

    changeFilters(selectedFilters) {
        const useLocalData = selectedFilters.filter(f => !f.local).length === 0;

        this.setState(prevState => ({ useLocalData, loadingScores: !useLocalData, selectedFilters: selectedFilters }));

        if (useLocalData)
            return;

        const promise = this.scoresPromise = getScores(this.props.surveyState, selectedFilters)
            .then(scores => {
                if (this.state.useLocalData || promise != this.scoresPromise)
                    return;
                this.setState(prevState => ({
                    loadingScores: false,
                    scores
                }));
            });
    }

    init(props) {
        if (props.surveyState.loading)
            return;
        this.loadData(props);
    }

    loadData(props) {
        this.setState(prevState => ({ loadingFilters: true, loadingResponses: true }));

        const respondent = props.surveyState.respondent;
        const loadedFilters = filters => {
            if (this.dataPromise.canceled)
                return;
            this.setState(prevState => ({ loadingFilters: false, selectedFilters: getInitialSelectedFilters(respondent, filters) }));
            return filters;
        };

        this.dataPromise = Promise.all([

            getFilters(props.surveyState).then(loadedFilters),
            getResponses(props.surveyState)

        ]).then(([filters, responses]) => {
            if (this.dataPromise.canceled)
                return;
            this.dataPromise = null;
            this.setState(prevState => ({ loadingResponses: false, filters, responses }));
        });

        return this.dataPromise;
    }

    componentDidMount() {
        if (this.state.loadingResponses)
            return;
        this.init(this.props);
    }

    componentWillUnmount() {
        if (this.dataPromise) {
            this.dataPromise.canceled = true;
        }
    }

    render() {
        const { surveyState } = this.props;
        const { isSignedIn, authStatus, survey, respondent } = surveyState;
        const { loadingFilters, filters, selectedFilters } = this.state;

        if (surveyState.loading)
            return <Loading />;

        if (!isSignedIn)
            return <NotSignedIn status={authStatus} />;

        if (loadingFilters)
            return <Loading message="loading filters. should not be long..." />;

        return <section class="main-content">
            <article>
                <section className="category">
                    <header>
                        <h2>{this.props.heading}</h2>
                    </header>
                    <main class="chart">
                        <form className="chart-options">
                            <Select
                                name="series"
                                clearable={false}
                                value={selectedFilters}
                                multi
                                onChange={this.changeFilters.bind(this)}
                                options={filters}
                            />
                        </form>
                        {this.renderLoadingOrChildren()}
                    </main>
                </section>
            </article>
        </section >;
    }

    renderLoadingOrChildren() {
        const { useLocalData, loadingResponses, loadingScores } = this.state;

        if (loadingResponses)
            return <Loading isSubSection={true} message="loading responses. hang on..." />;

        if (!useLocalData && loadingScores)
            return <Loading isSubSection={true} message="loading scores. please wait..." />;
        
        //return <Loading isSubSection={true} message="loading scores. not really loading..." />;
        return this.renderChildren();
    }

    renderChildren() {
        return 'OUTPUT GOES HERE';
    }

    get aggregatedScores() {
        const { useLocalData, loadingScores, scores } = this.state;

        if (!useLocalData && !loadingScores)
            return scores;

        const { surveyState } = this.props;
        if (surveyState.loading || !surveyState.isSignedIn)
            return null;
        const { survey } = surveyState;
        const { responses, selectedFilters } = this.state;

        const aggregator = new ResponseAggregator({ survey, responses });
        return aggregator.multipleByCategory(selectedFilters);
    }
}

const getFilters = (surveyState) => {
    return new ScoreLoader(surveyState).loadFilters();
};

const getResponses = (surveyState) => {
    return new ScoreLoader(surveyState).loadOrganisationResponses();
};

const getScores = (surveyState, filters) => {
    return new ScoreLoader(surveyState).loadAggregatedScores(filters);
};

const getInitialSelectedFilters = (respondent, filters) => {
    if (!respondent || !respondent.identifier)
        return [];
    return filters.filter(f =>
        f.key.identifier === 'default' ||
        !!respondent.role && f.type === 'role' && f.key.identifier === respondent.role ||
        !!respondent.department && f.type === 'department' && f.key.identifier === respondent.department
    ).sort((a, b) => startSortOrder[a.type] - startSortOrder[b.type]);
};