import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import PayModel from './PayModel';
import PayModelComponent from './Components/PayModelComponent';
const data = require('./data.json');

const app = document.getElementById('app');


ReactDom.render(<PayModelComponent data={data} />, app);