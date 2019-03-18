module.exports = (app) => {
    app.use('/user', require('./apis/users'));
}   