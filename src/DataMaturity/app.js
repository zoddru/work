import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import SurveyComponent from './Components/SurveyComponent';
import SignInDetails from './Components/SignInDetails';
import axios from 'axios';
import Survey from './Survey';
import Respondent from './Respondent';
import SurveyState from './SurveyState';

function getOptions() {
    return axios.get(`/dmApi/respondentOptions`)
        .then(res => {
            return res.data;
        });
}

function getSurvey() {
    return axios.get('/dmApi/survey')
        .then(function (response) {
            return new Survey(response.data);
        });
}

function getAuthThenSavedData() {
    return axios.get('/authentication/status')
        .then(statusRes => {
            const authStatus = statusRes.data;

            renderSignIn(authStatus);

            if (!authStatus.isSignedIn)
                return { authStatus };
            return getSavedData(authStatus);
        });
}

function getSavedData(authStatus) {
    const { identifier, email, organisation } = authStatus.user;
    return axios.get(`/dmApi/responses/${identifier}`)
        .then(function (response) {
            const results = response.data;
            if (!results || !results.length)
                return { authStatus };
            const result = results[0];
            const respondentProps = result.respondent || { identifier, email, council: organisation && organisation.identifier };
            const respondent = new Respondent(respondentProps);
            const responses = !!results.length ? results[0].responses || [] : [];
            return { authStatus, respondentProps, respondent, responses };
        });
}

function renderSignIn(authStatus, ) {
    const app = document.getElementById('signInApp');
    ReactDom.render(<SignInDetails status={authStatus} />, app);
}

function renderSurvey(surveyState) {
    const app = document.getElementById('app');
    ReactDom.render(<SurveyComponent surveyState={surveyState} saveSurveyState={saveSurveyState} />, app);
}

function saveSurveyState(surveyState) {
    const { respondent, responses } = surveyState;

    axios.post('/dmApi/responses', {
        respondent,
        responses
    })
        .then(function (response) {
            //console.log(response.data);
        })
        .catch(function (error) {
            //console.log(error);
        });
}

Promise.all([getOptions(), getSurvey(), getAuthThenSavedData()])
    .then(function ([options, survey, authData]) {
        const { authStatus, respondent, responses } = authData;
        const answers = survey.createQAMap(responses || []);
        const surveyState = new SurveyState({ authStatus, options, survey, respondent, answers });

        renderSurvey(surveyState);
    });



/// TODO TODO TODO TODO replace all this:

// class SurveyApp {
//     constructor() {
//         this.authStatus = null;
//         this.respondentOptions = null;
//         this.respondent = null;
//         this.responses = [];
//         this.survey = null;

//         this.getauthStatus();
//         this.getRespondentOptions();
//         this.getSurveyData();
//     }

//     getauthStatus() {
//         const self = this;

//         axios.get('/authentication/status')
//             .then(function (response) {
//                 self.authStatus = response.data;
//                 //self.initSignIn();
//                 self.getResponses(self.authStatus.isSignedIn ? self.authStatus.user : {});
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }

//     getResponses({ identifier, email, organisation }) {
//         const self = this;

//         axios.get(`/dmApi/responses/${identifier}`)
//             .then(function (response) {
//                 const result = response.data;

//                 self.respondent = new Respondent(!!result.length ? result[0].respondent : { identifier, email, council: organisation && organisation.identifier });
//                 self.responses = !!result.length ? result[0].responses || [] : [];
//                 self.saveResponses();
//                 self.initSurvey();
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }

//     getRespondentOptions() {
//         const self = this;

//         axios.get(`/dmApi/respondentOptions`)
//             .then(function (response) {
//                 const respondentOptions = response.data;
//                 self.respondentOptions = respondentOptions;
//                 self.initSurvey();
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }

//     getSurveyData() {
//         const self = this;

//         axios.get('/dmApi/survey')
//             .then(function (response) {
//                 self.survey = new Survey(response.data);
//                 self.initSurvey();
//             })
//             .catch(function (error) {
//                 console.log(error);
//             });
//     }

//     saveResponses() {
//         const { respondent, responses } = this;

//         axios.post('/dmApi/responses', {
//             respondent,
//             responses
//         })
//             .then(function (response) {
//                 //console.log(response.data);
//             })
//             .catch(function (error) {
//                 //console.log(error);
//             });
//     }

//     updateRespondent(respondent) {
//         this.respondent = respondent;
//         this.saveResponses();
//     }

//     updateAnswers(responses) {
//         this.responses = responses;
//         this.saveResponses();
//     }



//     initSurvey() {
//         const { authStatus, respondent, responses, respondentOptions, survey } = this;

//         if (!authStatus || !respondent || !responses || !respondentOptions || !survey)
//             return; // not yet ready

//         const app = document.getElementById('app');
//         ReactDom.render(<SurveyComponent
//             survey={survey}
//             respondent={respondent}
//             respondentOptions={respondentOptions}
//             responses={survey.createQAMap(responses)}
//             authStatus={authStatus}
//             onRespondentChanged={this.updateRespondent.bind(this)}
//             onAnswersChanged={this.updateAnswers.bind(this)}
//         />, app);
//     }
// }

// new SurveyApp();