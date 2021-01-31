/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return StreamersCategories.init(sequelize, DataTypes);
};

class StreamersCategories extends Sequelize.Model {
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
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: {
              tableName: "categories",
            },
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "streamers_categories",
        schema: "public",
        timestamps: false,
      }
    );
    return StreamersCategories;
  }
}
