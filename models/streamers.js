/* jshint indent: 2 */

const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  return Streamers.init(sequelize, DataTypes);
};

class Streamers extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        user_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        display_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        streamer_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        is_partner: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        is_fulltime: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        uses_cam: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        mature_stream: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        dob_year: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        logo: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "streamers",
        schema: "public",
        timestamps: false,
      }
    );
    return Streamers;
  }
}
