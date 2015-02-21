/**
 * Created by Antony on 1/18/2015.
 */
// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 1337;
var mongoose = require('mongoose');
var passport = require('passport');

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var passportSocketIo = require("passport.socketio");

var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var secret = 'ilovescotchscotchyscotchscotch';


var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database


(function () {
    'use strict';
    // set up our express application
    app.use(morgan('combined'));
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({
     // to support URL-encoded bodies
        extended: true
    }));
    
    app.set('view engine', 'ejs'); // set up ejs for templating
    
    // required for passport
    //app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
    app.use(session({
        secret: secret,
        saveUninitialized: false, // don't create session until something stored
        resave: false, //don't save session if unmodified
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    }));
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session
    
    // routes ======================================================================
    require('./config/passport')(passport); // pass passport for configuration
    require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
    require('./config/passport.socketio')({
        io: io,
        passportSocketIo: passportSocketIo,
        sessionStode: MongoStore,
        secret: secret,
        cookieParser: cookieParser
    });
    // launch ======================================================================
    app.listen(port);
    console.log('The magic happens on port ' + port);
})();