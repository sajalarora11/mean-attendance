module.exports = (app) => {
    app.use('/register', require('./apis/users'));
}   