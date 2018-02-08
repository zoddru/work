import React from 'react';
import ReactDom from 'react-dom';
import PayModel from './PayModel';
import PayModelComponent from './Components/PayModelComponent';

const payPoints = [
    { name: 'M1', money: 22467, staff: 1 },
    { name: 'M2', money: 72729, staff: 3 },
    { name: 'M3', money: 183344, staff: 7 },
    { name: 'M4', money: 28207, staff: 1 },
    { name: 'M5', money: 30430, staff: 1 },
    { name: 'M6a', money: 32835, staff: 1 },
    { name: 'M6b', money: 33160, staff: 1 }
];

const payModel = PayModel.create(payPoints, 1);

const app = document.getElementById('app');

ReactDom.render(<PayModelComponent payModel={payModel}/>, app);