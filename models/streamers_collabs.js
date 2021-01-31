/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return StreamersCollabs.init(sequelize, DataTypes);
};

class StreamersCollabs extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        streamer_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: {
              tableName: "streamers",
            },
            key: "id",
          },
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        collab_with: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        collab_summary: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "streamers_collabs",
        schema: "public",
        timestamps: false,
      }
    );
    return StreamersCollabs;
  }
}
