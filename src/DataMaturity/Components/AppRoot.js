import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import SurveyState from '../SurveyState';
import Respondent from '../Respondent';
import Survey from '../Survey';
import ScrollToTop from './ScrollToTop';
import SurveyMain from './Survey/Main';
import ResultMain from './Result/Main';
import SuperTable from './Result/SuperTable';
const Fragment = React.Fragment;

const saveSurveyState = (surveyState) => {

    const { respondent, responses } = surveyState;

    axios.post('/dmApi/responses', {
        respondent,
        responses
    })
        .then(function (response) {
            //console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
};

const loadAuthThenSavedData = (onLoaded) => {
    return axios
        .get('/authentication/status')
        .then(statusRes => {
            const authStatus = statusRes.data;

            onLoaded({ authStatus });

            if (!authStatus.isSignedIn)
                return { authStatus };
            return loadSavedData(authStatus);
        });
};

const loadSavedData = (authStatus) => {
    if (!authStatus.isSignedIn)
        return { authStatus };

    const { identifier, email, organisation } = authStatus.user;

    return axios.get(`/dmApi/responses/${identifier}`)
        .then(function (response) {
            const result = Object.assign(getNewSaveDataResponse(authStatus.user), response.data);
            const respondent = new Respondent(result.respondent);
            const responses = result.responses || [];
            return { authStatus, respondent, responses };
        });
};

const getOptions = () => {
    return axios.get(`/dmApi/respondentOptions`)
        .then(res => {
            return res.data;
        });
};

const getSurvey = () => {
    return axios.get('/dmApi/survey')
        .then(function (response) {
            return new Survey(response.data);
        });
};

const getNewSaveDataResponse = ({ identifier, email, organisation }) => {
    return {
        respondent: { identifier, email, organisation: organisation && organisation.identifier },
        responses: []
    };
};

export default class AppRoot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            surveyState: new SurveyState()
        };

        this.loadData();
    }

    changeSurveyStatus(newProps) {
        const self = this;
        this.setState(prevState => {
            const surveyState = prevState.surveyState.change(newProps);
            return { surveyState };
        });
    }

    loadData() {
        const self = this;
        const onAuthStatusLoaded = (newProps => { this.props.onAuthStatusReceived(newProps.authStatus), self.changeSurveyStatus(newProps); });

        Promise.all([loadAuthThenSavedData(onAuthStatusLoaded), getOptions(), getSurvey()])
            .then(([authData, options, survey]) => {

                console.log('all loaded');

                const { authStatus, respondent, responses } = authData;
                const answers = survey.createQAMap(responses || []);
                self.changeSurveyStatus({ respondent, options, survey, answers });
            });
    }

    respondentChanged(respondentProps) {
        const self = this;
        this.setState(prevState => {
            const surveyState = prevState.surveyState.changeRespondent(respondentProps);
            saveSurveyState(surveyState);
            return { surveyState };
        });
    }

    answerChanged(question, answer) {
        const self = this;
        this.setState(prevState => {
            const surveyState = prevState.surveyState.changeAnswer(question, answer);
            saveSurveyState(surveyState);
            return { surveyState };
        });
    }

    render() {
        const { surveyState } = this.state;

        return <Router key="content">
            <ScrollToTop>
                <Fragment>
                    <nav>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/', hash: '#' }}>Questions</NavLink>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/result', hash: '#' }}>Results</NavLink>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/organisation', hash: '#' }}>Organisation results</NavLink>
                    </nav>
                    <Switch>
                        <Route exact path="/" render={() => <SurveyMain surveyState={surveyState} onRespondentChanged={this.respondentChanged.bind(this)} onAnswerChanged={this.answerChanged.bind(this)} />} />
                        <Route exact path="/result" render={() => <ResultMain score={surveyState.score} />} />
                        <Route exact path="/organisation" render={() => <ResultMain score={surveyState.score} />} />
                        
                        <Route exact path="/superTable" render={() => <SuperTable surveyState={surveyState} />} />
                    </Switch>
                </Fragment>
            </ScrollToTop>
        </Router>;
    }
}