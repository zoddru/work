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

const buildTable = (survey, scores) => {
    const headings = survey.categories.map(c => c.label).concat(['Overall']);

    const rows = [];

    scores.forEach(score => {
        const row = {
            heading: score.respondent.identifier,
            values: score.categoryScores.map(cs => cs.identifier)
        };
        rows.push(row);
    });

    return new Table({ headings, rows });
};

export default class SuperTable extends React.Component {
    constructor(props) {
        super(props);

        const { surveyState } = this.props;
        const { authStatus, survey } = surveyState;
        this.state = { scores: [] };

        const self = this;
    }

    componentWillReceiveProps(nextProps) {
        if (!hasOrganisationChanged(this.props.surveyState, nextProps.surveyState))
            return;
        if (!nextProps.surveyState.survey)
            return;

        const survey = nextProps.surveyState.survey;

        getScoresForOrganisation(nextProps.surveyState).then(response => {
            if (!response.data)
                return;
            const results = response.data;
            const scores = SurveyScore.createArray(survey, results);
            console.log(scores);
        });
    }

    render() {
        const { surveyState } = this.props;
        const { authStatus, options, survey, respondent } = surveyState;
        const { departments, roles } = options;
        const { isSignedIn, user } = authStatus;
        const { scores } = this.state;

        if (!isSignedIn) {
            return <SignInDetails status={authStatus} />
        }

        // console.log('scores:');
        // console.log(scores);
        // const table = buildTable(survey, []);

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

                        {/* <TableComponent table={table} className="summary">
                        </TableComponent> */}

                        {/* <div className="form-item">
                            <label>Department</label>
                            <div className="value">
                                <Select
                                    name="department"
                                    clearable={false}
                                    value={respondent.department}
                                    options={common.toSelectOptions(departments)}
                                />
                            </div>
                        </div>
                        <div className="form-item">
                            <label>Role</label>
                            <div className="value">
                                <Select
                                    name="role"
                                    clearable={false}
                                    value={respondent.role}
                                    options={common.toSelectOptions(roles)}
                                />
                            </div>
                        </div> */}
                    </form>
                </section>
            </article>
        </section >;
    }
}