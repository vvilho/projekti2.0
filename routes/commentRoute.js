'use strict';
// commentRoute
const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const commentController = require('../controllers/commentController');




router.post('/',
    [
        body('kommentti', 'vaadittu kenttä').isLength({min: 1}),
        //body('kuvaID', 'arvo').isNumeric(),
        //body('userID', 'arvo').isNumeric()
    ],
    commentController.comment_create_post);

router.get('/:kuvaID', commentController.comment_get);

router.get('/maara/:kuvaID', commentController.comment_get_maara);



module.exports = router;

