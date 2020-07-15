const express = require('express');
const path = require('path');

const app = express();
app.use(require('body-parser').json());
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname, '../index.html'))
);

app.use('/api/users', require('./routes/users'));

module.exports = app;
