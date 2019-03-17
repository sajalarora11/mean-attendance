const express = require('express');
const route = express.Router();

route.post('/', require('./user.controller').register);

module.exports = route;