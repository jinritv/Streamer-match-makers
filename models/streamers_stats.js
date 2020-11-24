/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return StreamersStats.init(sequelize, DataTypes);
}

class StreamersStats extends Sequelize.Model {
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
    followers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    voice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    avg_viewers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    avg_stream_duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    viewer_participation: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    start_stream: {
      type: DataTypes.TIME,
      allowNull: true
    },
    chat_mode: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'streamers_stats',
    schema: 'public',
    timestamps: false
  });
  return StreamersStats;
  }
}
