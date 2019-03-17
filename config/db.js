const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pillowtalk',
    database: 'meanapp'
});

module.exports = connection;