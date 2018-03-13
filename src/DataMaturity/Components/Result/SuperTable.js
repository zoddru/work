import React from 'react';
import Select from 'react-select';
import SignInDetails from '../SignInDetails';
import SurveyScore from '../../Scores/SurveyScore';
import common from '../../common';
import Table from '../../SimpleTable';
import TableComponent from '../SimpleTable';
import axios from 'axios';

const getOrganisation = (surveyState) => {
    return surveyState
        && surveyState.authStatus
        && surveyState.authStatus.user
        && surveyState.authStatus.user.organisation;
};

const hasOrganisationChanged = (oldSurveyState, newSurveyState) => {
    const oldOrg = getOrganisation(oldSurveyState);
    const newOrg = getOrganisation(newSurveyState);
    return oldOrg && oldOrg.identifier !== newOrg && newOrg.identifier;
};

const getScoresForOrganisation = (surveyState) => {
    const organisation = getOrganisation(surveyState);
    if (!organisation || !organisation.identifier)
        return { then: () => { return { data: [] } } };
    return axios.get(`/dmApi/responses?organisation=${organisation.identifier}`);
};

const buildTable = ({ survey, scores, respondent, selectedDepartments = [], selectedRoles = [] }) => {
    const categoryHeadings = survey.categories.map(c => c.label);
    const headings = ['Data'].concat(categoryHeadings).concat(['Overall']);

    const rows = [];

    if (!!respondent) {
        scores.filter(s => s.respondent.identifier === respondent.identifier)
            .forEach(s => rows.push(['respondent'].concat(s.categoryScores.map(cs => cs.meanDisplayName)).concat([s.meanDisplayName])));
    }

    const departments = selectedDepartments.map(item => item.value);
    if (!!departments) {
        scores.filter(s => departments.includes(s.respondent.department))
            .forEach(s => rows.push([s.respondent.department].concat(s.categoryScores.map(cs => cs.meanDisplayName)).concat([s.meanDisplayName])));
    }

    const roles = selectedRoles.map(item => item.value);
    if (!!roles) {
        scores.filter(s => roles.includes(s.respondent.role))
            .forEach(s => rows.push([s.respondent.role].concat(s.categoryScores.map(cs => cs.meanDisplayName)).concat([s.meanDisplayName])));
    }

    return new Table({ headings, rows });
};



export default class SuperTable extends React.Component {
    constructor(props) {
        super(props);

        const { surveyState } = this.props;
        const { authStatus, survey, respondent, options } = surveyState;

        const { departments, roles } = options;

        this.state = { scores: [], selectedDepartments: [], selectedRoles: [] };

        const self = this;
    }

    get table() {
        const { surveyState } = this.props;
        const { authStatus, options, survey, respondent } = surveyState;
        const { isSignedIn, user } = authStatus;

        if (!isSignedIn)
            return null;

        const { scores, selectedDepartments, selectedRoles } = this.state;

        return buildTable({ survey, scores, respondent, selectedDepartments, selectedRoles });
    }

    componentWillReceiveProps(nextProps) {
        if (!hasOrganisationChanged(this.props.surveyState, nextProps.surveyState))
            return;
        if (!nextProps.surveyState.survey)
            return;

        const survey = nextProps.surveyState.survey;
        const self = this;

        getScoresForOrganisation(nextProps.surveyState).then(response => {
            if (!response.data)
                return;
            const results = response.data;
            const scores = SurveyScore.createArray(survey, results);
            self.setState(prevState => ({ scores }));
        });
    }

    changeDepartments(selectedDepartments) {
        this.setState(prevState => ({ selectedDepartments }));
    }

    changeRoles(selectedRoles) {
        this.setState(prevState => ({ selectedRoles }));
    }

    render() {
        const { surveyState } = this.props;
        const { authStatus, options, survey, respondent } = surveyState;
        const { departments, roles } = options;
        const { isSignedIn, user } = authStatus;

        if (!isSignedIn) {
            return <SignInDetails status={authStatus} />
        }

        const { selectedDepartments, selectedRoles } = this.state;

        const table = this.table;

        return <section class="main-content">
            <article>
                <section className="category">
                    <header>
                        <h2>Super table</h2>
                    </header>
                    <form>
                        <div className="form-item">
                            <label>Organisation</label>
                            <div className="value">{user.organisation.label}</div>
                        </div>
                        <div className="form-item">
                            <label>Department</label>
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

                        <TableComponent table={table} className="summary" />
                    </form>
                </section>
            </article>
        </section >;
    }
}