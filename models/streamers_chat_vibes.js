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
        chat_vibe_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "chat_vibes",
            },
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "streamers_chat_vibes",
        schema: "public",
        timestamps: false,
      }
    );
    return StreamersChatVibes;
  }
}
