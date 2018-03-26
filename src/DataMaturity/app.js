import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import Survey from './Survey';
import Respondent from './Respondent';
import SurveyState from './SurveyState';
import TopBar from './Components/TopBar';
import Footer from './Components/Footer';
import SurveyMain from './Components/Survey/Main';
import ResultMain from './Components/Result/Main';
import AppRoot from './Components/AppRoot';
//import AnimatedExample from './Components/AnimatedExample';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory()

if ('scrollRestoration' in history) { // turn off scrolling to top bottom in chrome
    history.scrollRestoration = 'manual';
}

function renderHeader(authStatus) {
    ReactDom.render(<TopBar status={authStatus} />, document.getElementById('mainHeader'));
}

const start = () => {
    ReactDom.render(<AppRoot onAuthStatusReceived={renderHeader} history={history} />, document.getElementById('appRoot'));
};

ReactDom.render(<Footer history={history} />, document.getElementById('mainFooter'));

start();