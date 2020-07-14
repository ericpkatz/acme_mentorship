const conn = require('./conn');
const { UUID, UUIDV4, STRING, ENUM } = conn.Sequelize;

const User = conn.define('user', {
  id: {
    primaryKey: true,
    defaultValue: UUIDV4,
    type: UUID,
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  userType: {
    type: ENUM('STUDENT', 'TEACHER'),
    defaultValue: 'STUDENT',
    allowNull: false,
  },
});

User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });

User.findUnassigned = function () {
  return this.findAll({
    where: {
      mentorId: null,
      userType: 'STUDENT',
    },
  });
};

User.findTeachers = function () {
  return this.findAll({
    where: {
      userType: 'TEACHER',
    },
    include: [{ model: User, as: 'mentees' }],
  });
};

module.exports = User;
