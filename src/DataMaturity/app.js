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
import SurveyWithResponses from './SurveyWithResponses';

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
            const authenticationStatus = statusRes.data;

            renderSignIn(authenticationStatus);

            if (!authenticationStatus.isSignedIn)
                return { authenticationStatus };
            return getSavedData(authenticationStatus);
        });
}

function getSavedData(authenticationStatus) {
    const { identifier, email, organisation } = authenticationStatus.user;
    return axios.get(`/dmApi/responses/${identifier}`)
        .then(function (response) {
            const results = response.data;
            if (!results || !results.length)
                return { authenticationStatus };
            const result = results[0];
            const respondentProps = result.respondent || { identifier, email, council: organisation && organisation.identifier };
            const respondent = new Respondent(respondentProps);
            const responses = !!results.length ? results[0].responses || [] : [];
            return { authenticationStatus, respondentProps, respondent, responses };
        });
}

function renderSignIn(authenticationStatus,) {
    const app = document.getElementById('signInApp');
    ReactDom.render(<SignInDetails status={authenticationStatus} />, app);
}

function renderSurvey(authenticationStatus, options, surveyWithResponses) {
    const app = document.getElementById('app');
    ReactDom.render(<SurveyComponent
        authenticationStatus={authenticationStatus}
        options={options}
        surveyWithResponses={surveyWithResponses}
    />, app);
}

Promise.all([getOptions(), getSurvey(), getAuthThenSavedData()])
    .then(function ([options, survey, authData]) {
        const { authenticationStatus, respondent, responses } = authData;
        const answers = survey.createQAMap(responses || []);
        const surveyWithResponses = new SurveyWithResponses({ survey, respondent, answers });
        
        renderSurvey(authenticationStatus, options, surveyWithResponses);
    });



/// TODO TODO TODO TODO replace all this:

// class SurveyApp {
//     constructor() {
//         this.authenticationStatus = null;
//         this.respondentOptions = null;
//         this.respondent = null;
//         this.responses = [];
//         this.survey = null;

//         this.getAuthenticationStatus();
//         this.getRespondentOptions();
//         this.getSurveyData();
//     }

//     getAuthenticationStatus() {
//         const self = this;

//         axios.get('/authentication/status')
//             .then(function (response) {
//                 self.authenticationStatus = response.data;
//                 //self.initSignIn();
//                 self.getResponses(self.authenticationStatus.isSignedIn ? self.authenticationStatus.user : {});
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
//         const { authenticationStatus, respondent, responses, respondentOptions, survey } = this;

//         if (!authenticationStatus || !respondent || !responses || !respondentOptions || !survey)
//             return; // not yet ready

//         const app = document.getElementById('app');
//         ReactDom.render(<SurveyComponent
//             survey={survey}
//             respondent={respondent}
//             respondentOptions={respondentOptions}
//             responses={survey.createQAMap(responses)}
//             authenticationStatus={authenticationStatus}
//             onRespondentChanged={this.updateRespondent.bind(this)}
//             onAnswersChanged={this.updateAnswers.bind(this)}
//         />, app);
//     }
// }

// new SurveyApp();