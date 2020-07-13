const conn = require('./conn');
const User = require('./User');

const seed = async()=> {
  await conn.sync({ force: true });
  const [moe, lucy] = users = await Promise.all([
    User.create({ name: 'MOE'}),
    User.create({ name: 'LUCY', type: 'TEACHER'}),
  ]);
  await moe.setMentor(lucy);
  
  return users.reduce((acc, user) => {
    acc[user.name] = user;
    return acc;
  }, {});
};

module.exports = {
  seed,
  models: {
    User
  }
};
