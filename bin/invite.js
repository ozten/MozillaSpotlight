#!/usr/local/bin/node
var mailer = require('nodemailer'),
    config = require('../config');

console.log(config.login, config.password);

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = mailer.createTransport("SMTP",{
    host: config.hostname,
    debug: true,
    auth: {
	user: config.login,
	pass: config.password
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "Spotlighters <team@mozillaspotlight.com>",
    to: "shout@ozten.com",
    subject: "You're in the Mozilla Spotlight!",
    text: "Hello!\n" +
"\n" +
"If you had four minutes to say anything you wanted to all Mozillians, in public, what would you say?\n" +
"\n" +
"Welcome to Spotlight.\n" +
"Our new web site that introduces one of us, to all the rest of us, each day.\n" +
"\n" +
"Spotlight randomly contacts one mozillian a day, giving them the chance to share themselves and their thoughts with the Mozilla community. After creating and sending in a four minute video (...animation, presentation, screencast, whatever), Spotlight will post it on planet.mozilla.org for everyone to appreciate.\n" +
"\n" +
"Will you share an idea that keeps you up at night?  Give us a tour of your hometown?  Show the community your favorite recipe? Share whatever you'd like - today the spotlight is on you!\n" +
"\n" +
"You've been randomly chosen today!  Learn more about Spotlight and send us your video\n" +
"http://www.mozillaspotlight.com/invited\n" +
"\n" +
"Cheers,\n" +
"\n" +
"The Spotlight Team\n"
};

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
	console.log(error);
    }else{
	console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    smtpTransport.close(); // shut down the connection pool, no more messages
});