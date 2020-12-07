'use strict';
// likeRoute
const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const likeController = require('../controllers/likeController');




router.post('/', likeController.like_create_post);

router.delete('/', likeController.like_delete);

router.get('/:kuvaID/:userID', likeController.like_get);

module.exports = router;
