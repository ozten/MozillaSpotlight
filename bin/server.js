var http = require('http');
var path = require('path');
var qs = require('qs');

var nunjucks = require('nunjucks');
var uuid = require('node-uuid');
var Sessions = require("sessions");
var verify = require('browser-id-verify');

var config = require('../config');
var dbServer = require('../lib/db_server');

nunjucks.configure(path.join(__dirname, '../views'));

var sessionHandler = new Sessions(null, {
    expires: 5000
});

// In memory session database with email as the key
var sessions = {};

var server = http.createServer(function(req, res) {
    sessionHandler.httpRequest(req, res, function(err, sess) {
        req.session = sess;
        var sessVals = sess.get();
        if (!sessVals.guid) {
            sess.set('guid', uuid.v4(), function(err) {
                dispatch(req, res);
            });
        } else {
            dispatch(req, res);
        }
    });
});

function dispatch(req, res) {
    var sessValues = req.session.get();

    var curUser = sessions['' + sessValues.guid];
    console.log(curUser);
    // This is a JavaScript value formated as a string
    if ( !! curUser) {
        curUser = '"' + curUser + '"';
    } else {
        curUser = 'null';
    }

    if (req.url === '/invited') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(nunjucks.render('invited.html', {
            foo: 'bar',
            user: curUser
        }));
    } else if (req.url === '/instructions') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(nunjucks.render('instructions.html', {
            foo: 'bar',
            user: curUser
        }));
    } else if (req.url === '/auth/login' &&
        req.method === 'POST') {
        authLogin(req, res);
    } else if (req.url === '/auth/logout') {
        authLogout(req, res);
    } else {
        console.log(req.url);
        res.end('Wha?');
    }
}

function authLogin(req, res) {

    var postData = "";
    req.on('data', function(data) {
        postData += data;
    });
    req.on('end', function() {
        console.log(postData);
        var opts = {
            assertion: qs.parse(postData).assertion,
            audience: config.audience,
            url: 'https://verifier.login.persona.org/verify'
        };
        verify(opts, function(err, response) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            if (err) {
                return console.error(err);
            }
            var sessValues = req.session.get();

            sessions['' + sessValues.guid] = response.email;
            res.end('{}');
        });
    });
}

function authLogout(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    var guid = req.session.get().guid;
    console.log('Clearing sessions for ', guid);
    delete sessions[guid];
    res.end('{}');
}

server.listen(config.port, config.bind_address, function() {
    console.log('Database server running on ' + dbServer.port);
    console.log('Public url is ' + config.audience);
    console.log('Listening for traffic on http://' + config.bind_address + ':' + config.port);
});