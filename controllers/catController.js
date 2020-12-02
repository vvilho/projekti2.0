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

const cat_get_haku = async (req, res) => {
    const omistaja = req.params.omistaja;
    console.log('req');
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
        console.log(e);
    }
    console.log('coords', coords);
    // Object desctructing
    const {kuvaus, id, owner} = req.body;
    const params = [kuvaus, req.file.filename, id, coords, owner];

    const cat = await catModel.addCat(params);

    res.json({message: 'upload ok'});

};

const cat_update_put = async (req, res) => {
    console.log('cat_update_put', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    //Object desctructing
    const {kuvaus, id} = req.body;
    const params = [kuvaus, id];

    const cat = await catModel.updateCat(params);


    res.json({message: 'modify ok'});

};

const cat_delete = async (req, res) => {
    const id = req.params.id;
    const cat = await catModel.deleteCat(id);
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
    cat_get_haku,
    cat_create_post,
    cat_update_put,
    cat_delete,
    make_thumbnail,
};