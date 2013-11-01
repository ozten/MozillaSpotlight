var http = require('http');
var path = require('path');
var qs = require('qs');

var nunjucks = require('nunjucks');
var uuid = require('node-uuid');
var Sessions = require("sessions");
var verify = require('browser-id-verify');

var config = require('../config');
var dbServer = require('../lib/db_server');
var db = require('../lib/db'); // db bust be after db_server

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
    console.log('curUser=', curUser);
    // This is a JavaScript value formated as a string
    if ( ! curUser) {
        curUser = null;
    }

    if (req.url === '/invited') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(nunjucks.render('invited.html', {
            foo: 'bar',
            user: JSON.stringify(curUser)
        }));
    } else if (req.url === '/debug') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        db.spotlightWorkflowByEmail('shout@ozten.com', function(err, workflow) {

            var data = {
                msg: 'huh',
                err: err,
                workflow: JSON.stringify(workflow)
            };
            if (workflow) console.log("Cool workflow was from ", new Date(workflow.created));
            res.end(JSON.stringify(data));
        });

    } else if (req.url === '/instructions') {
        instructions(req, res, curUser);
    } else if (req.url === '/spotlight' &&
        req.method === 'POST') {
        updateSpotlight(req, res, curUser);
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

function instructions(req, res, curUser) {
    console.log('instructions curUser=', curUser);

    if (curUser) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        db.spotlightWorkflowByEmail(curUser, function(err, workflow) {
            if (err || !workflow) {
                res.end(nunjucks.render('wrong_email.html', {
                    user: JSON.stringify(curUser)
                }));
            } else {
                // Capture the user's intent to follow through
                workflow.read_instructions = new Date().getTime();
                db.saveSpotlightWorkflow(curUser, workflow, function() {});

                res.end(nunjucks.render('instructions.html', {
                    baseUrl: config.audience,
                    user: JSON.stringify(curUser),
                    workflow: workflow
                }));
            }
        });
    } else {
        res.writeHead(302, {
            'Location': config.audience + '/invited'
        });
        res.end();
    }


}


function updateSpotlight(req, res, curUser) {

    db.spotlightWorkflowByEmail(curUser, function(err, workflow) {
            if (err || !workflow) {
                res.end(nunjucks.render('wrong_email.html', {
                    user: JSON.stringify(curUser)
                }));
            } else {


                console.log('updating Spotlight');

                var postData = "";
                req.on('data', function(data) {
                    postData += data;
                });
                req.on('end', function() {

                    workflow.embed = qs.parse(postData).embed;
                    workflow.updated = new Date().getTime();
                    db.saveSpotlightWorkflow(curUser, workflow, function(err) {
                        if (err) {
                            console.error(err);
                            throw new Error(err);
                        }
                        res.writeHead(200, {'Content-Type': 'text/html'});

                        res.end(nunjucks.render('thanks.html', {
                            baseUrl: config.audience,
                            workflow: workflow,
                            user: JSON.stringify(curUser)
                        }));
                    });
                });
            }
    });
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