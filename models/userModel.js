// ./models/userModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllUsers = async () => {
    try {
        // TODO: do the LEFT (or INNER) JOIN to get owner name too.
        const [rows] = await promisePool.query('SELECT user.userID, user.nimi, user.email FROM user');
        console.log('rows', rows)
        return rows;
    } catch (e) {
        console.log('userModel error', e.message);
        return {error: 'DB Error'}
    }
};

const getUser = async (id) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT user.userID, user.nimi, user.email FROM user WHERE user.userID = ?', [id]);
        console.log('rows', rows);
        console.log("Page updated");
        return rows;


    } catch (e) {
        console.log('userModel error', e.message);
        return {error: 'DB Error'}
    }
};

const getUserCount = async () => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT COUNT(userID) FROM user');
        console.log('rows', rows);
        return rows;


    } catch (e) {
        console.log('userModel error', e.message);
        return {error: 'DB Error'}
    }
};


const addUser = async (params) => {
    try {
        const [rows] = await promisePool.execute(
            'INSERT into user (nimi, email, password) VALUES (?,?,?)', params);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('userModel error', e.message);
        return {error: 'DB Error'}
    }
};

const getUserLogin = async (params) => {
    try {
        console.log('getUserLogin', params);
        const [rows] = await promisePool.execute(
            'SELECT * FROM user WHERE email = ?;',
            params);
        return rows;
    } catch (e) {
        console.log('error', e.message);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    addUser,
    getUserLogin,
    getUserCount
};