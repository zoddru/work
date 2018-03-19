import React from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import SurveyState from '../SurveyState';
import Respondent from '../Respondent';
import Survey from '../Survey';
import ScrollToTop from './ScrollToTop';
import Introduction from './Introduction';
import SurveyMain from './Survey/Main';
import ResultMain from './Result/Main';
import Table from './Result/Table';
import Loading from './Loading';
import NotSignedIn from './NotSignedIn';
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
        .get(`/authentication/status?noCache=${(new Date()).getTime()}`)
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

                const { authStatus, respondent, responses } = authData;
                const answers = survey.createQAMap(responses || []);

                console.log('all loaded');

                onAuthStatusLoaded({ respondent, options, survey, answers, loading: false });
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
        const { score, loading, organisationLabel } = surveyState;

        const loadingEl = <Loading />;

        const routeResults = {
            '/': loading ? loadingEl : <SurveyMain surveyState={surveyState} onRespondentChanged={this.respondentChanged.bind(this)} onAnswerChanged={this.answerChanged.bind(this)} />,
            '/result': loading ? loadingEl :<ResultMain surveyState={surveyState} score={score} />,
            '/organisation': loading ? loadingEl : <ResultMain surveyState={surveyState} score={score} />,
            '/table': loading ? loadingEl : <Table surveyState={surveyState} />
        };

        return <Router key="content">
            <ScrollToTop>
                <Fragment>
                    <nav>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/', hash: '#' }}>Questions</NavLink>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/result', hash: '#' }}>Your results</NavLink>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/organisation', hash: '#' }}>{!!organisationLabel ? organisationLabel : 'Your organisation'}'s results</NavLink>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/table', hash: '#' }}>Table</NavLink>
                    </nav>
                    <Switch>
                        <Route exact path="/" render={() => routeResults['/'] } />
                        <Route exact path="/result" render={() => routeResults['/result'] } />
                        <Route exact path="/organisation" render={() => routeResults['/organisation'] } />

                        <Route exact path="/table" render={() => routeResults['/table'] } />

                        <Route exact path="/test-loading" render={() => <Loading />} />
                        <Route exact path="/test-not-signed-in" render={() => <NotSignedIn status={{ isSignedIn: false }} />} />
                    </Switch>
                </Fragment>
            </ScrollToTop>
        </Router>;
    }
}