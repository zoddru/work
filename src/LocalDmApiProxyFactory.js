const config = require('../config.broker');
import proxy from 'express-http-proxy';
import fs from 'fs';

export default function ({pathRegex = /^\/dmApi/} = {}) {
    return proxy('localhost:8000', {
        userResDecorator: res => fs.readFileSync(`${__dirname}\\DataMaturity\\data.json`)
    });
}