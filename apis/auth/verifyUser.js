const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userData = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(409).json({
            error: true,
            message: "Authentication failed"
        })
    }
}