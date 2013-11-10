#!/usr/local/bin/node

var path = require('path');

var nunjucks = require('nunjucks');

var config = require('../config');
var db = require('../lib/db');

nunjucks.configure(path.join(__dirname, '../views'));

var spotlights = [{
    guid: config.audience + '/2013/11/04/austin_king.html',
    title: 'Austin King - Seattle, WA, USA',
    pubDate: 'Mon, 28 Oct 2013 19:45:20 +0000',
    creator: 'Austin King',
    description: 'A video spotlight from a random Mozillian. This time it is Austin King - Seattle, WA, USA',
    content: '<p>Spotlighting a random Mozillan, one per day.</p><h2>Austin King - Seattle, WA, USA</h2><a href="http: //www.youtube.com/watch?v=gSEzGDzZ1dY">Watch</a><a href="http://www.youtube.com/watch?v=CBhop1NQ8lg">Watch 2</a><iframe width="420" height="315" src="//www.youtube.com/embed/CBhop1NQ8lg" frameborder="0" allowfullscreen></iframe>'
}];

console.log(nunjucks.render('rss.xml', {
    baseUrl: config.audience,
    lastBuildDate: 'Mon, 28 Oct 2013 19:45:20 +0000',
    spotlights: spotlights
}));

process.exit(0);