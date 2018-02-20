const signInUrl = 'https://signin.esd.org.uk/';

const config = {
    server: {
        protocol: 'https',
        host: 'vast-basin-95949.herokuapp.com',
        port: process.env.PORT || 80
    },
    oAuth: {
        signInUrl: signInUrl,
        signOutUrl: signInUrl + 'signout.html',
        url: signInUrl + 'oauth.handler',
        consumerKey: process.env.consumerKey || '',
        consumerSecret: process.env.consumerSecret || ''
    },
    webservices: {
        root: 'http://webservices.esd.org.uk/'
    }
};

Object.defineProperties(config.server, {
    rootUrl: {
        get: () => {
            return `${config.server.protocol}://${config.server.host}:${config.server.port}/`
        }
    }
});

module.exports = config;