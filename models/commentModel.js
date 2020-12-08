// ./models/commentModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();


const getcomment = async (kuvaID) => {
    try {
        const [rows] = await promisePool.execute('SELECT kommenttiText, user.nimi from kommentti inner join user on kommentti.userID = user.userID WHERE kuvaID = ?', [kuvaID]);
        console.log('getcomment: rows', rows);
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
};



const getcommentmaara = async (kuvaID) => {
    try {
        const [rows] = await promisePool.execute('SELECT COUNT(*) as maara from kommentti WHERE kuvaID = ?', [kuvaID]);
        console.log('getcommentmaara: rows', rows);
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
}



const addcomment = async (params) => {


    try {
        const [rows] = await promisePool.execute('INSERT into kommentti (kommenttiText, kuvaID, userID) VALUES (?,?,?)', params);
        console.log('addcomment: rows', rows);
        return rows;

    } catch (e) {
        console.log('commentModel error', e.message);
        return {error: 'DB Error'}
    }
}



module.exports = {
    getcomment,
    getcommentmaara,
    addcomment,


};