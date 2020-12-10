'use strict';
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const login = (req, res) => {
    // TODO: add passport authenticate
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user: user
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(user, 'dietrump');
            return res.json({user, token});
        });

    })(req, res);
};

const user_create_post = async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('user create error', errors);
        res.send(errors.array());
    } else {
        // TODO: bcrypt password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const params = [
            req.body.name,
            req.body.username,
            hash, // TODO: save hash instead of the actual password
        ];

        if (await userModel.addUser(params)) {
            res.json({message: '1'});

        } else {
            res.status(400).json({message: '0'});
        }
    }
};

const logout = (req, res) => {
    req.logout();
    res.json({message: 'logout'});
};

module.exports = {
    login,
    user_create_post,
    logout
};