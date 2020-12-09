// kuvaController
'use strict';

const {validationResult} = require('express-validator');
const kuvaModel = require('../models/kuvaModel');
const {makeThumbnail} = require('../utils/resize');
const {getCoordinates} = require('../utils/imageMeta');
const kuvat = kuvaModel.kuvas;

const kuva_list_get = async (req, res) => {

    const kuvas = await kuvaModel.getAllKuvas();
    res.json(kuvas);
};

const tokencheck = async (req, res) => {

    const tokencheck = await kuvaModel.tokencheck();
    res.json(tokencheck);
}

const kuva_get_haku = async (req, res) => {
    const omistaja = req.params.omistaja;
    const kuva = await kuvaModel.getKuvaHaku(omistaja);
    res.json(kuva);
};

const kuva_get = async (req, res) => {
    const id = req.params.id;
    const kuva = await kuvaModel.getKuva(id);
    res.json(kuva);
};

const kuva_create_post = async (req, res) => {
    console.log('kuva_create_post', req.body, req.file);

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
    const kuva = await kuvaModel.addKuva(params);

    res.json({message: 'upload ok'});

};

const kuva_update_put = async (req, res) => {
    console.log('kuva_update_put', req.body, req.user.userID);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    //Object desctructing
    const {kuvaus, kuvaID} = req.body;
    const userID = req.user.userID;
    const params = [kuvaus, kuvaID, userID];

    const kuva = await kuvaModel.updateKuva(params);


    res.json({message: 'modify ok'});

};

const kuva_delete = async (req, res) => {
    const kuvaID = req.params.id;
    const userID = req.user.userID;
    const kuva = await kuvaModel.deleteKuva(kuvaID,userID);
    res.json(kuva);
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
    kuva_list_get,
    kuva_get,
    tokencheck,
    kuva_get_haku,
    kuva_create_post,
    kuva_update_put,
    kuva_delete,
    make_thumbnail,
};