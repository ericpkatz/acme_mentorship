const { expect } = require('chai');
const { cyan } = require('chalk');
const {
  db,
  models: { User },
} = require('../../server/db');

/**
 * You'll have to configure the User model to have a name field and a
 * userType field. You'll also be asked to create two virtual fields,
 * isTeacher and isStudent.
 */

/**
 * Fields: name, userType
 *   unique, not null, defaultValue
 * Virtual Fields: isStudent, isTeacher
 *   getters
 * Hooks: creating, updating, deleting
 *   beforeSave, beforeDestroy (maybe beforeCreate, beforeUpdate)
 *   magic method (or eager loading)
 *   throwing custom errors
 * TODO: custom class method
 * TODO: custom instance method
 */
describe.only('Model: User', () => {
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

  describe('Basic Fields: name and userType', () => {
    describe('name', () => {
      it('name is a string', async () => {
        const hannah = await User.create({ name: 'HANNAH' });
        expect(hannah.name).to.equal('HANNAH');
      });

      it('name must be unique', async () => {
        // We shouldn't be able to create two users with the same name.
        await User.create({ name: 'HANNAH' });
        await expect(User.create({ name: 'HANNAH' })).to.be.rejected;
      });

      it('name cannot be null', async () => {
        // We shouldn't be able to create a user without a name.
        await expect(User.create({})).to.be.rejected;
      });

      it('name cannot be an empty string', async () => {
        // We also shouldn't be able to create a user with an empty name.
        await expect(User.create({ name: '' })).to.be.rejected;
      });
    });

    describe('userType', () => {
      it('userType can be either "STUDENT" or "TEACHER"', async () => {
        const hannah = await User.create({
          name: 'HANNAH',
          userType: 'TEACHER',
        });
        const ali = await User.create({ name: 'ALI', userType: 'STUDENT' });
        expect(hannah.userType).to.equal('TEACHER');
        expect(ali.userType).to.equal('STUDENT');
      });

      it('userType can ONLY be either "STUDENT" or "TEACHER"', async () => {
        const aliPromise = User.create({
          name: 'ALI',
          userType: 'EAGER_TO_LEARN', // Invalid userType! This promise should reject.
        });
        await expect(aliPromise).to.be.rejected;
      });

      it('userType defaults to "STUDENT" if not provided', async () => {
        const ali = await User.create({ name: 'ALI' });
        expect(ali.userType).to.equal('STUDENT');
      });
    });
  });

  describe('Virtual Fields: isStudent and isTeacher', () => {
    // HINT: Go see what the Sequelize documentation has to say about virtual fields:
    // https://sequelize.org/master/manual/getters-setters-virtuals.html
    describe('isStudent', () => {
      it('isStudent is true if the user is a student', async () => {
        const ali = await User.create({
          name: 'ALI',
          userType: 'STUDENT',
        });
        expect(ali.isStudent).to.equal(true);
      });

      it('isStudent is false if the user is NOT a student', async () => {
        const hannah = await User.create({
          name: 'HANNAH',
          userType: 'TEACHER',
        });
        expect(hannah.isStudent).to.equal(false);
      });

      it("isStudent is virtual (it doesn't appear as a column in the database)", async () => {
        const ali = await User.create({
          name: 'ALI',
          userType: 'STUDENT',
        });
        // The dataValues of a Sequelize instance reflect the columns in that database table.
        // We want isStudent to be _derived_ from the userType property.
        expect(ali.dataValues.isStudent).to.equal(undefined);
      });
    });

    describe('isTeacher', () => {
      it('isTeacher is true if the user is a teacher', async () => {
        const hannah = await User.create({
          name: 'HANNAH',
          userType: 'TEACHER',
        });
        expect(hannah.isTeacher).to.equal(true);
      });

      it('isTeacher is false if the user is NOT a teacher', async () => {
        const ali = await User.create({
          name: 'ALI',
          userType: 'STUDENT',
        });
        expect(ali.isTeacher).to.equal(false);
      });

      it("isTeacher is virtual (it doesn't appear as a column in the database)", async () => {
        const hannah = await User.create({
          name: 'HANNAH',
          userType: 'TEACHER',
        });
        // The dataValues of a Sequelize instance reflect the columns in that database table.
        // We want isTeacher to be _derived_ from the userType property.
        expect(hannah.dataValues.isTeacher).to.equal(undefined);
      });
    });
  });

  // describe('when name is not unique', () => {
  //   it('can not be created', async () => {
  //     try {
  //       await User.create({ name: 'ERIC' });
  //       await User.create({ name: 'ERIC' });
  //       throw Error('noooo');
  //     } catch (ex) {
  //       expect(ex.errors[0].path).to.equal('name');
  //     }
  //   });
  // });
  // TODO: Needs to make a test for userType BEFORE this test
  // TODO: THe error message shouldn't have to be hard-coded.
  // NOTE: Have students seen manual errors thrown in Sequelize hooks before?
  describe('Hooks: beforeCreate, beforeUpdate, beforeDestroy, beforeSave', () => {
    before(() => {
      console.log(
        cyan(`
    HINT: You may not need to use all four of the above-mentioned hooks.
    Go take a look at the Sequelize documentation on hooks for more info:
    https://sequelize.org/master/manual/hooks.html
`)
      );
    });
    describe('Creation', () => {
      it('cannot create a user whose mentor is not a TEACHER', async () => {
        const freddy = await User.create({
          name: 'FREDDY',
          userType: 'STUDENT',
        });
        const jerryPromise = User.create({
          name: 'JERRY',
          mentorId: freddy.id,
        });
        await expect(jerryPromise).to.be.rejected;
      });
      it('can create a user whose mentor is a TEACHER', async () => {
        const freddy = await User.create({
          name: 'FREDDY',
          userType: 'TEACHER',
        });
        const jerry = await User.create({
          name: 'JERRY',
          mentorId: freddy.id,
        });
        expect(jerry.mentorId).to.equal(freddy.id);
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
