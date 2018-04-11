import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import smoothscroll from 'smoothscroll-polyfill';
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
import ErrorBoundary from './Components/ErrorBoundary';
//import AnimatedExample from './Components/AnimatedExample';
import common from './common';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

smoothscroll.polyfill();

if ('scrollRestoration' in history) { // turn off scrolling to top bottom in chrome
    history.scrollRestoration = 'manual';
}

const authStatusReceived = (authStatus) => {
    common.global.set('authStatus', authStatus);
    ReactDom.render(<ErrorBoundary isSubSection={true}><TopBar status={authStatus} /></ErrorBoundary>, document.getElementById('mainHeader'));
};

const start = () => {
    ReactDom.render(<ErrorBoundary><AppRoot onAuthStatusReceived={authStatusReceived} history={history} /></ErrorBoundary>, document.getElementById('appRoot'));
};

ReactDom.render(<ErrorBoundary isSubSection={true}><Footer history={history} /></ErrorBoundary>, document.getElementById('mainFooter'));

start();