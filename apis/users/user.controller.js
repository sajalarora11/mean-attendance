const db = require('../../config/db');
const User = require('../../models/user');


exports.register = (req, res, next) => {
    User(db); // Create user table everytime if not exisits...
    console.log(req.body);

    const insertUser = `insert into User (first_name, last_name, email, password, date_of_birth, gender, nationality, martial_status) values (?, ?, ?, ?, ?, ?, ?, ?);`;
    const insertPhone =  `insert into PhoneBook (phone1, phone2, landline, userId) values (?, ?, ?, ?);`;
    const insertAddress = `insert into AddressBook (curr_address, per_address, city, zip_code, state, country, userId) values (?, ?, ?, ?, ?, ?, ?);`;
    const insertIDs = `insert into IDProofs (pan_no, aadhar_no, userId) values (?, ?, ?);`;

    db.query(insertUser, [req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.date_of_birth, req.body.gender, req.body.nationality, req.body.martial_status], (err, rows, fields) => {
        if (err) throw err;
        console.log("Inserted user", rows);
        db.query(insertPhone, [req.body.phone1, req.body.phone2, req.body.landline, 1], (err, rows) => {
            if (err) throw err;
            console.log("rows", rows);
            console.log("CITY", req.body.city);
            db.query(insertAddress, [req.body.curr_address, req.body.per_address, req.body.city, req.body.zip_code, req.body.state, req.body.country, 1], (err, rows) => {
                if (err) throw err;
                console.log("Inserted Address", rows);
                db.query(insertIDs, [req.body.pan_no, req.body.aadhar_no, 1], (err, rows) => {
                    if (err) throw err;
                    console.log("inseeted ids", rows);
                })
            })
        })
    });
}