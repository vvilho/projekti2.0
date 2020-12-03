// ./models/catModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllCats = async () => {
    try {
        // TODO: do the LEFT (or INNER) JOIN to get owner name too.
        const [rows] = await promisePool.query('SELECT kuvaID, kuvaus, tiedostoNimi, kuva.userID, coords, user.nimi as ownername FROM kuva inner join user on kuva.userID = user.userID');
        console.log('rows', rows)
        return rows;
    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
};



const getSpecificCats = async () => {
    try {
        const [rows] = await promisePool.query('SELECT kuvaID, kuvaus, tiedostoNimi, kuva.userID ,coords, user.nimi as ownername FROM kuva inner join user on kuva.userID = user.userID');
        console.log('rows', rows)
        return rows;
    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
};

const getCat = async (id) => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM kuva WHERE kuvaID = ?', [id]);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}

const getCatHaku = async (omistaja) => {
    try {
        const [rows] = await promisePool.execute('SELECT kuvaID, kuvaus, tiedostoNimi, kuva.userID, coords, omistaja as ownername FROM kuva WHERE omistaja = ?', [omistaja]);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}

const addCat = async (params) => {
    try {
        const [rows] = await promisePool.execute('INSERT into kuva (kuvaus, tiedostoNimi, userID, coords, omistaja) VALUES (?,?,?,?,?)', params);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}

const updateCat = async (params) => {
    try {
        const [rows] = await promisePool.execute('UPDATE kuva SET kuvaus = ? WHERE kuvaID = ?', params);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}


const deleteCat = async (id) => {
    try {
        const [rows] = await promisePool.execute('DELETE FROM kuva WHERE kuvaID = ?', [id]);
        console.log('rows', rows)
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}

module.exports = {
    getAllCats,
    getCat,
    addCat,
    updateCat,
    deleteCat,
    getSpecificCats,
    getCatHaku,
};