/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return StreamersLocations.init(sequelize, DataTypes);
};

class StreamersLocations extends Sequelize.Model {
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
        location_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: {
              tableName: "locations",
            },
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "streamers_locations",
        schema: "public",
        timestamps: false,
      }
    );
    return StreamersLocations;
  }
}
