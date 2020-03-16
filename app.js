// Require express and path
const express = require('express');
const path = require('path');

// Require the routes index and books
const routes = require('./routes/index');
const books = require('./routes/books');

// Define the app

const app = express();

//Set port for environment and development

var port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Setup the use of JSON, URL Encoded and set the static path to public
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Setup the use routes 

app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  next(new Error(404));
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  console.log("error status: " + err.status);
  
  // Show the error page

  if (err.status === 500) 
  {
    res.render("error");   
  }
  else
  {
    res.redirect("/books/error"); 
  }

});

// Log out to the console the port the app is listening on
app.listen(port , () => {

  console.log("The express site application is running on localhost:", port);

});

module.exports = app;
