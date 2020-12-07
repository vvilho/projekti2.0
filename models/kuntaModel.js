// ./models/kuntaModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllkunta = async () => {
    try {

        const [rows] = await promisePool.query('SELECT * FROM Sijainti');
        console.log('rows', rows)
        return rows;
    } catch (e) {
        console.log('kuntaModel error', e.message);
        return {error: 'DB Error'}
    }
};





module.exports = {
    getAllkunta


};