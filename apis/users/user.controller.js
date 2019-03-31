const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const User = require('../../models/user');
const ResetPass = require('../../models/resettoken');

exports.register = async (req, res, next) => {
    User(res); // Create user table everytime if not exisits...
    console.log(req.body);
    const insertUser = `insert into User (id, first_name, last_name, email, password, date_of_birth, gender, nationality, martial_status) values (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const insertPhone = `insert into PhoneBook (phone1, phone2, landline, userId) values (?, ?, ?, ?);`;
    const insertAddress = `insert into AddressBook (curr_address, per_address, city, zip_code, state, country, userId) values (?, ?, ?, ?, ?, ?, ?);`;
    const insertIDs = `insert into IDProofs (pan_no, aadhar_no, userId) values (?, ?, ?);`;
    const userCheck = 'select email from User where email = ?';
    const userId = 30000 + Math.floor(1000 + Math.random() * 9000);
    // Checks if the user exists...
    try {
        const user = await db.query(userCheck, [req.body.email]).catch(err => {
            console.log(err);
            return res.status(200).json({
                error: true,
                message: "Something went wrong"
            })
        })
        console.log("USer", user);
        if (user.length > 0) {
            return res.status(200).json({
                error: true,
                message: "User already exisits!"
            })
        }
        bcrypt.genSalt(10, async (err, salt) => {
            if (err) return res.status(200).json({
                error: true,
                message: "Can't create user"
            });
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        message: "Something went wrong"
                    });
                }
                if (hash) {
                    await db.query(insertUser, [userId, req.body.first_name, req.body.last_name, req.body.email, hash, req.body.date_of_birth, req.body.gender, req.body.nationality, req.body.martial_status]).catch(err => {
                        console.log(err);
                        return res.status(200).json({
                            err: true,
                            message: "Something went wrong"
                        });
                    })
                    await db.query(insertPhone, [req.body.phone1, req.body.phone2, req.body.landline, userId]).catch(err => {
                        console.log(err);
                        return res.status(200).json({
                            err: true,
                            message: "Something went wrong"
                        });
                    })
                    await db.query(insertAddress, [req.body.curr_address, req.body.per_address, req.body.city, req.body.zip_code, req.body.state, req.body.country, userId]).catch(err => {
                        console.log(err)
                        return res.status(200).json({
                            err: true,
                            message: "Something went wrong"
                        });
                    })
                    await db.query(insertIDs, [req.body.pan_no, req.body.aadhar_no, userId]).catch(err => {
                        console.log(err)
                        return res.status(200).json({
                            err: true,
                            message: "Something went wrong"
                        });
                    })
                }
                return res.status(201).json({
                    error: true,
                    message: "USer successfully created!"
                })
            });
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: true,
            message: "Some error occured"
        });
    }
}

exports.login = async (req, res, next) => {
    console.log("IN LOGIN");
    const email = req.body.email;
    const password = req.body.password;
    const user = await db.query('select * from User where email = ?', [email]).catch(err => {
        console.log(err);
        return res.status(200).json({
            error: true,
            message: "Seomthing went wrong1"
        })
    })
    console.log("USer", user[0]);
    if (user.length > 0) {
        const hash = user[0].password;
        console.log("HASH", hash);
        bcrypt.compare(password, hash, async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(409).json({
                    error: true,
                    message: "Invalid email or password"
                })
            }
            if (result) {
                const token = jwt.sign({
                    userId: user[0].id,
                    email: user[0].email,
                    first_name: user[0].first_name
                }, process.env.SECRET_KEY,
                {
                    expiresIn: '12h'
                });
                console.log("TOKEN", token);
                return res.status(200).json({
                    error: false,
                    message: "Logged in successfully!",
                    token: token
                })
            } else {
                console.log(err);
                return res.status(409).json({
                    error: true,
                    message: "Invalid email or password"
                })
            }
        })
    } else {
        return res.status(409).json({
            error: true,
            message: "Invalid email or password"
        })
    }
}

exports.getAll = async (req, res, next) => {
    const fetchQuery = `select * from User inner join PhoneBook on User.id = PhoneBook.userId inner join AddressBook on User.id = AddressBook.userId inner join IDProofs on User.id = IDProofs.userId;`;
    const data = await db.query(fetchQuery, []).catch(err => {
        console.log("ERR", err);
        return res.status(200).json({
            err: true,
            message: "Couldn't fetch users."
        });
    })
    if (data.length > 0) {
        return res.status(200).json({
            error: false,
            data: data
        });
    } else {
        return res.status(200).json({
            err: true,
            message: "no users found."
        });
    }
}

exports.getOne = (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId);
    User(res); // Create user table everytime if not exisits...

    const qry = 'select s from User inner join PhoneBook on User.id = PhoneBook.userId inner join AddressBook on User.id = AddressBook.userId inner join IDProofs on User.id = IDProofs.userId where User.id = ?;';
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
    const token = crypto.randomBytes(64).toString('hex');

    // Confirm the email address
    db.query(
        'select email from User where email = ?',
        (err, rows, fields) => {
            if (err) throw err;
            if (rows[0].email) {

            }
        }
    )
}