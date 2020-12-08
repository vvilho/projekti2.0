// userController

'use strict';

const userModel = require('../models/userModel');

const users = userModel.users;

const user_list_get = async (req, res) => {
    const users = await userModel.getAllUsers();
    res.json(users);
};

const user_get = async (req, res) => {
    const id = req.params.id;
    const user = await userModel.getUser(id);
    res.json(user);
};

const user_count_get = async (req, res) => {
    console.log('user_count_get');
    const user = await userModel.getUserCount();
    res.json(user);
};




module.exports = {
    user_list_get,
    user_get,
    user_count_get
};