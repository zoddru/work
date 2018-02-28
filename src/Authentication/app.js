import axios from 'axios';
import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import SignInDetails from './Components/SignInDetails';

function init(status) {
    const app = document.getElementById('app');
    ReactDom.render(<SignInDetails status={status} />, app);
}

axios.get('/authentication/status')
    .then(function (response) {
        init(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });