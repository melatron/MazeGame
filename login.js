/**
 * Created by Antony on 1/18/2015.
 */
var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    Mongoose = require('mongoose'),
    passport = require('passport'),
    PassportLocalStrategy = require('passport-local'),
    validator = require('validator'),
    Hash = require('password-hash'),
    Schema = Mongoose.Schema,
    serverClients = {};

Mongoose.connect('mongodb://localhost/27017');

var authStrategy;
var User;
var UserSchema;
var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
    UserSchema = Mongoose.Schema({
        email: { type: String },
        password: { type: String, set: function(newValue) {
            return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
        } },
        nick: {type: String},
        drawings: []
        // ... add any other properties you want to save with users ...
    });

    UserSchema.statics.authenticate = function(email, password, callback) {
        this.findOne({ email: email }, function(error, user) {
            if (user && Hash.verify(password, user.password)) {
                callback(null, user);
            } else if (user || !error) {
                // Email or password was invalid (no MongoDB error)
                error = new Error("Your email address or password is invalid. Please try again.");
                callback(error, null);
            } else {
                // Something bad happened with MongoDB. You shouldn't run into this often.
                callback(error, null);
            }
        });
    };

    User = Mongoose.model('User', UserSchema);

    authStrategy = new PassportLocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        User.authenticate(email, password, function (error, user) {
            // You can write any kind of message you'd like.
            // The message will be displayed on the next page the user visits.
            // We're currently not displaying any success message for logging in.
            done(error, user, error ? {message: error.message} : null);
        });
    });

    var authSerializer = function(user, done) {
        done(null, user.id);
    };

    var authDeserializer = function(id, done) {
        User.findById(id, function(error, user) {
            done(error, user);
        });
    };

    passport.use(authStrategy);
    passport.serializeUser(authSerializer);
    passport.deserializeUser(authDeserializer);
});

//configure express paths to load resources when making a GET request
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(passport.initialize());
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));

app.post('/login', passport.authenticate('local', {
    successRedirect: '/game',
    failureRedirect: '/'
}));

app.post('/register', function(req, res){
    var body = req.body,
        hashedPass = Hash.generate(body.password),
        email = body.email,
        valideEmail = validator.isEmail(email.toString()) && validator.isLength(email.toString(), 6, 64),
        validePass = validator.isLength(body.password.toString(), 6, 64),
        userExists = false,
        message = '';

    if(valideEmail && validePass){
        //TODO: Write code for creating user here:

        User.findOne({ email: email }, function(error, user) {
            if(error){
                message = 'Error while searching for user with email: ' + email;
                console.log(message);
                return;
            } else if(user){
                message = 'User with email: ' + email + ' was found!';
                console.log(message);
                return;
            } else {
                message = 'User with email: ' + email + ' was not found!';
                console.log(message);
                var user = new User({
                    email: email,
                    password: hashedPass
                });
                user.save(function (err) {
                    var message;
                    if (err){
                        message = 'Error while registering user to data base!';
                        console.log(message);
                        return;
                    }
                    message = 'Registered!';
                    console.log(message);
                });
            }
        });
        res.status('200').send(message);
    } else if(valideEmail) {
        message = 'Password is not long enough, or too long. It must be between 6 and 64 symbols!';
        console.log(message);
        res.status('200').send(message);
    } else if(validePass) {
        message = 'Email is not correct!';
        console.log(message);
        res.status('200').send(message);
    } else {
        message = 'Both email and pass are not correct!';
        console.log(message);
        res.status('200').send(message);
    }
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.get('/game', function (req, res) {
    res.sendfile(__dirname + '/public/game.html');
});

server.listen(1337);
