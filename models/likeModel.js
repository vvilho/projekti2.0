// ./models/likeModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAlllikes = async (params) => {
    try {
        const [rows] = await promisePool.execute('SELECT COUNT(likeID) as likecount from tykkaa WHERE kuvaID = ?', params);
        //console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('likeModel getlike error', e.message);
        return {error: 'DB Error'}
    }
};


const getSpecificlikes = async () => {
    try {
        const [rows] = await promisePool.query('SELECT kuvaID, kuvaus, tiedostoNimi, kuva.userID ,coords, user.nimi as ownername FROM kuva inner join user on kuva.userID = user.userID');
        //console.log('rows', rows)
        return rows;
    } catch (e) {
        console.log('likeModel error', e.message);
        return {error: 'DB Error'}
    }
};

const getlike = async (params) => {
    try {
        const [rows] = await promisePool.execute('SELECT kuvaID, userID from tykkaa WHERE kuvaID = ? AND userID = ?', params);
        //console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('likeModel getlike error', e.message);
        return {error: 'DB Error'}
    }
}

const getMostlike = async () => {
    try {
        const [rows] = await promisePool.execute('SELECT userID, COUNT(*) AS Frequency FROM kommentti GROUP BY userID ORDER BY COUNT(*) DESC LIMIT 1;');
        //console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('likeModel getMostlike error', e.message);
        return {error: 'DB Error'}
    }
}



const addlike = async (params) => {

    console.log('likeModel');
    try {
        const [rows] = await promisePool.execute('INSERT into tykkaa (kuvaID, userID) VALUES (?,?)', params);
        //console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('likeModel addlike error', e.message);
        return {error: 'DB Error'}
    }
}




const deletelike = async (params) => {
    //console.log('likeModel');



    try {
        const [rows] = await promisePool.execute('DELETE from tykkaa WHERE kuvaID = ? AND userID = ?', params);
        //console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('likeModel error', e.message);
        return {error: 'DB Error'}
    }
}

module.exports = {
    getAlllikes,
    getlike,
    addlike,
    deletelike,
    getSpecificlikes,
    getMostlike
};