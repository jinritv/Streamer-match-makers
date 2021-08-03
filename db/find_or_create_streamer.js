const { getSequelizeFromConfig } = require("./db");
const {
  Categories,
  Languages,
  StreamersStats,
  Streamers,
  Vibes,
  ChatVibes
} = require("../models/models");
const { validateData } = require("../validation/validator");
const { isNotEmpty } = require("../util/objectutil");

/**
 * Method to add a streamer to DB (if new) or update it (if exists).
 *
 * streamerData is JSON object whose keys are defined in data_schema.js
 * This function will first validate the input, try creating or updating in DB,
 * and return success or errors
 */
async function findOrCreateStreamerFromData(streamerData) {
  const [data, errors] = validateData(streamerData);
  if (isNotEmpty(errors)) {
    return { validationErrors: errors };
  }

  //console.log("data: " + JSON.stringify(data, null, 2));

  const sequelize = getSequelizeFromConfig();
  // Update DB from data
  try {
    // Wrap all queries in one transaction
    await sequelize.transaction(async (tx) => {
      // Step 1. Find or create streamer model in streamers table
      const streamerModel = await findOrCreateStreamer(data);
      // Step 2. Find or create streamer_stats
      await findOrCreateStreamerStat(streamerModel, data);
      // Step 3. Set many-to-many relations
      await findOrCreateCategories(streamerModel, data.categories); // Categories
      await findOrCreateLanguages(streamerModel, data.languages); // Languages
      await findOrCreateStreamerVibes(streamerModel, data.streamer_vibes); // Streamer Vibes
      await findOrCreateChatVibes(streamerModel, data.chat_vibes); // Chat Vibes

      // TODO: Add collab relations
    });
  } catch (error) {
    // Automatically rolled back.
    console.log("Error: " + error);
    return { dbErrors: error.message };
  }
  console.log("End of method");
  return {};
}

// Create or update streamers table. Returns streamer model
async function findOrCreateStreamer(data) {
  const [model, _] = await Streamers.findOrBuild({
    where: { user_name: data.user_name },
  });
  model.set({
    user_name: data.user_name,
    nickname: data.nickname,
    gender: data.gender,
    is_partner: data.is_partner,
    uses_cam: data.uses_cam,
    mature_stream: data.mature_stream,
    logo: data.logo,
    description: data.description,
  });
  return await model.save();
}

// Create or update streamers_stats table and update association with streamer
async function findOrCreateStreamerStat(streamerModel, data) {
  // Find or build by streamer_id (if built, not saved into DB yet)
  const [model, _] = await StreamersStats.findOrBuild({
    where: { streamer_id: streamerModel.id },
  });
  model.set({
    followers: data.followers,
    voice: data.voice,
    avg_viewers: data.avg_viewers,
    avg_stream_duration: data.avg_stream_duration,
    avg_start_time: data.avg_start_time,
    viewer_participation: data.viewer_participation,
    streams_per_week: data.streams_per_week,
    stream_start_date: data.stream_start_date,
    chat_mode: data.chat_mode
  });
  await model.save();
}

// Update categories table and update association with streamer
async function findOrCreateCategories(streamerModel, category_names) {

  const categoryModels = await findOrCreateNames(
    Categories,
    "category",
    category_names
  );
  await streamerModel.setCategories(categoryModels);
}

// Update languages table and update association with streamer
async function findOrCreateLanguages(streamerModel, language_names) {
  const languageModels = await findOrCreateNames(
    Languages,
    "language",
    language_names
  );
  await streamerModel.setLanguages(languageModels);
}

// Update vibes table and update association with streamer
async function findOrCreateVibes(streamerModel, vibe_names) {
  const vibeModels = await findOrCreateNames(Vibes, "vibe", vibe_names);
  await streamerModel.setVibes(vibeModels);
}
// Update vibes table and update association with streamer
async function findOrCreateChatVibes(streamerModel, vibe_names) {
  const vibeModels = await findOrCreateNames(ChatVibes, "chatvibe", vibe_names);
  await streamerModel.setChatVibes(vibeModels);
}

// Generic internal function to find-or-create names in table.
async function findOrCreateNames(modelClass, columnName, names) {
  names = names || [];
  return Promise.all(
    names.map(async (name) => {
      const [model, _] = await modelClass.findOrCreate({
        where: { [columnName]: name },
      });
      return model;
    })
  );
}

module.exports = { findOrCreateStreamerFromData };
