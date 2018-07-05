var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var http = require('http');
var async = require('async');
var moment = require('moment');
var cors = require('cors');
var multer = require('multer');
var upload = multer({ dest: './uploads/scripts' });
var needle = require('needle');
var querystring = require('querystring');



var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/NgApp', express.static(path.join(__dirname, '/NgApp')));
app.use('/images', express.static(path.join(__dirname, '/images')));



app.use('/', routes);

var httpServer = http.createServer(app);
var io = require('socket.io').listen(httpServer);
httpServer.listen(3000);

users=[];
connections=[];

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log("Total Connections %s", connections.length);

    socket.on('disconnect', function(){
        connections.splice(connections.indexOf(socket), 1);
    });

    socket.on('send message', function(data) {
        console.log(data);
        io.sockets.emit('new message', {msg: data});
    });

});

require("./config/config")(app);

require("./DBManager")(mysql);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;