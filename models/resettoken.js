const db = require('../config/db');

module.exports = async () => {
    const resetTokenSchema = `CREATE TABLE IF NOT EXISTS ResetToken (
        id INT AUTO_INCREMENT,
        token VARCHAR(70) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        userId INT,
        PRIMARY KEY(id),
        FOREIGN KEY(userId) REFERENCES User(id)
    );`

    const {err, result} = await db.query(resetTokenSchema, []);
    if (err) {
        console.log(err);
    }
}