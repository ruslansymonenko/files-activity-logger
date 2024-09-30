const http = require('node:http');
const {app} = require('./app/app.js');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Logs app`);
});

server.listen(port, hostname, () => {
  console.log(`Server started on port ${port}`);

  app();
})