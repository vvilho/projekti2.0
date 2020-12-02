'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');

// local strategy for username password login
passport.use(new Strategy(
    async (username, password, done) => {
        const params = [username];
        try {
            const [user] = await userModel.getUserLogin(params);
            console.log('Local strategy', user); // result is binary row
            if (user === undefined) {
                return done(null, false, {message: 'Incorrect credentials.'});
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, {message: 'Incorrect credentials.'});
            }
            return done(null, {...user}, {message: 'Logged In Successfully'}); // use spread syntax to create shallow copy to get rid of binary row type
        } catch (err) {
            return done(err);
        }
    }));

// TODO: JWT strategy for handling bearer token
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'dietrump'
    },
    async (jwtPayload, done) => {
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        console.log()
        try {
            const [user] = await userModel.getUser(jwtPayload.userID);
            if (user === undefined) {
                return done(null, false);
            }
            const plainUser = {...user};
            return done(null, plainUser);
        } catch (err) {
            return done(err);
        }
    },
));
module.exports = passport;