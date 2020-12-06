// ./models/commentModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllcomments = async () => {
    try {
        // TODO: do the LEFT (or INNER) JOIN to get owner name too.
        const [rows] = await promisePool.query('SELECT kuvaID, kuvaus, tiedostoNimi, kuva.userID, coords, user.nimi as ownername FROM kuva inner join user on kuva.userID = user.userID');
        console.log('rows', rows)
        return rows;
    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
};


const getSpecificcomments = async () => {
    try {
        const [rows] = await promisePool.query('SELECT kuvaID, kuvaus, tiedostoNimi, kuva.userID ,coords, user.nimi as ownername FROM kuva inner join user on kuva.userID = user.userID');
        console.log('rows', rows)
        return rows;
    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
};

const getcomment = async (kuvaID) => {
    try {
        const [rows] = await promisePool.execute('SELECT kommenttiText, user.nimi from kommentti inner join user on kommentti.userID = user.userID WHERE kuvaID = ?', [kuvaID]);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
}



const addcomment = async (params) => {
    console.log('rikkikö?');
    console.log(params[0],params[1],params[2]);



    try {
        const [rows] = await promisePool.execute('INSERT into kommentti (kommenttiText, kuvaID, userID) VALUES (?,?,?)', params);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
}

const updatecomment = async (params) => {
    try {
        const [rows] = await promisePool.execute('UPDATE kuva SET kuvaus = ? WHERE kuvaID = ?', params);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
}


const deletecomment = async (id) => {
    try {
        const [rows] = await promisePool.execute('DELETE FROM kuva WHERE kuvaID = ?', [id]);
        console.log('rows', rows)
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
}

module.exports = {
    getAllcomments,
    getcomment,
    addcomment,
    updatecomment,
    deletecomment,
    getSpecificcomments,

};