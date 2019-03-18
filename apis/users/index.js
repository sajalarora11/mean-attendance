const express = require('express');
const route = express.Router();

route.post('/register', require('./user.controller').register);
route.post('/', require('./user.controller').getAll);

module.exports = route;