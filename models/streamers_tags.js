/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return StreamersTags.init(sequelize, DataTypes);
};

class StreamersTags extends Sequelize.Model {
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
        tag_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: {
              tableName: "tags",
            },
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "streamers_tags",
        schema: "public",
        timestamps: false,
      }
    );
    return StreamersTags;
  }
}
