// likeController
'use strict';

const {validationResult} = require('express-validator');
const likeModel = require('../models/likeModel');

const likes = likeModel.likes;

const like_list_get = async (req, res) => {
    const likes = await likeModel.getAlllikes();
    res.json(likes);
};


const like_get = async (req, res) => {
    console.log('like_get');


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }


    // Object desctructing
    const {kuvaID, userID} = req.params;
    const params = [kuvaID, userID];
    const like = await likeModel.getlike(params);

    res.json(like);
};

const like_get_most = async (req, res) => {
    
    const id = req.params.id;
    const like = await likeModel.getLike(id);
    res.json(like);
};


const like_create_post = async (req, res) => {
    console.log('like_create_post', req.body);
    console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Object desctructing
    const {kuvaID, userID} = req.body;
    const params = [kuvaID, userID];
    const like = await likeModel.addlike(params);

    res.json({message: 'like upload ok'});
};


const like_delete = async (req, res) => {
    console.log('like_delete', req.body);
    console.log(req.body);


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }


    // Object desctructing
    const {kuvaID, userID} = req.body;
    const params = [kuvaID, userID];
    const like = await likeModel.deletelike(params);

    res.json({message: 'like delete ok'});
};


module.exports = {
    like_list_get,
    like_get,
    like_create_post,
    like_delete,
    like_get_most
};