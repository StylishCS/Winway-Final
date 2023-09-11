var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('dotenv').config();
const passportSetup = require('./passport');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

var homeRouter = require('./routes/home');
const googleAuth = require('./routes/auth');
const signup = require('./routes/signup');
const verify = require('./routes/verifyOTP');
const facebookAuth = require('./routes/facebookAuth');
const login = require('./routes/login');
const resetPassword = require('./routes/forgotPassword');
const home = require('./routes/home');
var chat = require('./routes/chat');
var playCourse = require('./routes/playCourse');
const quizs = require('./routes/quiz')


var app = express();


const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Winway Express API with Swagger",
      version: "1.0.0",
      description:
        "This is a CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);



app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, 'public')));
app.use(express.static("upload"));

app.use('/', homeRouter);
app.use('/auth', googleAuth);
app.use('/signup', signup);
app.use('/verify', verify);
app.use('/facebook', facebookAuth);
app.use('/login', login);
app.use('/resetPassword', resetPassword);
app.use('/home', home);
app.use('/chat', chat);
app.use('/playCourse', playCourse);
app.use('/quizs',quizs)

//test2

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
