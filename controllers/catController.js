// catController
'use strict';

const {validationResult} = require('express-validator');
const catModel = require('../models/catModel');
const {makeThumbnail} = require('../utils/resize');
const {getCoordinates} = require('../utils/imageMeta');
const cats = catModel.cats;

const cat_list_get = async (req, res) => {

    const cats = await catModel.getAllCats();
    res.json(cats);
};

const tokencheck = async (req, res) => {

    const tokencheck = await catModel.tokencheck();
    res.json(tokencheck);
}

const cat_get_haku = async (req, res) => {
    const omistaja = req.params.omistaja;
    const cat = await catModel.getCatHaku(omistaja);
    res.json(cat);
};

const cat_get = async (req, res) => {
    const id = req.params.id;
    const cat = await catModel.getCat(id);
    res.json(cat);
};

const cat_create_post = async (req, res) => {
    console.log('cat_create_post', req.body, req.file);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    let coords = [];
    try {
         coords = await getCoordinates(req.file.path);
    } catch (e) {
        coords = [60,20];
        console.log(e);
    }
    console.log('coords', coords);
    // Object desctructing
    const {kuvaus, kunta} = req.body;
    const {userID, nimi} = req.user;
    const params = [kuvaus, req.file.filename, userID, coords, nimi, kunta];
    const cat = await catModel.addCat(params);

    res.json({message: 'upload ok'});

};

const cat_update_put = async (req, res) => {
    console.log('cat_update_put', req.body, req.user.userID);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    //Object desctructing
    const {kuvaus, kuvaID} = req.body;
    const userID = req.user.userID;
    const params = [kuvaus, kuvaID, userID];

    const cat = await catModel.updateCat(params);


    res.json({message: 'modify ok'});

};

const cat_delete = async (req, res) => {
    const kuvaID = req.params.id;
    const userID = req.user.userID;
    const cat = await catModel.deleteCat(kuvaID,userID);
    res.json(cat);
};

const make_thumbnail = async (req, res, next) => {
    // kutsu makeThumbnail
    try {
        const kuvake = await makeThumbnail(req.file.path, req.file.filename);
        console.log('kuvake', kuvake);
        if (kuvake) {
            next();
        }
    } catch (e) {
        res.status(400).json({errors: e.message});
    }
};


module.exports = {
    cat_list_get,
    cat_get,
    tokencheck,
    cat_get_haku,
    cat_create_post,
    cat_update_put,
    cat_delete,
    make_thumbnail,
};