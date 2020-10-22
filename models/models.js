// Import all models into one file

const { getSequelizeFromConfig } = require("../db/db");
const sequelize = getSequelizeFromConfig();
const { DataTypes } = require("sequelize");

const Categories = require("./categories")(sequelize, DataTypes);
const Languages = require("./languages")(sequelize, DataTypes);
const Locations = require("./locations")(sequelize, DataTypes);
const Nationalities = require("./nationalities")(sequelize, DataTypes);
const StreamersCategories = require("./streamers_categories")(sequelize, DataTypes);
const StreamersCollabs = require("./streamers_collabs")(sequelize, DataTypes);
const StreamersLanguages = require("./streamers_languages")(sequelize, DataTypes);
const StreamersLocations = require("./streamers_locations")(sequelize, DataTypes);
const StreamersNationalities = require("./streamers_nationalities")(sequelize, DataTypes);
const StreamersStats = require("./streamers_stats")(sequelize, DataTypes);
const StreamersTags = require("./streamers_tags")(sequelize, DataTypes);
const StreamersVibes = require("./streamers_vibes")(sequelize, DataTypes);
const Streamers = require("./streamers")(sequelize, DataTypes);
const Tags = require("./tags")(sequelize, DataTypes);
const Vibes = require("./vibes")(sequelize, DataTypes);


// Define associations

// streamers & streamers_stats tables
Streamers.hasOne(StreamersStats, {foreignKey: "streamer_id"});

// streamers & categories tables
Streamers.belongsToMany(
  Categories, {through: StreamersCategories, foreignKey: "streamer_id", otherKey: "category_id"});
Categories.belongsToMany(
  Streamers, {through: StreamersCategories, foreignKey: "category_id", otherKey: "streamer_id"});

// streamers & languages tables
Streamers.belongsToMany(
  Languages, {through: StreamersLanguages, foreignKey: "streamer_id", otherKey: "language_id"});
Languages.belongsToMany(
  Streamers, {through: StreamersLanguages, foreignKey: "language_id", otherKey: "streamer_id"});

// streamers & locations tables
Streamers.belongsToMany(
  Locations, {through: StreamersLocations, foreignKey: "streamer_id", otherKey: "location_id"});
Locations.belongsToMany(
  Streamers, {through: StreamersLocations, foreignKey: "location_id", otherKey: "streamer_id"});

// streamers & nationalities tables
Streamers.belongsToMany(
  Nationalities, {through: StreamersNationalities, foreignKey: "streamer_id", otherKey: "nationality_id"});
Nationalities.belongsToMany(
  Streamers, {through: StreamersNationalities, foreignKey: "nationality_id", otherKey: "streamer_id"});

// streamers & tags tables
Streamers.belongsToMany(
  Tags, {through: StreamersTags, foreignKey: "streamer_id", otherKey: "tag_id"});
Tags.belongsToMany(
  Streamers, {through: StreamersTags, foreignKey: "tag_id", otherKey: "streamer_id"});

// streamers & vibes tables
Streamers.belongsToMany(
  Vibes, {through: StreamersVibes, foreignKey: "streamer_id", otherKey: "vibe_id"});
Vibes.belongsToMany(
  Streamers, {through: StreamersVibes, foreignKey: "vibe_id", otherKey: "streamer_id"});

// TODO: Add Collaboration associations later
// Streamers.belongsToMany(Streamers, {through: StreamersCollabs, as: "Streamer", foreignKey: "streamer_id", otherKey: "collab_with"});
// Streamers.belongsToMany(Streamers, {through: StreamersCollabs, as: "Collaborator", foreignKey: "collab_with", otherKey: "streamer_id"});

module.exports = {
  Categories,
  Languages,
  Locations,
  Nationalities,
  StreamersCategories,
  StreamersCollabs,
  StreamersLanguages,
  StreamersLocations,
  StreamersNationalities,
  StreamersStats,
  StreamersTags,
  StreamersVibes,
  Streamers,
  Tags,
  Vibes,
};
