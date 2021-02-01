/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return StreamersVibes.init(sequelize, DataTypes);
};

class StreamersVibes extends Sequelize.Model {
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
        vibe_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: {
              tableName: "vibes",
            },
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "streamers_vibes",
        schema: "public",
        timestamps: false,
      }
    );
    return StreamersVibes;
  }
}
