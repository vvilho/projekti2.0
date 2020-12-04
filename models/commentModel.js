// ./models/commentModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllComments = async () => {
    try {
        // TODO: do the LEFT (or INNER) JOIN to get owner name too.
        const [rows] = await promisePool.query('SELECT kommenttiID, kommenttiText, user.nimi as userID, kuva.kuvaID as kuvaID FROM kommentti inner join user on kommentti.userID = user.userID inner join kuva on kommentti.kuvaID = kuva.kuvaID');
        console.log('rows', rows);
        return rows;
    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
};



const getSpecificComments = async () => {
    try {
        const [rows] = await promisePool.query('SELECT kommenttiID, kommenttiText, user.nimi as userID, kuva.kuvaID as kuvaID FROM kommentti inner join user on kommentti.userID = user.userID inner join kuva on kommentti.kuvaID = kuva.kuvaID');
        console.log('rows', rows);
        return rows;
    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
};

const getComment = async (id) => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM komment WHERE kommentID = ?', [id]);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
}

const addComment = async (params) => {
    try {
        const [rows] = await promisePool.execute('INSERT INTO kommentti (kommenttiText, userID, kuvaID) VALUES (?,?,?)', params);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
}

const updateComment = async (params) => {
    try {
        const [rows] = await promisePool.execute('UPDATE kommentti SET kommenttiText = ? WHERE kommenttiID = ?', params);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
}


const deleteComment = async (id) => {
    try {
        const [rows] = await promisePool.execute('DELETE FROM kommentti WHERE kommenttiID = ?', [id]);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
}

module.exports = {
    getAllComments,
    getComment,
    addComment,
    updateComment,
    deleteComment,
    getSpecificComments,
};