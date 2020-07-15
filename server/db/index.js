const conn = require('./conn');
const User = require('./User');

const seed = async()=> {
  await conn.sync({ force: true });
  const [moe, lucy, red, wanda, eddy, freddie, carl, mel, steve, jack, rob] = users = await Promise.all([
    User.create({ name: 'MOE'}),
    User.create({ name: 'LUCY', userType: 'TEACHER'}),
    User.create({ name: 'RED', userType: 'TEACHER'}),
    User.create({ name: 'WANDA' }),
    User.create({ name: 'EDDY' }),
    User.create({ name: 'FREDDIE' }),
    User.create({ name: 'CARL', userType: 'TEACHER' }),
    User.create({ name: 'MEL' }),
    User.create({ name: 'STEVE' }),
    User.create({ name: 'JACK', userType: 'TEACHER' }),
    User.create({ name: 'ROB' }),
  ]);
  await moe.setMentor(lucy);
  await steve.setMentor(carl);
  await rob.setMentor(carl);
  await freddie.setMentor(jack); 

  return users.reduce((acc, user) => {
    acc[user.name] = user;
    return acc;
  }, {});
};

module.exports = {
  conn,
  seed,
  models: {
    User
  }
};
