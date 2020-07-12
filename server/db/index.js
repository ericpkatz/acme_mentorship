const conn = require('./conn');
const User = require('./User');

const seed = async()=> {
  await conn.sync({ force: true });
};

module.exports = {
  seed,
  models: {
    User
  }
};
