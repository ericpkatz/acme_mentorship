const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define('user', {
  // Add your Sequelize fields here
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  userType: {
    type: Sequelize.ENUM('STUDENT', 'TEACHER'),
    defaultValue: 'STUDENT',
  },
  isStudent: {
    type: Sequelize.VIRTUAL,
    get: function () {
      return this.userType === 'STUDENT';
    },
  },
  isTeacher: {
    type: Sequelize.VIRTUAL,
    get: function () {
      return this.userType === 'TEACHER';
    },
  },
});

User.beforeSave(async (user) => {
  const { mentorId } = user;
  const mentor = mentorId ? await User.findByPk(mentorId) : null;
  if (mentor && !mentor.isTeacher) {
    throw new Error('MENTOR MUST BE TEACHER');
  }
  if (user.isTeacher && user.mentorId) {
    throw new Error('A TEACHER CAN NOT HAVE A MENTOR');
  }
  if (user.userType === 'STUDENT') {
    if (user.isNewRecord) return;
    const mentees = await user.getMentees();
    // const mentees = await User.findAll({
    //   where: { mentorId: user.id },
    // });
    // console.log(user.name, mentees.map((mentee) => mentee.name));
    if (mentees.length) throw new Error('STUDENT CAN NOT HAVE MENTEES');
  }
});

User.beforeDestroy(async (user) => {
  if (!user.isTeacher) return;
  const mentees = await user.getMentees();
  if (mentees.length) throw new Error('A MENTOR CAN NOT BE DELETED');
});

/**
 * We've created the association for you!
 *
 * A user can be related to another user as a mentor:
 *       SALLY (mentor)
 *         |
 *       /   \
 *     MOE   WANDA
 * (mentee)  (mentee)
 * You can find the mentor of a user by the mentorId field
 * In Sequelize, you can also use the magic method getMentor()
 */

User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });

module.exports = User;
