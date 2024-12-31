const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../models/user');

const isAuthenticated = async (req, res, next) => {
    if (req.method == "OPTIONS") {
        res.status(200);
        return res.send();
    }
    // return next();    // Bypass the Authentication step
    try {
        const token = req.cookies?.token;
        console.log(token);
        if (token) {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const doc = await findUserByEmail(payload.email);
            if (!doc) {
                throw "notfound";
            }
            req.userDetails = { email: doc.email, username: doc.username, userId: doc.userId };
            next();
        } else {
            throw "notfound";
        }
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send()
    }

}


exports.isAuth = isAuthenticated;
