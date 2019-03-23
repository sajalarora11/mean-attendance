const mysql = require('mysql2');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pillowtalk',
    database: 'meanapp'
});

module.exports = connection;