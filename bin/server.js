var http = require('http');
var path = require('path');

var nunjucks = require('nunjucks');

nunjucks.configure(path.join(__dirname, '../views'));

var server = http.createServer(function(req, res) {
  if (req.url === '/invited') {
    res.writeHead(200, {'Content-Type': 'text/html'});

    res.end(nunjucks.render('invited.html', { foo: 'bar' }));
  } else {
    console.log(req.url);
    res.end('Wha?');
  }
});

server.listen(8002, '0.0.0.0', function(){
    console.log('Listening for traffic on 8002');
});