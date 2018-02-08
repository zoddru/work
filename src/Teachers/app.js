import React from 'react';
import ReactDom from 'react-dom';
import PayModel from './PayModel';
import PayModelComponent from './Components/PayModelComponent';
const data = require('./data.json');

const year = "2016";
const area = "England & Wales";
const payPoints = data[year][area];

const payModel = PayModel.create({ year: parseInt(year), area, payPoints, percentageIncrease: 1 });

const app = document.getElementById('app');

ReactDom.render(<PayModelComponent payModel={payModel}/>, app);