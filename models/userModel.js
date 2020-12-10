// ./models/userModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllUsers = async () => {
    try {
        // TODO: do the LEFT (or INNER) JOIN to get owner name too.
        const [rows] = await promisePool.query('SELECT user.userID, user.nimi, user.email FROM user');
        console.log('getAllUsers: rows', rows)
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
        console.log('getUser: rows', rows);
        console.log("Page updated");
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
        console.log('addUser: rows', rows);
        return true;

    } catch (e) {
        console.log('userModel error', e.message);
        return false;
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

const getUserCount = async () => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT COUNT(userID) AS maara FROM user');
            console.log('getUSerCount',rows);
        return rows;


    } catch (e) {
        console.log('userModel error', e.message);
        return {error: 'DB Error'}
    }
};

module.exports = {
    getAllUsers,
    getUser,
    addUser,
    getUserLogin,
    getUserCount
};