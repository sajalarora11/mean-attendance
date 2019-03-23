const db = require('../config/db');

module.exports = () => {
    const userSchema = `CREATE TABLE IF NOT EXISTS User (
        id INT NOT NULL,
        first_name TEXT  NOT NULL,
        last_name TEXT NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        date_of_birth DATE NOT NULL,
        gender TEXT NOT NULL,
        nationality TEXT NOT NULL,
        martial_status TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
        );`;

    const phoneSchema = `CREATE TABLE IF NOT EXISTS PhoneBook (
        id INT AUTO_INCREMENT,
        phone1 VARCHAR(20) NOT NULL UNIQUE,
        phone2 VARCHAR(20) NOT NULL UNIQUE,
        landline TEXT,
        userId INT,
        PRIMARY KEY(id),
        FOREIGN KEY(userId) REFERENCES User(id)
    );`;

    const addressSchema = ` CREATE TABLE iF NOT EXISTS AddressBook (
        id INT AUTO_INCREMENT,
        curr_address VARCHAR(100) NOT NULL,
        per_address VARCHAR(100) NOT NULL,
        city TEXT NOT NULL,
        zip_code INT NOT NULL,
        state TEXT NOT NULL,
        country TEXT NOT NULL,
        userId INT,
        PRIMARY KEY(id),
        FOREIGN KEY(userId) REFERENCES User(id)
    );`;

    const idProofSchema = `CREATE TABLE IF NOT EXISTS IDProofs (
        id INT AUTO_INCREMENT,
        pan_no VARCHAR(20) NOT NULL UNIQUE,
        aadhar_no VARCHAR(20) NOT NULL UNIQUE,
        userId INT,
        PRIMARY KEY(id),
        FOREIGN KEY(userId) REFERENCES User(id)
    )`;

    const resetToken = `CREATE TABLE IF NOT EXISTS ResetToken (
        id INT AUTO_INCREMENT,
        token VARCHAR(70) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        userId INT,
        PRIMARY KEY(id),
        FOREIGN KEY(userId) REFERENCES User(id)
    );`

    db.query(userSchema, (err, rows) => {
        if (err) throw err;
        console.log("Created user table");
        db.query(phoneSchema, (err, rows) =>  {
            if (err) throw err;
            console.log("Created Phonebook table");
            db.query(addressSchema, (err, rows) => {
                if (err) throw err;
                console.log('Addressbook table created');
                db.query(idProofSchema, (err, rows) => {
                    if (err) throw err;
                    console.log('ID proof table created');
                })
            })
        })
    });
}

