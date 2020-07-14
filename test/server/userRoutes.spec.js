const { expect } = require('chai');
const db = require('../../server/db');
const _app = require('../../server/app');
const app = require('supertest')(_app);

describe('Routes: User', () => {
  let users;
  beforeEach(async () => {
    users = await db.seed();
  });
  describe('GET /users/unassigned', () => {
    it('responds with two unassigned users', async () => {
      const response = await app.get('/api/users/unassigned');
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(2);
      const names = response.body.map((user) => user.name);
      expect(names).to.include('WANDA');
      expect(names).to.include('EDDY');
    });

    xit('TODO HANDLE ERRORS TESTS', () => {})
  });
  describe('GET /users/teachers', () => {
    it('responds with users', async () => {
      const response = await app.get('/api/users/teachers');
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(1);
      const [ lucy ] = response.body;
      expect(lucy.name).to.equal('LUCY')
      const [ moe ] = lucy.mentees;
      expect(moe.name).to.equal('MOE')
    });
    xit('TODO HANDLE ERRORS TESTS', () => {})
  });
});
