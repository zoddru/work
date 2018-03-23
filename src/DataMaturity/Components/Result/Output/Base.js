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
const responsesCache = common.responsesCache;

const getScoresForOrganisation = (surveyState) => {
    const { organisation, created } = surveyState;

    if (!organisation || !organisation.identifier)
        return Promise.resolve({ data: [] });

    const cached = responsesCache.get(organisation.identifier);
    if (cached && cached.created === created) {
        return Promise.resolve({ data: cached.responses });
    }

    return axios.get(`/dmApi/responses?organisation=${organisation.identifier}`)
        .then(r => {
            const toCache = { created, responses: (r.data || []) };
            responsesCache.set(organisation.identifier, toCache);
            return r;
        });
};

class TypedItem {
    constructor (type, item) {
        Object.assign(this, item, { type });
        Object.freeze(this);
    }

    get key() {
        return `${this.type}-${this.identifier}`;
    }
}

const createFilters = (surveyState) => {

    const { respondent, organisation, options } = surveyState;
    const { departments, roles } = options;
    const { department, role } = respondent;

    const filters = [
        {
            key: new TypedItem('respondent', { identifier: respondent.identifier, label: 'My score' }),
            filter: v => v.respondent.identifier === respondent.identifier
        }
    ].concat(
        roles.map(r => ({
            key: new TypedItem('role', r),
            filter: v => v.respondent.role === r.identifier
        }))
    ).concat(
        departments.map(d => ({
            key: new TypedItem('department', d),
            filter: v => v.respondent.department === d.identifier
        }))
    );

    if (organisation) {
        filters.push({
            key: new TypedItem('organisation', { identifier: organisation.identifier, label: organisation.shortLabel || organisation.label }),
            filter: v => v.respondent.organisation === organisation.identifier
        });
    }

    filters.forEach(f => {
        f.value = f.key.key;
        f.type = f.key.type;
        f.label = f.key.label;
    });

    return filters;
};

export default class Container extends React.Component {
    constructor(props) {
        super(props);

        this.filters = [];

        this.state = {
            loadingResponses: false,
            responses: [],
            responsesLoaded: false,
            selectedDepartments: [],
            selectedRoles: [],
            selectedFilters: []
        };

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

        this.filters = createFilters(props.surveyState);

        this.setState(prevState => {
            const respondent = props.surveyState.respondent;
            if (!respondent)
                return { loadingResponses: true };

            const newState = { loadingResponses: true };

            if (!!respondent.department) {
                newState.selectedDepartments = [respondent.department];
            }

            if (!!respondent.role) {
                newState.selectedRoles = [respondent.role];
            }

            newState.selectedFilters = this.filters.filter(f => 
                f.type === 'respondent' || 
                f.type === 'organisation' ||
                !!respondent.role && f.type === 'role' && f.key.identifier === respondent.role ||
                !!respondent.department && f.type === 'department' && f.key.identifier === respondent.department
            );

            return newState;
        });

        this.loadData(props);
    }

    loadData(props) {
        this.dataPromise = getScoresForOrganisation(props.surveyState).then(r => {
            if (this.dataPromise.canceled)
                return;                
            const responses = r.data || [];
            this.dataPromise = null;
            this.setState(prevState => ({ loadingResponses: false, responsesLoaded: true, responses }));
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
        const { loadingResponses, selectedFilters } = this.state;

        if (surveyState.loading)
            return <Loading />;

        if (!isSignedIn)
            return <NotSignedIn status={authStatus} />;

        if (loadingResponses)
            return <Loading message="loading responses. hang on..." />;

        const filters = this.filters;

        return <section class="main-content">
            <article>
                <section className="category">
                    <header>
                        <h2>{this.props.heading}</h2>
                    </header>
                    <main>
                        <form>

                            <div className="form-item">
                                <label>Series</label>
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
        const { respondent, survey, options, organisation } = surveyState;
        const { responses, selectedDepartments, selectedRoles, selectedFilters } = this.state;

        const aggregator = new ResponseAggregator({ survey, responses });

        const filters = [
            {
                key: new TypedItem('respondent', { identifier: respondent.identifier, label: 'My score' }),
                filter: r => r.respondent.identifier === respondent.identifier
            }
        ];

        if (organisation) {
            filters.push({
                key: new TypedItem('organisation', { identifier: organisation.identifier, label: organisation.shortLabel || organisation.label }),
                filter: r => r.respondent.organisation === organisation.identifier
            });
        }

        const { departments, roles } = options;

        selectedDepartments.forEach(dept => {
            const key = new TypedItem('department', departments.find(d => d.identifier === dept) || { identifier: dept, label: dept });
            filters.push({
                key: key,
                filter: r => r.respondent.department === dept
            });
        });

        selectedRoles.forEach(role => {
            const key = new TypedItem('role', roles.find(r => r.identifier === role) || { identifier: role, label: role });
            filters.push({
                key: key,
                filter: r => r.respondent.role === role
            });
        });

        return aggregator.multipleByCategory(selectedFilters);
    }
}