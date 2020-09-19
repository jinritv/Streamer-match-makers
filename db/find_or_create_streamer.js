const { getSequelizeFromConfig } = require("./db");
const { Categories, Languages, Locations, Nationalities, StreamersStats,
  Streamers, Tags, Vibes } = require("../models/models");
const { validateData } = require("../validation/validator");

/**
 * Method to add a streamer to DB (if new) or update it (if exists).
 * 
 * streamerData is JSON object whose keys are defined in data_schema.js
 * This function will first validate the input, try creating or updating in DB,
 * and return success or errors
 */
async function findOrCreateStreamerFromData(streamerData) {
  const [data, errors] = validateData(streamerData);
  if(errors && Object.keys(errors).length > 0) {
    return { validationErrors: errors };
  }

  //console.log("data: " + JSON.stringify(data, null, 2));

  const sequelize = getSequelizeFromConfig();
  // Update DB from data
  try {
    // Wrap all queries in one transaction
    await sequelize.transaction(async(tx) => {
      // Step 1. Find or create streamer model in streamers table
      const streamerModel = await findOrCreateStreamer(data);
      // Step 2. Find or create streamer_stats
      await findOrCreateStreamerStat(streamerModel, data);
      // Step 3. Set many-to-many relations
      await findOrCreateCategories(streamerModel, data.categories);  // Categories
      await findOrCreateLanguages(streamerModel, data.languages);  // Languages
      await findOrCreateLocations(streamerModel, data.locations);  // Locations
      await findOrCreateNationalities(streamerModel, data.nationalities);  // Nationalities
      await findOrCreateTags(streamerModel, data.tags);  // Tags
      await findOrCreateVibes(streamerModel, data.vibes);  // Vibes

      // TODO: Add collab relations
    });
  } catch(error) {
    // Automatically rolled back.
    console.log("Error: " + error);
    return { dbErrors: error.message };
  }
  console.log("End of method")
  return {};
}

// Create or update streamers table. Returns streamer model
async function findOrCreateStreamer(data) {
  const [model, _] = await Streamers.findOrBuild({
    where: {user_name: data.user_name},
  });
  model.set({
    user_name: data.user_name,
    display_name: data.display_name,
    streamer_name: data.streamer_name,
    is_partner: data.is_partner,
    is_fulltime: data.is_fulltime,
    uses_cam: data.uses_cam,
    mature_stream: data.mature_stream,
    dob_year: data.dob_year,
    logo: data.logo,
    description: data.description,
  });
  return await model.save();
}

// Create or update streamers_stats table and update association with streamer
async function findOrCreateStreamerStat(streamerModel, data) {
  // Find or build by streamer_id (if built, not saved into DB yet)
  const [model, _] = await StreamersStats.findOrBuild({
    where: {streamer_id: streamerModel.id},
  });
  model.set({
    followers: data.followers,
    voice: data.voice,
    avg_viewers: data.avg_viewers,
    avg_stream_duration: data.avg_stream_duration,
    viewer_participation: data.viewer_participation,
  });
  await model.save();
}

// Update categories table and update association with streamer
async function findOrCreateCategories(streamerModel, category_names) {
  console.log("category names: " + category_names);
  const categoryModels = await findOrCreateNames(Categories, "category", category_names);
  await streamerModel.setCategories(categoryModels);
}

// Update languages table and update association with streamer
async function findOrCreateLanguages(streamerModel, language_names) {
  const languageModels = await findOrCreateNames(Languages, "language", language_names);
  await streamerModel.setLanguages(languageModels);
}

// Update locations table and update association with streamer
async function findOrCreateLocations(streamerModel, location_names) {
  const locationModels = await findOrCreateNames(Locations, "location", location_names);
  await streamerModel.setLocations(locationModels);
}

// Update nationalities table and update association with streamer
async function findOrCreateNationalities(streamerModel, nationality_names) {
  const nationalityModels = await findOrCreateNames(Nationalities, "nationality", nationality_names);
  await streamerModel.setNationalities(nationalityModels);
}

// Update tags table and update association with streamer
async function findOrCreateTags(streamerModel, tag_names) {
  const tagModels = await findOrCreateNames(Tags, "tag", tag_names);
  await streamerModel.setTags(tagModels);
}

// Update vibes table and update association with streamer
async function findOrCreateVibes(streamerModel, vibe_names) {
  const vibeModels = await findOrCreateNames(Vibes, "vibe", vibe_names);
  await streamerModel.setVibes(vibeModels);
}

// Generic internal function to find-or-create names in table.
async function findOrCreateNames(modelClass, columnName, names) {
  names = names || [];
  return Promise.all(
    names.map(async (name) => {
      const [model, _] = await modelClass.findOrCreate({where: {[columnName]: name}});
      return model;
    })
  );
}


module.exports = {findOrCreateStreamerFromData};

//findOrCreateStreamerFromData(tempData);
const tempData = {
  user_name: "name",
  display_name: "이름",
  streamer_name: "test name",
  is_partner: null,
  is_fulltime: null,
  uses_cam: null,
  mature_stream: null,
  dob_year: null,
  logo: null,
  description: null,
  followers: null,
  voice: null,
  avg_viewers: 30,
  avg_stream_duration: null,
  viewer_participation: null,
  categories: ["cat1", "cat2", "cat3"],
  languages: ["lang1", "lang2", "lang3"],
  locations: ["location1"],
  nationalities: ["nationality1", "nation2"],
  tags: ["tag2", "tag3"],
  vibes: ["vibe1", "vibe2", "vibe_new"],
}
