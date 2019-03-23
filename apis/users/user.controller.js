const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const db = require('../../config/db');
const User = require('../../models/user');
const ResetPass = require('../../models/resettoken');


exports.register = (req, res, next) => {
    User(db); // Create user table everytime if not exisits...
    console.log(req.body);

    const insertUser = `insert into User (id, first_name, last_name, email, password, date_of_birth, gender, nationality, martial_status) values (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const insertPhone = `insert into PhoneBook (phone1, phone2, landline, userId) values (?, ?, ?, ?);`;
    const insertAddress = `insert into AddressBook (curr_address, per_address, city, zip_code, state, country, userId) values (?, ?, ?, ?, ?, ?, ?);`;
    const insertIDs = `insert into IDProofs (pan_no, aadhar_no, userId) values (?, ?, ?);`;
    const userId = 30000 + Math.floor(1000 + Math.random() * 9000);
    bcrypt.genSalt(10 , (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            if (hash) {
                db.query(insertUser, [userId, req.body.first_name, req.body.last_name, req.body.email, hash, req.body.date_of_birth, req.body.gender, req.body.nationality, req.body.martial_status], (err, rows, fields) => {
                    if (err) throw err;
                    console.log("Inserted user", rows);
                    db.query(insertPhone, [req.body.phone1, req.body.phone2, req.body.landline, userId], (err, rows) => {
                        if (err) throw err;
                        console.log("rows", rows);
                        console.log("CITY", req.body.city);
                        db.query(insertAddress, [req.body.curr_address, req.body.per_address, req.body.city, req.body.zip_code, req.body.state, req.body.country, userId], (err, rows) => {
                            if (err) throw err;
                            console.log("Inserted Address", rows);
                            db.query(insertIDs, [req.body.pan_no, req.body.aadhar_no, userId], (err, rows) => {
                                if (err) throw err;
                                console.log("inseeted ids", rows);
                                const token = crypto.randomBytes(64).toString('hex');
                            })
                        })
                    })
                });
            }
        })
    })

}

exports.login = (req, res, next) => {
    console.log("IN LOGIN");
    const email = req.body.email;
    const password = req.body.password;
    db.query('select * from User where email = ?', [email], (err, rows, fields) => {
        if (err) throw err;
        if (rows.length >= 1) {
            const hash = rows[0].password;
            console.log("HASH", hash);
            bcrypt.compare(password, hash, (err, result) => {
                if (err) {
                    console.log("Invalid email or password");
                }
                if (result) {
                    console.log("Login successfull");
                } else {
                    console.log("email or password doesn't match");
                }
            })
        }
    })
}

exports.getAll = (req, res, next) => {
    const fetchQuery = `select * from User inner join PhoneBook on User.id = PhoneBook.userId inner join AddressBook on User.id = AddressBook.userId inner join IDProofs on User.id = IDProofs.userId;`;
    db.query(fetchQuery, (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        console.log(fields);
    })
}

exports.getOne = (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId);
    const qry = 'select * from User inner join PhoneBook on User.id = PhoneBook.userId inner join AddressBook on User.id = AddressBook.userId inner join IDProofs on User.id = IDProofs.userId where User.id = ?;';
    db.query(qry, [userId], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        //console.log(fields);
    })
}

exports.deleteOne = (req, res, next) => {
    const userId = req.params.userId;
    const delQuery = 'delete from User where id = ?';
    db.query(delQuery, [userId], (err, rows) => {
        if (err) throw err;
        console.log("Deleted successfully", rows);
    })
}

exports.resetPass = (req, res, next) => {
    const email = req.body.email;
    ResetPass();

    // Confirm the email address
    db.query(
        'select email from User where email = ?',
        (err, rows, fields) => {
            if(err) throw err;
            if (rows[0].email) {
                
            }
        }
    )
}