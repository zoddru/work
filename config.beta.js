const signInUrl = 'https://signin.esd.org.uk/';

const config = {
    server: {
        protocol: 'https',
        host: process.env.host || '',
        port: process.env.PORT || 8000
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
    },
    dataMaturity: {
        apiScheme: 'http',
        apiHost: 'beta.api.dataMaturity.esd.org.uk'
    }
};

Object.defineProperties(config.server, {
    rootUrl: {
        get: () => {
            return `${config.server.protocol}://${config.server.host}/`
        }
    }
});

module.exports = config;
