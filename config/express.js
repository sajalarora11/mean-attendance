'use strict';
const morgan = require('morgan');
const bodyParser = require('body-parser');

const db = require('./db');

module.exports = (app) => {

    // setting up database connectionn
    db.connect(err => {
        if (err) throw err;
        console.log('Connected to database');
    })

    // setting up express middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(morgan('dev'));

    // Routes 
    require('../routes')(app);

    app.listen(3000, () => {
        console.log('listening to 5k');
    })
}