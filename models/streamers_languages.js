/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return StreamersLanguages.init(sequelize, DataTypes);
}

class StreamersLanguages extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    streamer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'streamers',
        },
        key: 'id'
      }
    },
    language_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'languages',
        },
        key: 'id'
      }
    },
    native: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'streamers_languages',
    schema: 'public',
    timestamps: false
  });
  return StreamersLanguages;
  }
}
