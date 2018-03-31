import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import qs from 'qs';
import SignInDetails from '../../SignInDetails';
import Loading from '../../Loading';
import NotSignedIn from '../../NotSignedIn';
import SimpleTable from './SimpleTable';
import ResponseAggregator from '../../../Scores/ResponseAggregator';
import ResponseFilters from '../../../Scores/ResponseFilters';
import common from '../../../common';
import { create } from 'domain';
const { filtersCache, responsesCache } = common;

const startSortOrder = { respondent: 1, role: 2, department: 3, organisation: 4 };

export default class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFilters: [],

            loadingFilters: false,
            filters: [],
            filtersLoaded: false,

            useLocalData: true,

            loadingResponses: false,
            responses: [],
            responsesLoaded: false,

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

        const promise = this.scoresPromise = getScores(this.props.surveyState.survey, selectedFilters)
            .then(scores => {
                if (this.state.useLocalData || promise != this.scoresPromise)
                    return;

                console.log(scores);

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
            this.setState(prevState => ({ loadingFilters: false, filtersLoaded: true, selectedFilters: getInitialSelectedFilters(respondent, filters) }));
            return filters;
        };

        this.dataPromise = Promise.all([

            getFilters(props.surveyState).then(loadedFilters),
            getResponses(props.surveyState)

        ]).then(([filters, responses]) => {
            if (this.dataPromise.canceled)
                return;
            this.dataPromise = null;
            this.setState(prevState => ({ loadingResponses: false, responsesLoaded: true, filters, responses }));
        });

        return this.dataPromise;
    }

    componentDidMount() {
        const { loadingResponses, responsesLoaded } = this.state;
        if (loadingResponses || responsesLoaded)
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
        const { useLocalData, loadingFilters, loadingResponses, loadingScores, filters, selectedFilters } = this.state;

        if (surveyState.loading)
            return <Loading />;

        if (!isSignedIn)
            return <NotSignedIn status={authStatus} />;

        if (loadingFilters)
            return <Loading message="loading filters. should not be long..." />;

        if (loadingResponses)
            return <Loading message="loading responses. hang on..." />;

        if (!useLocalData && loadingScores)
            return <Loading message="loading scores. please wait..." />;

        return <section class="main-content">
            <article>
                <section className="category">
                    <header>
                        <h2>{this.props.heading}</h2>
                    </header>
                    <main>
                        <form>
                            <div className="form-item">
                                <label>Show</label>
                                <div className="value">
                                    <Select
                                        name="series"
                                        clearable={false}
                                        value={selectedFilters}
                                        multi
                                        onChange={this.changeFilters.bind(this)}
                                        options={filters}
                                    />
                                </div>
                            </div>
                        </form>

                        {this.renderChildren()}

                    </main>
                </section>
            </article>
        </section >;
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
        const localAggregatedScores = aggregator.multipleByCategory(selectedFilters);

        const aggregatedScores = localAggregatedScores; // todo merge with loaded external scores

        return aggregatedScores;
    }
}

const getFilters = (surveyState) => {
    const { respondent, created } = surveyState;

    if (!respondent || !respondent.identifier)
        return Promise.resolve(createFilters(surveyState, surveyState.options));

    const cached = filtersCache.get(respondent.identifier);
    if (cached && cached.created === created)
        return Promise.resolve(cached.filters);

    return axios.get(`/data/currentResponseOptions`)
        .then(r => {
            const filters = createFilters(surveyState, (r.data || {}));
            filtersCache.set(respondent.identifier, { created, filters });
            return filters;
        });
};

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

const getScores = (survey, filters) => {
    const query = qs.stringify({ filter: filters.map(f => f.key.key) }, { arrayFormat: 'repeat' });    
    return axios.get(`/data/scores?${query}`).then(r => { 
        const simplified = r.data || [];
        const aggregator = new ResponseAggregator({ survey, responses: [] });
        const scores = simplified.map(s => aggregator.unsimplify(s));
        return scores;
    });
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

const createFilters = (surveyState, options) => {
    const { respondent, organisation } = surveyState;
    const { departments, roles, areaGroups } = options;
    return ResponseFilters.create({ respondent, organisation, departments, roles, areaGroups });
};