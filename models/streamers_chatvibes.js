/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return StreamersChatVibes.init(sequelize, DataTypes);
};

class StreamersChatVibes extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        streamer_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "streamers",
            },
            key: "id",
          },
        },
        chatvibe_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "chatvibes",
            },
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "streamers_chatvibes",
        schema: "public",
        timestamps: false,
      }
    );
    return StreamersChatVibes;
  }
}
