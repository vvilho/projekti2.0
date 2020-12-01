// ./models/catModel.js
'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllCats = async () => {
    try {
        // TODO: do the LEFT (or INNER) JOIN to get owner name too.
        const [rows] = await promisePool.query('SELECT cat_id, wop_cat.name, age, weight, filename, coords, wop_user.name as ownername FROM wop_cat inner join wop_user on wop_cat.owner = wop_user.user_id');
        console.log('rows', rows)
        return rows;
    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
};


const getSpecificCats = async (weight) => {
    try {
        const [rows] = await promisePool.query('SELECT cat_id, wop_cat.name, age, weight, filename, coords, wop_user.name as ownername FROM wop_cat inner join wop_user on wop_cat.owner = wop_user.user_id where wop_cat.weight = ?', weight);
        console.log('rows', rows)
        return rows;
    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
};

const getCat = async (id) => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM wop_cat WHERE cat_id = ?', [id]);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}

const addCat = async (params) => {
    try {
        const [rows] = await promisePool.execute('INSERT into wop_cat (name, age, weight, owner, filename, coords) VALUES (?,?,?,?,?,?)', params);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}

const updateCat = async (params) => {
    try {
        const [rows] = await promisePool.execute('UPDATE wop_cat SET name = ?, age = ?, weight = ?, owner = ? WHERE cat_id = ?', params);
        console.log('rows', rows);
        return rows;

    } catch (e) {
        console.log('catModel error', e.message);
        return {error: 'DB Error'}
    }
}


const deleteCat = async (id, userid) => {
    try {
        const [rows] = await promisePool.execute('DELETE FROM wop_cat WHERE cat_id = ? AND ownerid=?', [id, userid]);
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
    getSpecificCats
};