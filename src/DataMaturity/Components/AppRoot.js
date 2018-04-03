import React from 'react';
import { Router, Switch, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-responsive-modal';
import SurveyState from '../SurveyState';
import Respondent from '../Respondent';
import Survey from '../Survey';
import ScrollToTop from './ScrollToTop';
import SurveyMain from './Survey/Main';
import ResultMain from './Result/Main';
import OrganisationMain from './Result/OrganisationMain';
import Disclaimer from './Disclaimer';
import ResultTable from './Result/Output/Table';
import ResultChart from './Result/Output/Chart';
import LocalStore from '../LocalStore';
import Loading from './Loading';
import NotSignedIn from './NotSignedIn';
import ModalExample from './ModalExample';
const Fragment = React.Fragment;

const localStore = new LocalStore('DataMaturity_Responses');


export default class AppRoot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            surveyState: new SurveyState(),
            hasConflicts: false
        };

        this.mergeReport = { preserved: [], overwritten: [], conflicts: [], hasConflicts: false };
    }

    componentDidMount() {
        this.loadData();
    }

    changeSurveyStatus(loadedProps, save) {
        const self = this;
        this.setState(prevState => {
            const surveyState = prevState.surveyState.change(loadedProps);
            if (save) {
                saveSurveyState(surveyState);
            }
            return { surveyState };
        });
    }

    warnConflict(mergeReport) {
        this.mergeReport = mergeReport;
        const hasConflicts = mergeReport.hasConflicts;
        this.setState({ hasConflicts });
    }

    acceptMerge() {
        const answers = this.mergeReport.overwritten;
        this.changeSurveyStatus({ answers }, true);
        this.setState(prevState => ({ hasConflicts: false }));
    }

    rejectMerge() {
        const answers = this.mergeReport.preserved;
        this.changeSurveyStatus({ answers }, true);
        this.setState(prevState => ({ hasConflicts: false }));
    }

    loadData() {
        const onAuthStatusLoaded = (authStatus => { this.props.onAuthStatusReceived(authStatus), this.changeSurveyStatus({ authStatus }, false); });

        Promise.all([loadAuthThenSavedData(onAuthStatusLoaded), getOptions(), getSurvey()])
            .then(([authData, options, survey]) => {

                const { authStatus, respondent, responses } = authData;
                const loadedAnswers = survey.createQAMap(responses || []);

                const enteredResponses = localStore.fetch();
                const enteredAnswers = survey.createQAMap(enteredResponses || []);

                const mergeReport = survey.mergeAnswers(loadedAnswers, enteredAnswers);

                const loadedData = { respondent, options, survey, loading: false };

                console.log('all loaded');

                if (mergeReport.hasConflicts) {
                    this.changeSurveyStatus(loadedData, false);
                    this.warnConflict(mergeReport);
                }
                else {
                    loadedData.answers = mergeReport.overwritten;
                    this.changeSurveyStatus(loadedData, true);
                }
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
        const { surveyState, hasConflicts } = this.state;
        const { history } = this.props;
        const { score, loading, userLabel, organisationLabel } = surveyState;

        const loadingEl = <Loading />;

        const routeResults = {
            '/': loading ? loadingEl : <SurveyMain surveyState={surveyState} onRespondentChanged={this.respondentChanged.bind(this)} onAnswerChanged={this.answerChanged.bind(this)} />,
            '/result': loading ? loadingEl : <ResultMain surveyState={surveyState} score={score} />,
            '/organisation': loading ? loadingEl : <OrganisationMain surveyState={surveyState} />,
            '/disclaimer': <Disclaimer />,
            '/table': loading ? loadingEl : <ResultTable isStandAlone={true} surveyState={surveyState} />,
            '/chart': loading ? loadingEl : <ResultChart isStandAlone={true} surveyState={surveyState} />
        };

        return <Router key="content" history={history}>
            <ScrollToTop>
                <Fragment>
                    <nav>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/', hash: '#' }}>Questions</NavLink>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/result', hash: '#' }}>Your results</NavLink>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/organisation', hash: '#' }}>{!!organisationLabel ? organisationLabel : 'Your organisation'}'s results</NavLink>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/table', hash: '#' }}>Table</NavLink>
                        <NavLink exact className="button" activeClassName="active" to={{ pathname: '/chart', hash: '#' }}>Chart</NavLink>
                    </nav>
                    <Switch>
                        <Route exact path="/" render={() => routeResults['/']} />
                        <Route exact path="/result" render={() => routeResults['/result']} />
                        <Route exact path="/organisation" render={() => routeResults['/organisation']} />
                        <Route exact path="/disclaimer" render={() => routeResults['/disclaimer']} />
                        <Route exact path="/cookies" render={() => routeResults['/cookies']} />
                        <Route exact path="/privacy" render={() => routeResults['/privacy']} />

                        <Route exact path="/table" render={() => routeResults['/table']} />
                        <Route exact path="/chart" render={() => routeResults['/chart']} />

                        <Route exact path="/test-loading" render={() => <Loading />} />
                        <Route exact path="/test-not-signed-in" render={() => <NotSignedIn status={{ isSignedIn: false }} />} />
                        <Route exact path="/test-modal" render={() => <ModalExample />} />
                    </Switch>
                    <Modal open={hasConflicts} onClose={() => { }} little classNames={{ modal: 'modal' }}>
                        <h2>Hello {userLabel}</h2>
                        <p>
                            It looks like you have previously answered some questions in a different way.
                        </p>
                        <p>
                            Would you like to overwrite any saved answers with your latest responses?
                        </p>
                        <div className="buttons">
                            <a className="button" onClick={this.acceptMerge.bind(this)}>Overwrite my previous answers</a>
                            <a className="button" onClick={this.rejectMerge.bind(this)}>Keep my previous answers</a>
                        </div>
                    </Modal>
                </Fragment>
            </ScrollToTop>
        </Router>;
    }
}

const saveSurveyState = (surveyState) => {

    const { respondent, responses } = surveyState;
    const data = { respondent, responses };

    if (!respondent || !respondent.identifier) {
        localStore.store(responses);
        return;
    }

    localStore.clear();

    axios.put('/dmApi/responses', data).catch(error => console.log(error));
    axios.put('/save/area').catch(error => console.log(error));
};

const loadAuthThenSavedData = (onAuthStatusLoaded) => {
    return axios
        .get(`/authentication/status?noCache=${(new Date()).getTime()}`)
        .then(statusRes => {
            const authStatus = statusRes.data;

            onAuthStatusLoaded(authStatus);

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
    const area = organisation && organisation.governs && organisation.governs.identifier; 
    return {
        respondent: { identifier, email, organisation: organisation && organisation.identifier, area },
        responses: []
    };
};