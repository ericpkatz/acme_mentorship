const express = require('express');
const path = require('path');

const app = express();

app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname, '../index.html'))
);

app.use('/api/users', require('./routes/users'));

module.exports = app;
