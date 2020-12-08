// ./models/kuntaModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllkunta = async () => {
    try {

        const [rows] = await promisePool.query('SELECT * FROM Sijainti');

        console.log('kunnat rows', rows[1],rows[2],'...')

        return rows;
    } catch (e) {
        console.log('kuntaModel error', e.message);
        return {error: 'DB Error'}
    }
};





module.exports = {
    getAllkunta


};