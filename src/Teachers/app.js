import VuePayModel from './VuePayModel';

const payPoints = [
    { name: 'M1', money: 22467, staff: 1 },
    { name: 'M2', money: 72729, staff: 3 },
    { name: 'M3', money: 183344, staff: 7 },
    { name: 'M4', money: 28207, staff: 1 },
    { name: 'M5', money: 30430, staff: 1 },
    { name: 'M6a', money: 32835, staff: 1 },
    { name: 'M6b', money: 33160, staff: 1 }
];

const model = new VuePayModel('#payModel', payPoints);

const app = new Vue(model);