// https://github.com/molnarg/node-http2
// https://webapplog.com/http2-server-push-express-middleware/

const http = require('http');
const express = require('express');
const compression = require('compression');

const app = express();

app.use(compression());
app.use('/', express.static('.'));
app.get('/api/v1/data/:file', (req, res) => {
  res.header({ 'content-type': 'application/xml; charset=utf-8' });
  res.sendFile(`${__dirname}/xml/${req.params.file}`);
});
const port = process.argv[2] || 8000;
http.createServer(app).listen(port, () => {
  console.log('Server up and running:', `\x1b[42mhttp://localhost:${port}\x1b[0m`);
});