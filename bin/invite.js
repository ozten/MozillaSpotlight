#!/usr/local/bin/node

var mailer = require('nodemailer');

var config = require('../config');
var db = require('../lib/db');

if (3 !== process.argv.length) {
    console.log('USAGE:', process.argv[1], 'EMAIL_ADDRESS');
    process.exit(1);
}
var email = process.argv[2];

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = mailer.createTransport("SMTP", {
    host: config.smtp_hostname,
    port: config.smtp_port,
    debug: true,
    auth: {
        user: config.smtp_login,
        pass: config.smtp_password
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "Spotlighters <team@mozillaspotlight.com>",
    to: email,
    subject: "You're in the Mozilla Spotlight!",
    text: "Hello!\n" + "\n" + "If you had four minutes to say anything you wanted to all Mozillians, in public, what would you say?\n" + "\n" + "Welcome to Spotlight.\n" + "Our new web site that introduces one of us, to all the rest of us, each day.\n" + "\n" + "Spotlight randomly contacts one mozillian a day, giving them the chance to share themselves and their thoughts with the Mozilla community. After creating and sending in a four minute video (...animation, presentation, screencast, whatever), Spotlight will post it on planet.mozilla.org for everyone to appreciate.\n" + "\n" + "Will you share an idea that keeps you up at night?  Give us a tour of your hometown?  Show the community your favorite recipe? Share whatever you'd like - today the spotlight is on you!\n" + "\n" + "You've been randomly chosen today!  Learn more about Spotlight and send us your video\n" + "http://www.mozillaspotlight.com/invited\n" + "\n" + "Cheers,\n" + "\n" + "The Spotlight Team\n"
};

console.log('Sending email', mailOptions);

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response) {
    console.log('smtpTransport callback', error, response);
    smtpTransport.close();
    if (error) {
        console.log(error);
    } else {
        console.log('message sent, saving workflow');
        var workflow = {
            email: email,
            // created is also the invited time
            created: new Date().getTime()
        };
        db.saveSpotlightWorkflow(email, workflow, function(err) {
            db.close();
            if (err) {
                console.error(err);
                throw new Error(err);
            }
            console.log("Message sent to " + email);
            process.exit(0);
        });
    }
});