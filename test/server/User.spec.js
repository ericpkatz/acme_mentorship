const { expect } = require('chai');
const db = require('../../server/db');

describe('Model: User', ()=> {
  let users;

  const { conn } = db;
  const { User } = db.models;

  beforeEach(async()=> {
    await conn.sync({ force: true });
    const [moe, lucy, wanda, eddy] = _users = await Promise.all([
      User.create({ name: 'MOE'}),
      User.create({ name: 'LUCY', userType: 'TEACHER'}),
      User.create({ name: 'WANDA' }),
      User.create({ name: 'EDDY' }),
    ]);
    await moe.setMentor(lucy);
    users = _users.reduce((acc, user) => {
      acc[user.name] = user;
      return acc;
    }, {});

  });
  it('there are 4 users seeded', ()=> {
    expect(Object.entries(users).length).to.equal(4);
  });
  it('lucy is moes mentor', ()=> {
    expect(users.MOE.mentorId).to.equal(users.LUCY.id);
  });
});
