import React from 'react';
import Select from 'react-select';
import SignInDetails from '../SignInDetails';
import ResponseAggregator from '../../Scores/ResponseAggregator';
import Loading from '../Loading';
import NotSignedIn from '../NotSignedIn';
import SimpleTable from '../SimpleTable';
import axios from 'axios';
import common from '../../common';

const responsesCache = new Map();

const getScoresForOrganisation = (organisation) => {
    if (!organisation || !organisation.identifier)
        return Promise.resolve({ data: [] });

    const cachedResponses = responsesCache.get(organisation.identifier);
    if (cachedResponses) {
        return Promise.resolve({ data: cachedResponses });
    }

    return axios.get(`/dmApi/responses?organisation=${organisation.identifier}`).then(r => responsesCache.set(organisation.identifier, r.data || []));
};

export default class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingResponses: false,
            responses: [],
            responsesLoaded: false,
            selectedDepartments: [],
            selectedRoles: []
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
        return getScoresForOrganisation(props.surveyState.organisation).then(r => {
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

    componentWillReceiveProps(nextProps) {
        if (this.hasOrganisationChanged(nextProps))
            return;
        this.init(nextProps);
    }

    render() {
        const { surveyState } = this.props;
        const { isSignedIn, authStatus, survey, respondent, options, organisation } = surveyState;
        const { departments, roles } = options;
        const { loadingResponses, responses, selectedDepartments, selectedRoles } = this.state;

        if (surveyState.loading)
            return <Loading />;

        if (!isSignedIn)
            return <NotSignedIn status={authStatus} />;

        if (loadingResponses)
            return <Loading message="loading responses. hang on..." />;

        const table = this.aggregatedTable;

        return <section class="main-content">
            <article>
                <section className="category">
                    <header>
                        <h2>Table</h2>
                    </header>
                    <main>
                        <form>
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

                            <SimpleTable className="summary" table={table} />

                        </form>
                    </main>
                </section>
            </article>
        </section >;
    }




    get aggregatedScores() {
        const { surveyState } = this.props;
        if (surveyState.loading || !surveyState.isSignedIn)
            return null;
        const { respondent, survey, options } = surveyState;
        const { responses, selectedDepartments, selectedRoles } = this.state;

        const aggregator = new ResponseAggregator({ survey, responses });

        const filters = [
            {
                key: { identifier: respondent.identifier, label: 'Your scores' },
                filter: r => r.respondent.identifier === respondent.identifier
            }
        ];

        const { departments, roles } = options;

        selectedDepartments.forEach(dept => {
            const key = departments.find(d => d.identifier === dept) || { identifier: dept, label: dept };
            filters.push({
                key: key,
                filter: r => r.respondent.department === dept
            });
        });

        selectedRoles.forEach(role => {
            const key = roles.find(r => r.identifier === role) || { identifier: role, label: role };
            filters.push({
                key: key,
                filter: r => r.respondent.role === role
            });
        });

        return aggregator.multipleByCategory(filters);
    }

    get aggregatedTable() {
        const { surveyState } = this.props;

        if (surveyState.loading || !surveyState.isSignedIn)
            return null;

        const scores = this.aggregatedScores;
        const { survey, options } = surveyState;
        const categories = survey.categories;

        const headings = ['Data'].concat(categories).concat(['Overall']);
        const rows = [];

        scores.forEach(s => {
            const row = [s.key];
            rows.push(row);

            categories.forEach(c => {
                const cs = s.categoryScores.find(cs => cs.category.identifier === c.identifier);
                row.push(!!cs ? `${cs.rankLabel} (${cs.meanDisplayName})` : '---');
            });

            row.push(`${s.rankLabel} (${s.meanDisplayName})`);
        });

        return { headings, rows };
    }
}