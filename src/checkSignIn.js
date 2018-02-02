const config = require('./config');
const request = require('request');

function checkSignIn(req, res, next) {
    if (req.method !== 'GET')
        return;

    

    next();
}

module.exports = checkSignIn;