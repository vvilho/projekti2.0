'use strict';
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/register',
    [
        body('name', 'minimum 3 characters').isLength({min: 3, max: 30}),
        body('username', 'email is not valid').isEmail().isLength({max: 50}),
        body('password', 'at least one upper case letter').matches('(?=.*[A-Z]).{8,}').isLength({max: 50}),
    ],
    authController.user_create_post

);

module.exports = router;