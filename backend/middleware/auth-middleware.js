const { auth, UnauthorizedError } = require('express-oauth2-jwt-bearer');

const validateAuth = function(req, res, next) {
    auth({
        issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
        audience: process.env.AUTH0_AUDIENCE,
    })(req, res, function (err) {
        if (!err) {
            if (req.headers.authsub) {
                req.authsub = req.headers.authsub;
            }
            req.isAuthenticated = true;
            next();
        }
        else {
            next(err);
        }
    });
};

function checkAuth(req, res, next) {
    validateAuth(req, res, function (err) {
       if (err instanceof UnauthorizedError) {
           next();
       }
       else {
           if (err) {
               next(err);
           }
           else {
               next();
           }
       }
    });
}

module.exports = {
    validateAuth,
    checkAuth
};