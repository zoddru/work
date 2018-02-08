import React from 'react';
import ReactDom from 'react-dom';
import PayModel from './PayModel';
import PayModelComponent from './Components/PayModelComponent';
const data = require('./data.json');

const payPoints = data;

const payModel = PayModel.create(payPoints, 1);

const app = document.getElementById('app');

ReactDom.render(<PayModelComponent payModel={payModel}/>, app);