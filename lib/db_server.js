var net = require('net');

var config = require('../config');
var level = require('level');
var multilevel = require('multilevel');

// Low level Database
var  lldb = level('./data');
net.createServer(function (con) {
  con.pipe(multilevel.server(lldb)).pipe(con);
}).listen(config.db_port);

exports.port = config.db_port;