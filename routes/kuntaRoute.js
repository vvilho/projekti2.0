'use strict';
// kuntaRoute
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const kuntaController = require('../controllers/kuntaController');



router.get('/', kuntaController.kunta_list_get);



module.exports = router;

