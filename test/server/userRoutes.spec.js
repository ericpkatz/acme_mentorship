const { expect } = require('chai');
const db = require('../../server/db');
const { User } = db.models;
const _app = require('../../server/app');
const app = require('supertest')(_app);

describe('Routes: User', () => {
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


  describe('DELETE /users/:id', ()=> {
    describe('user exists', ()=> {
      it('a user can be deleted', async()=> {
        let moe = users.MOE;
        const response = await app.delete(`/api/users/${moe.id}`);
        expect(response.status).to.equal(204);
        moe = await User.findByPk(users.MOE.id);
        expect(moe).to.equal(null);
      });
    });
    describe('user does not exist', ()=> {
      xit('TODO - 404?', async()=> {
      });
    });
    describe('called with an id which is silly', ()=> {
      xit('TODO - 404?', async()=> {
      });
    });
    describe('user is a mentor', ()=> {
      xit('TODO - 500?', async()=> {
      });
    });
  });

  describe('POST /users', ()=> {
    describe('valid data', ()=> {
      it('returns the user', async()=> {
        const response = await app.post('/api/users')
          .send({ name: 'Flip'});
        expect(response.status).to.equal(201);
      });
    });
    describe('invalid data', ()=> {
      describe('name exists', ()=> {
        xit('TODO returns 500', async()=> {
        });
      });
    });
  });

  describe('PUT /users/:id', ()=> {

    describe('valid data', ()=> {
      it('returns the updated user', async()=> {
        const response = await app.put(`/api/users/${users.EDDY.id}`)
          .send({ name: 'Eddie', userType: 'TEACHER'});
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal('Eddie');
      });
    });

    describe('invalid data', ()=> {
      describe('user does not exist', ()=> {
        xit('TODO returns 500', async()=> {
        });
      });
    });
  });
});
