const { expect } = require('chai');
const {
  db,
  models: { User },
} = require('../../server/db');
const _app = require('../../server/app');
const app = require('supertest')(_app);

// TODO: Make the starting point API respond with 404 instead of 200
describe('Routes: User', () => {
  let users;

  beforeEach(async () => {
    await db.sync({ force: true });
    const _users = await Promise.all([
      User.create({ name: 'MOE' }),
      User.create({ name: 'LUCY', userType: 'TEACHER' }),
      User.create({ name: 'WANDA' }),
      User.create({ name: 'EDDY' }),
    ]);
    const [moe, lucy] = _users;
    await moe.setMentor(lucy);
    users = _users.reduce((acc, user) => {
      acc[user.name] = user;
      return acc;
    }, {});
  });

  // TODO: Tell them to go to server/routes.js
  describe('GET /users/unassigned', () => {
    // TODO: Ask them to make a model method: User.getUnassignedStudents
    it('responds with two unassigned users', async () => {
      const response = await app.get('/api/users/unassigned');
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(2);
      const names = response.body.map((user) => user.name);
      expect(names).to.include('WANDA');
      expect(names).to.include('EDDY');
    });

    // TODO: Ask students to go look at the front-end to see the students

    xit('TODO: HANDLE ERRORS TESTS', () => {});
  });

  describe('GET /users/teachers', () => {
    // TODO: Clarify that it suould only respond with teachers who have mentees assigned.
    // NOTE: It is possible be a userType teacher, but have no one assigned.
    // TODO: Also clarify that the respond needs to include the mentees assigned to this teacher
    it('responds with users', async () => {
      const response = await app.get('/api/users/teachers');
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(1);
      const [lucy] = response.body;
      expect(lucy.name).to.equal('LUCY');
      const [moe] = lucy.mentees;
      expect(moe.name).to.equal('MOE');
    });

    // TODO: Ask students to go look at the front-end to see the teachers

    xit('TODO: HANDLE ERRORS TESTS', () => {});
  });

  describe('DELETE /users/:id', () => {
    describe('user exists', () => {
      it('a user can be deleted', async () => {
        let moe = users.MOE;
        const response = await app.delete(`/api/users/${moe.id}`);
        expect(response.status).to.equal(204);
        moe = await User.findByPk(users.MOE.id);
        expect(moe).to.equal(null);
      });
    });
    describe('user does not exist', () => {
      xit('TODO: - 404?', async () => {});
    });
    describe('called with an id which is silly', () => {
      xit('TODO: - 404?', async () => {});
    });
    describe('user is a mentor', () => {
      xit('TODO: - 500?', async () => {});
    });
  });

  describe('POST /users', () => {
    describe('valid data', () => {
      // TODO: Make sure the new data is in the database.
      it('returns the user', async () => {
        const response = await app.post('/api/users').send({ name: 'Flip' });
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Flip');
        // TODO: Also check for the user's other fields, to make sure they're there
      });
    });
    describe('invalid data', () => {
      describe('name exists', () => {
        // TODO: I think the repsonse should be like a 401 if they're missing necessary data
        xit('TODO: returns 500', async () => {});
      });
    });
  });

  describe('PUT /users/:id', () => {
    describe('valid data', () => {
      it('returns the updated user', async () => {
        const response = await app
          .put(`/api/users/${users.EDDY.id}`)
          .send({ name: 'Eddie', userType: 'TEACHER' });
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal('Eddie');
      });
    });

    describe('invalid data', () => {
      describe('user does not exist', () => {
        xit('TODO: returns 500', async () => {});
      });
    });
  });
});
