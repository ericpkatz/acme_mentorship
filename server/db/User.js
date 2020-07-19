const conn = require('./conn');
const { UUID, UUIDV4, STRING, ENUM, VIRTUAL } = conn.Sequelize;

const User = conn.define('user', {
  id: {
    primaryKey: true,
    defaultValue: UUIDV4,
    type: UUID,
  },
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  userType: {
    type: ENUM('STUDENT', 'TEACHER'),
    defaultValue: 'STUDENT',
    allowNull: false,
  },
  isStudent: {
    type: VIRTUAL,
    get: function(){
      return this.userType === 'STUDENT';
    }
  },
  isTeacher: {
    type: VIRTUAL,
    get: function(){
      return this.userType === 'TEACHER';
    }
  }
}, {
  hooks: {
    beforeDestroy: async function(user){
      if(user.userType === 'TEACHER'){
        const mentees = await User.findAll({
          where: {
            mentorId: user.id
          }
        });
        if(mentees.length){
          throw Error('A MENTOR CAN NOT BE DELETED');
        }
      }
    },
    beforeSave: async function(user){
      if(user.userType === 'STUDENT'){
        const mentees = await User.findAll({
          where: {
            mentorId: user.id
          }
        });
        if(mentees.length){
          throw Error('STUDENT CAN NOT HAVE MENTEES');
        }
        if(user.mentorId){
          const mentor = await User.findByPk(user.mentorId);
          if(!mentor.isTeacher){
            throw Error('MENTOR MUST BE TEACHER');
          }
        }
      }
      else{
        if(user.mentorId){
          throw Error('A TEACHER CAN NOT HAVE A MENTOR');
        }
      }
    }
  }
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
