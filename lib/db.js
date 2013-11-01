var net = require('net');

var multilevel = require('multilevel');

var config = require('../config');

// We also use the networked connection
var db = multilevel.client();
var con = net.connect(config.db_port);
con.pipe(db.createRpcStream()).pipe(con);

function workflowKey(email) { return 'workflow.' + email; }
/**
 * @return an assoc array with workflow information or null if none found
 */
exports.spotlightWorkflowByEmail = function(email, cb) {
    console.log("Reading", workflowKey(email));
  db.get(workflowKey(email), function(err, value) {
    console.log(err, typeof value, value);
    if (err) {
        if (err.notFound) {
            return cb(null, null);
        }
        throw new Error(err);
    }
    console.log(JSON.parse(value));
    cb(null, JSON.parse(value));
  });
};

console.log('loading');

exports.saveSpotlightWorkflow = function(email, workflow, cb) {
  console.log('WRiting ' + workflowKey(email));
  db.put(workflowKey(email), JSON.stringify(workflow), cb);
};

exports.close = function() {
    db.close();
}