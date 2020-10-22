/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return StreamersNationalities.init(sequelize, DataTypes);
}

class StreamersNationalities extends Sequelize.Model {
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
    nationality_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'nationalities',
        },
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'streamers_nationalities',
    schema: 'public',
    timestamps: false
  });
  return StreamersNationalities;
  }
}
