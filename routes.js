module.exports = (app) => {
    app.use('/api', require('./apis/users'));

    // Error handler for all the bad requests...
    app.use((req, res, next) => {
        const error = new Error('Not Found');
        error.status = 404;
        next(error);
      });
  
      app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
          error: {
            message: error.message
          }
        });
      });
}