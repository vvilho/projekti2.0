// ./models/catModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllCats = async () => {
    try {
        // TODO: do the LEFT (or INNER) JOIN to get owner name too.
        const [rows] = await promisePool.query('SELECT kuvaID, kuvaus, tiedostoNimi, kuva.userID, coords, user.nimi as ownername, Sijainti.Kunta as kunta FROM kuva inner join user on kuva.userID = user.userID inner join Sijainti on kuva.Kuntanumero = Sijainti.Kuntanumero');

        return rows;
    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
};




const getCat = async (id) => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM kuva WHERE kuvaID = ?', [id]);
        console.log('getCat: rows', rows);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}

const tokencheck = async () => {
    return true;
}

const getCatHaku = async (omistaja) => {
    try {
        const [rows] = await promisePool.execute('SELECT kuvaID, kuvaus, tiedostoNimi, kuva.userID, coords, omistaja as ownername, Sijainti.Kunta as kunta FROM kuva inner join Sijainti on kuva.Kuntanumero = Sijainti.Kuntanumero WHERE omistaja = ?', [omistaja]);
        console.log('GetCatHaku: rows', rows);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}

const addCat = async (params) => {
    try {
        const [rows] = await promisePool.execute('INSERT into kuva (kuvaus, tiedostoNimi, userID, coords, omistaja, Kuntanumero) VALUES (?,?,?,?,?,?)', params);
        console.log('addCat: rows', rows);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}

const updateCat = async (params) => {
    try {
        const [rows] = await promisePool.execute('UPDATE kuva SET kuvaus = ? WHERE kuvaID = ? AND userID = ?', params);
        console.log('updateCat: rows', rows, params);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}


const deleteCat = async (kuvaID, userID) => {
    try {
        const [rows] = await promisePool.execute('DELETE FROM kuva WHERE kuvaID = ? AND userID = ?', [kuvaID, userID]);
        console.log('deleteCats: rows', rows)
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}

module.exports = {
    getAllCats,
    getCat,
    tokencheck,
    addCat,
    updateCat,
    deleteCat,
    getCatHaku,
};