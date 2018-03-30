import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import SignInDetails from '../../SignInDetails';
import Loading from '../../Loading';
import NotSignedIn from '../../NotSignedIn';
import SimpleTable from './SimpleTable';
import ResponseAggregator from '../../../Scores/ResponseAggregator';
import common from '../../../common';
import { create } from 'domain';
const { filtersCache, responsesCache } = common;

const startSortOrder = { respondent: 1, organisation: 2, role: 3, department: 4 };

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

class TypedItem {
    constructor(type, item) {
        Object.assign(this, item, { type });
        Object.freeze(this);
    }

    get key() {
        return `${this.type}-${this.identifier}`;
    }

    equals(item) {
        if (!item)
            return false;
        return this.type === item.type && this.identifier === item.identifier;
    }
}

const getInitialSelectedFilters = (respondent, filters) => {
    if (!respondent || !respondent.identifier)
        return [];
    return filters.filter(f =>
        f.type === 'respondent' ||
        f.type === 'organisation' ||
        !!respondent.role && f.type === 'role' && f.key.identifier === respondent.role ||
        !!respondent.department && f.type === 'department' && f.key.identifier === respondent.department
    ).sort((a, b) => startSortOrder[a.type] - startSortOrder[b.type]);
};

const createFilters = (surveyState, options) => {

    const { respondent, organisation } = surveyState;
    const { departments, roles, areaGroups } = options;
    const { department, role } = respondent;

    const filters = [
        {
            key: new TypedItem('respondent', { identifier: respondent.identifier, label: 'My score' }),
            local: true,
            filter: v => v.respondent.identifier === respondent.identifier
        }
    ].concat(
        roles.map(r => ({
            key: new TypedItem('role', r),
            local: true,
            filter: v => v.respondent.role === r.identifier
        }))
    ).concat(
        departments.map(d => ({
            key: new TypedItem('department', d),
            local: true,
            filter: v => v.respondent.department === d.identifier
        }))
    ).concat(
        areaGroups.map(ag => ({
            key: new TypedItem('areaGroup', ag),
            local: false,
            filter: v => false
        }))
    );

    if (organisation) {
        filters.push({
            key: new TypedItem('organisation', { identifier: organisation.identifier, label: organisation.shortLabel || organisation.label }),
            local: true,
            filter: v => v.respondent.organisation === organisation.identifier
        });
    }

    filters.forEach(f => {
        f.value = f.key.key;
        f.type = f.key.type;
        f.label = f.key.label;
    });

    filters.sort((a, b) => a.label < b.label ? -1 : 1);

    return filters;
};

export default class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFilters: [],

            loadingFilters: false,
            filters: [],
            filtersLoaded: false,

            loadingResponses: false,
            responses: [],
            responsesLoaded: false,

            externalAggregatedScoresMap: new Map()
        };

        this.state.externalAggregatedScoresMap.set('areaGroup-Essex_CIPFA_Near_Neighbours', {

        });

        this.dataPromise = null;
    }

    hasOrganisationChanged(nextProps) {
        const currentOrg = this.props.surveyState.organisation;
        const nextOrg = nextProps.surveyState.organisation;
        return (currentOrg !== nextOrg);
    }

    changeFilters(selectedFilters) {
        this.setState(prevState => ({ selectedFilters: selectedFilters }));
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

    componentWillMount() {
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
        const { loadingFilters, loadingResponses, filters, selectedFilters } = this.state;

        if (surveyState.loading)
            return <Loading />;

        if (!isSignedIn)
            return <NotSignedIn status={authStatus} />;

        if (loadingFilters)
            return <Loading message="loading filters. please wait..." />;

        if (loadingResponses)
            return <Loading message="loading responses. hang on..." />;

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