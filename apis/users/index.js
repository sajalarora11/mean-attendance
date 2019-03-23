const express = require('express');
const route = express.Router();

route.post('/register', require('./user.controller').register);
route.post('/login', require('./user.controller').login);
route.post('/', require('./user.controller').getAll);
route.post('/:userId', require('./user.controller').getOne);
route.delete('/:userId', require('./user.controller').deleteOne);

module.exports = route;