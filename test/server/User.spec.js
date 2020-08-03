const { expect } = require('chai');
const {
  db,
  models: { User },
} = require('../../server/db');

/**
 * You'll have to configure the User model to have a name field and a
 * userType field. You'll also be asked to create two virtual fields,
 * isTeacher and isStudent.
 */

describe('Model: User', () => {
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
  // TODO: Test should be about adding user's name, rather than being four of them..
  // TODO: Tell student to go look at server/db/User.js
  it('there are 4 users seeded', () => {
    expect(Object.entries(users).length).to.equal(4);
  });
  // TODO: Maybe this doesn't need to be a test, since we already create the association.
  it('lucy is moes mentor', () => {
    expect(users.MOE.mentorId).to.equal(users.LUCY.id);
  });

  describe('creating', () => {
    describe('when name is not unique', () => {
      it('can not be created', async () => {
        try {
          await User.create({ name: 'ERIC' });
          await User.create({ name: 'ERIC' });
          throw Error('noooo');
        } catch (ex) {
          expect(ex.errors[0].path).to.equal('name');
        }
      });
    });
    // TODO: Needs to make a test for userType BEFORE this test
    // TODO: THe error message shouldn't have to be hard-coded.
    // NOTE: Have students seen manual errors thrown in Sequelize hooks before?
    describe('when a mentor is not a TEACHER', () => {
      it('can NOT be created', async () => {
        const eddy = users.EDDY;
        try {
          await User.create({ name: 'JERRY', mentorId: eddy.id });
          throw Error('noooo');
        } catch (ex) {
          expect(ex.message).to.equal('MENTOR MUST BE TEACHER');
        }
      });
    });
    //TODO: Tell them that userType should be an ENUM
    describe('when a mentor is a TEACHER', () => {
      it('can be created', async () => {
        const lucy = users.LUCY;
        await User.create({ name: 'JERRY', mentorId: lucy.id });
      });
    });
  });

  describe('updating', () => {
    describe('when a mentor is not a TEACHER', () => {
      // TODO: Clarify what sort of updates are valid?
      // TODO: Even on updates, you cannot set a non-teacher to be someone's mentor.
      it('can NOT be updated', async () => {
        const eddy = users.EDDY;
        const wanda = users.WANDA;
        try {
          await eddy.update({ mentorId: wanda.id });
          throw Error('noooo');
        } catch (ex) {
          expect(ex.message).to.equal('MENTOR MUST BE TEACHER');
        }
      });
    });
    describe('when a mentor is a TEACHER', () => {
      it('can be updated', async () => {
        const eddy = users.EDDY;
        const lucy = users.LUCY;
        await eddy.update({ mentorId: lucy.id });
      });
    });
  });

  describe('deleting', () => {
    describe('a teacher WHO mentors', () => {
      // TODO: Maybe throw them a hint to look at beforeDestroy hook
      it('can NOT be deleted', async () => {
        const lucy = users.LUCY;
        try {
          await lucy.destroy();
          throw Error('noooo');
        } catch (ex) {
          expect(ex.message).to.equal('A MENTOR CAN NOT BE DELETED');
        }
      });
    });
    describe('a teacher who does not mentees', () => {
      it('can be deleted', async () => {
        const moe = users.MOE;
        await moe.update({ mentorId: null });
        const lucy = users.LUCY;
        await lucy.destroy();
      });
    });
  });

  describe('isStudent virtual property', () => {
    describe('when the user is a STUDENT', () => {
      // TODO: This test is ACTUALLY about default userType === STUDENT. Make a new test about that explicitly.
      it('is true', () => {
        expect(users.MOE.isStudent).to.equal(true);
      });
    });
    describe('when the user is NOT a STUDENT', () => {
      it('is false', () => {
        expect(users.LUCY.isStudent).to.equal(false);
      });
    });
  });

  describe('isTeacher virtual property', () => {
    describe('when the user is a TEACHER', () => {
      it('is true', () => {
        expect(users.LUCY.isTeacher).to.equal(true);
      });
    });
    describe('when the user is NOT a TEACHER', () => {
      it('is false', () => {
        expect(users.MOE.isTeacher).to.equal(false);
      });
    });
  });

  describe('userType', () => {
    describe('changing to TEACHER', () => {
      describe('when the user is a mentee', () => {
        it('userType can not be changed', async () => {
          const moe = users.MOE;
          moe.userType = 'TEACHER';
          try {
            await moe.save();
            throw Error('noooo');
          } catch (ex) {
            expect(ex.message).to.equal('A TEACHER CAN NOT HAVE A MENTOR');
          }
        });
      });
      describe('when the user is not a mentee', () => {
        beforeEach(async () => users.MOE.setMentor(null));
        // TODO: This one could probably use a demo, or a link to a YouTube demonstration of the working front-end
        it('userType can be changed', async () => {
          const moe = users.MOE;
          moe.userType = 'TEACHER';
          await moe.save();
        });
      });
    });
    // TODO: Add an example. E.g. If LUCY is a teacher, but isn't mentoring anyone, she can be changed to student.
    describe('changing to STUDENT', () => {
      describe('When the user has no mentees', () => {
        it('userType can be changed', async () => {
          const moe = users.MOE;
          await moe.setMentor(null);
          const lucy = users.LUCY;
          lucy.userType = 'STUDENT';
          await lucy.save();
          expect(lucy.userType).to.equal('STUDENT');
        });
      });

      // TODO: Sometimes we prefer that an error be thrown instead of the data to be changed.
      describe('when there ARE mentees', () => {
        // TODO: Clarify for students what we need them to do here...
        it('userType can NOT be changed', async () => {
          const lucy = users.LUCY;
          lucy.userType = 'STUDENT';
          try {
            await lucy.save();
            throw Error('noooo');
          } catch (ex) {
            expect(ex.message).to.equal('STUDENT CAN NOT HAVE MENTEES');
          }
        });
      });
    });
  });
});
