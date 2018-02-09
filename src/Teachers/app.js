import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import PayModelStore from './PayModelStore';
import PayModelComponent from './Components/PayModelComponent';

const data = require('./data.json');
const yearKeys = Object.keys(data);
const years = yearKeys.map(y => parseInt(y));
const areas = Object.keys(data[yearKeys[0]]); // assume just the first one
const store = new PayModelStore(data);
const app = document.getElementById('app');

ReactDom.render(<PayModelComponent data={store} years={years} areas={areas} />, app);