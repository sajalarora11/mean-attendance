'use strict';
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./db');

module.exports = (app) => {

    // setting up database connectionn
    db.connect().then(data => {
        console.log("Connected to server...");
    }).catch(err => {
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Unable to connect!"
        })
    })


    // setting up express middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(morgan('dev'));

    // Handling CORS
    // Getting rid of CORS issues...
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        if (req.method === 'OPTIONS') {
            res.header("Access-Control-Allow-Methods", 'PUT, POST, GET, PATCH, DELETE');
            res.status(200).json({});
        }
        next(); // To avoid blockage for other routes...
    });


    // Routes 
    require('../routes')(app);

    app.listen(8080, () => {
        console.log('listening to 5k');
    })
}