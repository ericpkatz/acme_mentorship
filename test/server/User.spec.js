const { expect } = require('chai');
const db = require('../../server/db');

describe('Model: User', ()=> {
  let users;
  beforeEach(async()=> {
    users = await db.seed();
  });
  it('there are 2 users seeded', ()=> {
    expect(users.length).to.equal(2);
  });
});
