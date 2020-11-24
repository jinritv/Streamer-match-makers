/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ChatVibes.init(sequelize, DataTypes);
}

class ChatVibes extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    vibe: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'chat_vibes',
    schema: 'public',
    timestamps: false
  });
  return ChatVibes;
  }
}

