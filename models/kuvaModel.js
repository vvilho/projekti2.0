// ./models/kuvaModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllKuvas = async () => {
    try {
        // TODO: do the LEFT (or INNER) JOIN to get owner name too.
        const [rows] = await promisePool.query('SELECT kuvaID, kuvaus, tiedostoNimi, kuva.userID, coords, user.nimi as ownername, Sijainti.Kunta as kunta FROM kuva inner join user on kuva.userID = user.userID inner join Sijainti on kuva.Kuntanumero = Sijainti.Kuntanumero');

        return rows;
    } catch (e) {
        console.log('kuvaModel error', e.message);
        return {error: 'DB Error'}
    }
};




const getKuva = async (id) => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM kuva WHERE kuvaID = ?', [id]);
        console.log('getKuva: rows', rows);
        return rows;

    } catch (e) {
        console.log('kuvaModel error', e.message);
        return {error: 'DB Error'}
    }
}

const tokencheck = async () => {
    return true;
}

const getKuvaHaku = async (omistaja) => {
    try {
        const [rows] = await promisePool.execute('SELECT kuvaID, kuvaus, tiedostoNimi, kuva.userID, coords, omistaja as ownername, Sijainti.Kunta as kunta FROM kuva inner join Sijainti on kuva.Kuntanumero = Sijainti.Kuntanumero WHERE omistaja = ?', [omistaja]);
        console.log('GetKuvaHaku: rows', rows);
        return rows;

    } catch (e) {
        console.log('kuvaModel error', e.message);
        return {error: 'DB Error'}
    }
}

const addKuva = async (params) => {
    try {
        const [rows] = await promisePool.execute('INSERT into kuva (kuvaus, tiedostoNimi, userID, coords, omistaja, Kuntanumero) VALUES (?,?,?,?,?,?)', params);
        console.log('addKuva: rows', rows);
        return rows;

    } catch (e) {
        console.log('kuvaModel error', e.message);
        return {error: 'DB Error'}
    }
}

const updateKuva = async (params) => {
    try {
        const [rows] = await promisePool.execute('UPDATE kuva SET kuvaus = ? WHERE kuvaID = ? AND userID = ?', params);
        console.log('updateKuva: rows', rows, params);
        return rows;

    } catch (e) {
        console.log('kuvaModel error', e.message);
        return {error: 'DB Error'}
    }
}


const deleteKuva = async (kuvaID, userID) => {
    try {
        const [rows] = await promisePool.execute('DELETE FROM kuva WHERE kuvaID = ? AND userID = ?', [kuvaID, userID]);
        console.log('deleteKuvas: rows', rows)
        return rows;

    } catch (e) {
        console.log('kuvaModel error', e.message);
        return {error: 'DB Error'}
    }
}

module.exports = {
    getAllKuvas,
    getKuva,
    tokencheck,
    addKuva,
    updateKuva,
    deleteKuva,
    getKuvaHaku,
};