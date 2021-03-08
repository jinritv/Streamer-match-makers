// Import all models into one file

const { getSequelizeFromConfig } = require("../db/db");
const sequelize = getSequelizeFromConfig();
const { DataTypes } = require("sequelize");

const Categories = require("./categories")(sequelize, DataTypes);
const Languages = require("./languages")(sequelize, DataTypes);
const Streamers = require("./streamers")(sequelize, DataTypes);
const Vibes = require("./vibes")(sequelize, DataTypes);
const ChatVibes = require("./chatvibes")(sequelize, DataTypes);

const StreamersCategories = require("./streamers_categories")(sequelize,DataTypes);
const StreamersLanguages = require("./streamers_languages")(sequelize,DataTypes);
const StreamersVibes = require("./streamers_vibes")(sequelize, DataTypes);
const StreamersChatVibes = require("./streamers_chatvibes")(sequelize, DataTypes);
const StreamersStats = require("./streamers_stats")(sequelize, DataTypes);


// Define association
// streamers & streamers_stats tables
Streamers.hasOne(StreamersStats, { foreignKey: "streamer_id" });

// streamers & categories tables
Streamers.belongsToMany(Categories, {
  through: StreamersCategories,
  foreignKey: "streamer_id",
  otherKey: "category_id",
});
Categories.belongsToMany(Streamers, {
  through: StreamersCategories,
  foreignKey: "category_id",
  otherKey: "streamer_id",
});

// streamers & languages tables
Streamers.belongsToMany(Languages, {
  through: StreamersLanguages,
  foreignKey: "streamer_id",
  otherKey: "language_id",
});
Languages.belongsToMany(Streamers, {
  through: StreamersLanguages,
  foreignKey: "language_id",
  otherKey: "streamer_id",
});

// streamers & chat vibes tables
Streamers.belongsToMany(ChatVibes, {
  through: StreamersChatVibes,
  foreignKey: "streamer_id",
  otherKey: "chatvibe_id",
});
ChatVibes.belongsToMany(Streamers, {
  through: StreamersChatVibes,
  foreignKey: "chatvibe_id",
  otherKey: "streamer_id",
});

// streamers & vibes tables
Streamers.belongsToMany(Vibes, {
  through: StreamersVibes,
  foreignKey: "streamer_id",
  otherKey: "vibe_id",
});
Vibes.belongsToMany(Streamers, {
  through: StreamersVibes,
  foreignKey: "vibe_id",
  otherKey: "streamer_id",
});

module.exports = {
  Categories,
  Languages,
  StreamersCategories,
  StreamersLanguages,
  StreamersStats,
  StreamersVibes,
  StreamersChatVibes,
  Streamers,
  Vibes,
  ChatVibes
};
