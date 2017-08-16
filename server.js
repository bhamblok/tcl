// https://github.com/molnarg/node-http2
// https://webapplog.com/http2-server-push-express-middleware/

const fs = require('fs');
const http = require('http');
const http2 = require('http2');
const httpProxy = require('http-proxy');
const express = require('express');
const compression = require('compression');
const workAround = require('express-http2-workaround');

const app = express();
// Make HTTP2 work with Express (this must be before any other middleware)
workAround({ express, http2, app });

app.use(compression());
app.use('/', express.static('.'));

const options = {
  key: fs.readFileSync(`${process.env.HOME}/.localhost-ssl/key.pem`, 'utf8'),
  cert: fs.readFileSync(`${process.env.HOME}/.localhost-ssl/cert.pem`, 'utf8'),
};
// proxy livereload over https
httpProxy.createServer({
  ssl: options,
  target: 'http://localhost:3335',
  ws: true,
  secure: true,
}).listen(3334);
// Create an HTTP service.
// Redirect from http port 80 to https
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80);
// Create an HTTPS service identical to the HTTP service.
http2.createServer(options, app).listen(443);
