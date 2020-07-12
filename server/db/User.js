const conn = require('./conn');

const User = conn.define('user', {});

module.exports = User;
