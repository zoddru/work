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
            filter: r => r.respondent.identifier === respondent.identifier
        }
    ].concat(
        departments.map(d => ({
            key: new TypedItem('department', d),
            filter: r => r.respondent.department === d.identifier
        }))
    ).concat(
        roles.map(r => ({
            key: new TypedItem('role', r),
            filter: r => r.respondent.role === r.identifier
        }))
    );

    if (organisation) {
        filters.push({
            key: new TypedItem('organisation', { identifier: organisation.identifier, label: organisation.shortLabel || organisation.label }),
            filter: r => r.respondent.organisation === organisation.identifier
        });
    }

    filters.forEach(f => {
        f.value = f.key.key;
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
    }

    hasOrganisationChanged(nextProps) {
        const currentOrg = this.props.surveyState.organisation;
        const nextOrg = nextProps.surveyState.organisation;
        return (currentOrg !== nextOrg);
    }

    changeDepartments(selectedDepartments) {
        this.setState(prevState => ({ selectedDepartments: selectedDepartments.map(d => d.value) })); // it would work if we stored th object, but be inconsistent
    }

    changeRoles(selectedRoles) {
        this.setState(prevState => ({ selectedRoles: selectedRoles.map(d => d.value) }));
    }

    changeFilters(selectedFilters) {
        //console.log(selectedFilters);
        this.setState(prevState => ({ selectedFilters: selectedFilters }));
    }

    getSelectOption(lookup, identifier) {
        const item = lookup.find(i => i.identifier === identifier);
        if (!item)
            return null;
        return {
            value: item.identifier,
            label: item.label
        };
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
                newState.selectedDepartments = [respondent.department]; // very weird that the select it wants the identifier, but later can store the object
            }

            if (!!respondent.role) {
                newState.selectedRoles = [respondent.role];
            }

            return newState;
        });

        this.loadData(props);
    }

    loadData(props) {
        const self = this;
        return getScoresForOrganisation(props.surveyState).then(r => {
            const responses = r.data || [];
            self.setState(prevState => ({ loadingResponses: false, responsesLoaded: true, responses }));
        });
    }

    componentWillMount() {
        const { loadingResponses, responsesLoaded } = this.state;
        if (loadingResponses || responsesLoaded)
            return; // console.log('alread loading');
        this.init(this.props);
    }

    render() {
        const { surveyState } = this.props;
        const { isSignedIn, authStatus, survey, respondent, options, organisation } = surveyState;
        const { departments, roles } = options;
        const { loadingResponses, responses, selectedDepartments, selectedRoles, selectedFilters } = this.state;

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

                            <div className="form-item">
                                <label>Organisation</label>
                                <div className="value">{!!organisation ? organisation.label : '---'}</div>
                            </div>
                            <div className="form-item">
                                <label>Function</label>
                                <div className="value">
                                    <Select
                                        name="departments"
                                        clearable={false}
                                        value={selectedDepartments}
                                        multi
                                        onChange={this.changeDepartments.bind(this)}
                                        options={common.toSelectOptions(departments)}
                                    />
                                </div>
                            </div>
                            <div className="form-item">
                                <label>Role</label>
                                <div className="value">
                                    <Select
                                        name="roles"
                                        clearable={false}
                                        value={selectedRoles}
                                        multi
                                        onChange={this.changeRoles.bind(this)}
                                        options={common.toSelectOptions(roles)}
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
        const { responses, selectedDepartments, selectedRoles } = this.state;

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

        return aggregator.multipleByCategory(filters);
    }
}