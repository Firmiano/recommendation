'use strict';

var express = require('express'),
    load = require('express-load'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    app = express();

require('./config/initConfigNeo4j.js');

app.disable('x-powered-by');
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.use(expressSession({
    secret: "recommendations",
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

load('model')
    .then('validation')
    .then('repository')
    .then('services')
    .then('controllers')
    .then('routes')
    .into(app);

console.log(process.env.PORT);

app.listen(process.env.PORT || 4000, function() {
    console.log("API recommendation");
});