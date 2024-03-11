const http = require('http'),
  fs = require('fs'),
  url = require('url');

http.createServer((request, response) => {
  // Extract the URL and create a URL object
  let addr = request.url,
    q = new URL(addr, 'http://' + request.headers.host),
    filePath = '';

  // Append the request information to a log file
  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

  // Determine the file path based on the presence of 'documentation' in the pathname
  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  // Read the HTML file and serve it as the response
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  });

}).listen(8080);

console.log('My test server is running on Port 8080.');
