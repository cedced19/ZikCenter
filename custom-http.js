function fastHttp (port, dir) {
    var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

  httpServer = http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname;
    filename = path.join(dir, uri);

    var contentTypesByExtension = {
      '.html': 'text/html',
      '.css':  'text/css',
      '.js':   'text/javascript',
      '.mp3': 'audio/mp3',
      '.gif': 'image/gif',
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.meg': 'video/mpeg',
      '.mp4': 'video/mp4'
    };

    path.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        path.exists(__dirname + '404.html', function(exists) {
          if(!exists) {
            response.end('Error 404');
            return;
          }
          fs.createReadStream(__dirname + '404.html').pipe(response);
        });
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += 'index.html';

      fs.readFile(filename, 'binary', function(err, file) {
        if(err) {
          response.writeHead(500, {'Content-Type': 'text/html'});
          path.exists(__dirname + '500.html', function(exists) {
            if(!exists) {
              response.end('Error 500');
              return;
            }
              fs.createReadStream(__dirname + '500.html').pipe(response);
          });
          return;
        }

        var headers = new Object();
        var contentType = contentTypesByExtension[path.extname(filename)];
        if (contentType) headers['Content-Type'] = contentType;
        response.writeHead(200, headers);
        response.write(file, 'binary');
        response.end();
      });
    });
  });

  return httpServer.listen(parseInt(process.argv[2] || port, 10));
  }


module.exports = fastHttp;