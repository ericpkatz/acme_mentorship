const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/users', require('./routes/users'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message });
});

module.exports = app;
