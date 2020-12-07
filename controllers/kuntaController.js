// kuntaController

'use strict';

const kuntaModel = require('../models/kuntaModel');

const kuntas = kuntaModel.kuntas;

const kunta_list_get = async (req, res) => {
    const kunnat = await kuntaModel.getAllkunta();
    res.json(kunnat);
};

const kunta_get = async (req, res) => {
    const id = req.params.id;
    const kunta = await kuntaModel.getkunta(id);
    res.json(kunta);
};




module.exports = {
    kunta_list_get,
    kunta_get,

};