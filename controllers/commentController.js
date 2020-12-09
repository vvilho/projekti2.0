// commentController
'use strict';

const {validationResult} = require('express-validator');
const commentModel = require('../models/commentModel');

const comments = commentModel.comments;




const comment_get = async (req, res) => {
    const kuvaID = req.params.kuvaID;
    const comment = await commentModel.getcomment(kuvaID);
    res.json(comment);
};

const comment_get_maara = async (req, res) => {
    const kuvaID = req.params.kuvaID;
    const comment = await commentModel.getcommentmaara(kuvaID);
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
    const {kommentti, kuvaID} = req.body;
    const userID = req.user.userID;
    const params = [kommentti, kuvaID, userID];
    const comment = await commentModel.addcomment(params);

    res.json({message: 'comment upload ok'});

};






module.exports = {
    comment_get,
    comment_get_maara,
    comment_create_post,
};