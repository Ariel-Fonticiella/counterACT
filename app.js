const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const layouts = require('express-ejs-layouts');
const session = require("express-session");
const passport = require("passport"); 

// Load environment variables from the ".env" file
// (put this before the setup files since this defines env variables)
require("dotenv").config();

// run the code that sets up the Mongoose database connection
require("./config/mongoose-setup");

// run the code that sets up the Passport
require("./config/passport-setup");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = "counterACT";

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'this string is to avoid a deprecation warning'
  })
);
app.use(passport.initialize());
app.use(passport.session());

// define a custom middleware to define "currentUser" in all our views
app.use((req, res, next) => {
  // Passport defines "req.user" if the user is logged in
  // ("req.user" is the result of deserialize)
  res.locals.currentUser = req.user;

  // call "next()" to tell Express that we've finished
  // (otherwise your browser will hang)
  next();
});

// ROUTES-----------------------------------------------------------------------
const index = require('./routes/index');
app.use('/', index);

const myUserRouter = require("./routes/user-router");
app.use(myUserRouter);

const myDocumentsRouter = require("./routes/documents-router");
app.use(myDocumentsRouter);

const myJudgeRouter = require("./routes/judge-router");
app.use(myJudgeRouter);

const myReviewRouter = require("./routes/review-router");
app.use(myReviewRouter);

const myPrefRouter = require("./routes/preferences-router");
app.use(myPrefRouter);

const myProfileRouter = require("./routes/profile-router");
app.use(myProfileRouter);

// END ROUTES-------------------------------------------------------------------



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
