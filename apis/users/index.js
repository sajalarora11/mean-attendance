const express = require('express');
const route = express.Router();

const verifyUser = require('./../auth/verifyUser.js');

route.post('/register', require('./user.controller').register);
route.post('/login', require('./user.controller').login);
route.post('/user/',verifyUser, require('./user.controller').getAll);
route.post('/user/:userId', require('./user.controller').getOne);
route.delete('/user/:userId', require('./user.controller').deleteOne);

module.exports = route;