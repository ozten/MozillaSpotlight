var net = require('net');

var multilevel = require('multilevel');

var config = require('../config');

// We also use the networked connection
var db = multilevel.client();
var con = net.connect(config.db_port);
con.pipe(db.createRpcStream()).pipe(con);

/*** Workflows ***/

const WORKFLOW_PREFIX = 'workflow~';
function workflowKey(email) { return WORKFLOW_PREFIX + email; }
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
    console.log(typeof value, value);
    cb(null, value);
  });
};

console.log('loading');

exports.saveSpotlightWorkflow = function(email, workflow, cb) {
  console.log('WRiting ' + workflowKey(email));
  db.put(workflowKey(email), workflow, cb);
};

exports.close = function() {
    db.close();
};

exports.streamWorkflows = function(errCb, eachCb, closeCb) {
  db.createReadStream({
    start: WORKFLOW_PREFIX,
    end: WORKFLOW_PREFIX + '\xFF'
  })
  .on('error', errCb)
  .on('data', eachCb)
  .on('close', closeCb);
};

/*** Scheduling ***/
const SCHEDULE_PREFIX = 'schedule~';
exports.isScheduled = function(email, cb) {
  console.log('isScheduled?');
  db.get(SCHEDULE_PREFIX + email, function(err, value) {

    console.log('isScheduled CALLBACK', err, value);
    if (err.notFound) {
      return cb(false);
    } else if (err) {
      throw new Error(err);
    } else {
      return cb(true, value);
    }
  });
};

const LAST_SCH_DATE_PREFIX = 'scheduled_last~';
exports.lastScheduledDay = function(cb) {
  db.get(LAST_SCH_DATE_PREFIX, function(err, value) {
    if (err.notFound) {
      return cb(null, null);
    } else if (err) {
      cb(err);
    } else {
      return cb(null, value);
    }
  });
};

exports.scheduleSpotlight = function(day, email, cb) {
  console.log(day.getFullYear(), day.getMonth() + 1, day.getDate());
  var fmtDate = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
  db.put(SCHEDULE_PREFIX + fmtDate, email, function(err) {
    if (err) {
      throw new Error(err);
    } else {
      db.put(LAST_SCH_DATE_PREFIX, fmtDate, cb);
    }
  });

};