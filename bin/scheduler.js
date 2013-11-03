#!/usr/local/bin/node

var config = require('../config');
var db = require('../lib/db');

var nextEmptyDay;
var count = 0;

function workflowsError(err) {
  throw new Error(err);
  process.exit(1);
}

function workflow(data) {
  console.log(data.key, data.value);
  if (!! data.value.embed) {
    console.log('We have another winner', data.value.embed);
    count++;
    db.isScheduled(data.value.email, function(scheduled, details) {
        count--;
        console.log("AOK");
        console.log(scheduled, details);
        if (false === scheduled) {
            count++;
            db.scheduleSpotlight(nextEmptyDay, data.value.email, function(err) {
                count--;
                if (0 === count) {
                    process.exit(0);
                }
            });
        } else if (0 === count) {
            process.exit(0);
        }
    });
  }
}

function finished() {
  count--;
  console.log('all done, publish the newest');
  if (0 === count) {
    process.exit(0);
  }
}
db.lastScheduledDay(function(err, lastDate) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    if (null === lastDate) {
        lastDate = new Date();
    }
    console.log(lastDate);
    lastDate.setTime(lastDate.getTime() + 1000 * 60 * 60 * 24);
    console.log('becomes', lastDate);

    nextEmptyDay = lastDate;
    count++;
    db.streamWorkflows(workflowsError, workflow, finished);
});
