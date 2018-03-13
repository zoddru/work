import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import Survey from './Survey';
import Respondent from './Respondent';
import SurveyState from './SurveyState';
import SignInDetails from './Components/SignInDetails';
import SurveyMain from './Components/Survey/Main';
import ResultMain from './Components/Result/Main';
import AppRoot from './Components/AppRoot';

if ('scrollRestoration' in history) { // turn off scrolling to top bottom in chrome
    history.scrollRestoration = 'manual';
}

function renderSignIn(authStatus) {
    const app = document.getElementById('signInApp');
    ReactDom.render(<SignInDetails status={authStatus} />, app);
}

const start = () => {
    const app = document.getElementById('appRoot');
    ReactDom.render(<AppRoot onAuthStatusReceived={renderSignIn} />, app);
};

start();