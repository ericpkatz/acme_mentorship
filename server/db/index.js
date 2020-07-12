const conn = require('./conn');
const User = require('./User');

const seed = async()=> {
  await conn.sync({ force: true });
  const users = await Promise.all([
    User.create({}),
    User.create({}),
  ]);
  return users;
};

module.exports = {
  seed,
  models: {
    User
  }
};