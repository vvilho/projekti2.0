'use strict';
// commentRoute
const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const commentController = require('../controllers/commentController');


router.get('/', commentController.comment_list_get);


router.get('/:name', commentController.comment_get_search);

router.get('/:like', commentController.comment_likes_get);



router.post('/', upload.single('comment'), [
    body('kommenttiText', 'vaadittu kenttä').isLength({min: 1}),
], commentController.comment_create_post);



router.put('/', [
    body('kommenttiText', 'tekstipakollinen').isLength({min: 1}),

], commentController.comment_update_put);


router.delete('/:id', commentController.comment_delete);


module.exports = router;

