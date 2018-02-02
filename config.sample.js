const signInUrl = 'https://signin.esd.org.uk/';

const config = {
    server: {
        protocol: 'http',
        host: 'dev.node.esd.org.uk',
        port: process.env.PORT || 8000
    },
    oAuth: {
        signInUrl: signInUrl,
        signOutUrl: signInUrl + 'signout.html',
        url: signInUrl + 'oauth.handler',
        consumerKey: 'KEY',
        consumerSecret: 'SECRET'
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