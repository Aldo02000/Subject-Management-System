const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

// Set the views directory to 'views' and join it with the current directory (__dirname)
app.set('views', path.join(__dirname, 'views'));

// Set up middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }))


// Set up middleware to display flash messages
app.use(flash());

// Set up middleware to parse JSON request bodies
app.use(bodyParser.json());

// Set the static file directory to 'views' and join it with the current directory (__dirname)
app.use(express.static(path.join(__dirname, 'views')));

// Setting up a static file server for the entire project directory, for the moment commented out
//app.use(express.static(path.join(__dirname)));

// Set the view engine to handlebars (.hbs) and use the 'hbs' engine
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Set up session middleware with a secret key, 
app.use(session({
  secret: '123456',
  resave: false,
  saveUninitialized: true
}));

// Enable passport authentication and serialization
app.use(passport.initialize());
app.use(passport.session());

// Initialize passport authentication and attach routes
const { initPassport } = require('./passportConfig');
initPassport();

const routes = require('./routes/routes');
app.use('/', routes);

module.exports = app;