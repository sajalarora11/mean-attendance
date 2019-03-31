module.exports = (app) => {
    app.use('/api', require('./apis/users'));
    app.use('/*', (req, res, next) => {
      return res.status(200).json({
        message: "You are connected to the server..."
      })
    })
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