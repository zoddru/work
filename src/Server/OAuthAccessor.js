class SessionOAuthAccessor {
    constructor(req, res) {

        this.get = function() {
            return req.session.oAuth;
        };

        this.set = function(value) {
            req.session.oAuth = value;
        };

        Object.freeze(this);
    }
}


class CookieOAuthAccessor {
    constructor(req, res) {

        this.get = function() {
            return req.cookies.CHANCHANX;
        };

        this.set = function(value) {
            res.cookie('CHANCHANX', value);
        };

        Object.freeze(this);
    }
}


export default CookieOAuthAccessor;