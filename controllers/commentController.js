// commentController
'use strict';

const {validationResult} = require('express-validator');
const commentModel = require('../models/commentModel');

const comments = commentModel.comments;

const comment_list_get = async (req, res) => {
    const comments = await commentModel.getAllcomments();
    res.json(comments);
};


const comment_get = async (req, res) => {
    const kuvaID = req.params.kuvaID;
    const comment = await commentModel.getcomment(kuvaID);
    res.json(comment);
};

const comment_create_post = async (req, res) => {
    console.log('comment_create_post', req.body);
    console.log(req.body);


    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }


    // Object desctructing
    const {kommentti, kuvaID, userID} = req.body;
    const params = [kommentti, kuvaID, userID];
    const comment = await commentModel.addcomment(params);

    res.json({message: 'comment upload ok'});

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

    const comment = await commentModel.updatecomment(params);


    res.json({message: 'modify ok'});

};

const comment_delete = async (req, res) => {
    const id = req.params.id;
    const comment = await commentModel.deletecomment(id);
    res.json(comment);
};


module.exports = {
    comment_list_get,
    comment_get,
    comment_create_post,
    comment_update_put,
    comment_delete,
};