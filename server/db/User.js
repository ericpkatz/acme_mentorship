const conn = require('./conn');
const { UUID, UUIDV4 } = conn.Sequelize;

const User = conn.define('user', {
  id: {
    primaryKey: true,
    defaultValue: UUIDV4,
    type: UUID
  }
});

module.exports = User;
