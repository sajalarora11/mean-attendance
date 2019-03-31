const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.connection.connect(err => {
                if (err) reject(err);
                else resolve("Connected to Database");
            })
        })
    }

    query(q, data) {
        return new Promise((resolve, reject) => {
            this.connection.query(q, data, (err, rows, fields) => {
                if (err) reject(err);
                else resolve(rows, fields);
            })
        })
    }
}

console.log(process.env.DB_HOST);
const db = new Database({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


module.exports = db;