// commentController
'use strict';

const {validationResult} = require('express-validator');
const commentModel = require('../models/commentModel');
const {makeThumbnail} = require('../utils/resize');
const {getCoordinates} = require('../utils/imageMeta');
const comments = commentModel.comments;

const comment_list_get = async (req, res) => {
    const comments = await commentModel.getAllComments();
    res.json(comments);
};


const comment_get = async (req, res) => {
    const id = req.params.id;
    const comment = await commentModel.getComment(id);
    res.json(comment);
};
const comment_get_search = async (req, res) => {
    const id = req.params.id;
    const comment = await commentModel.getCommentSearch(id);
    res.json(comment);
};


const comment_create_post = async (req, res) => {
    console.log('comment_create_post', req.body, req.file);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    let coords = [];
    try {
         coords = await getCoordinates(req.file.path);
    } catch (e) {
        console.log(e);
    }
    console.log('coords', coords);
    // Object desctructing
    const {kuvaus, id, owner} = req.body;
    const params = [kuvaus, req.file.filename, id, coords, owner];

    const comment = await commentModel.addComment(params);

    res.json({message: 'upload ok'});

};

const comment_update_put = async (req, res) => {
    console.log('comment_update_put', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    //Object desctructing
    const {kuvaus, id} = req.body;
    const params = [kuvaus, id];

    const comment = await commentModel.updateComment(params);


    res.json({message: 'modify ok'});

};

const comment_delete = async (req, res) => {
    const id = req.params.id;
    const comment = await commentModel.deleteComment(id);
    res.json(comment);
};


module.exports = {
    comment_list_get,
    comment_get,
    comment_create_post,
    comment_update_put,
    comment_delete,
    comment_get_search,
};