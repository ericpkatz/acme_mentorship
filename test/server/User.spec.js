const { expect } = require('chai');
const db = require('../../server/db');

describe('Model: User', ()=> {
  let users;
  beforeEach(async()=> {
    users = await db.seed();
  });
  it('there are 2 users seeded', ()=> {
    expect(Object.entries(users).length).to.equal(2);
  });
  it('lucy is moes mentor', ()=> {
    expect(users.MOE.mentorId).to.equal(users.LUCY.id);
  });
});
