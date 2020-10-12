
const {Op} = require("sequelize");
const {Streamers, StreamersStats, Languages, Categories} = require("../models/models");


/**
 * Main business logic to find a matching streamer from user answers.
 * No answer for a question means that user does not have preference,
 * so no streamer is filtered out for that question.
 * 
 * As of September 18, 2020, answers for streamer's age range is ignored,
 * because there is not enough data in DB and no feasible default value can be set.
 * 
 * Answers for follower_only stream is also ignored. No DB column is defined in diagram
 */
async function calculateStreamer(quizValues, callback) {
  // User answers passed from frontend
  const prefs = quizValues.UsersAnswers || {};  
  console.log(`UserAnswers:`,prefs);
  
  // Two different types of queries needed for Sequelize
  const whereQuery = {};  // fields in streamers table
  whereQuery.dob_year = {
    [Op.between]: getStreamerAgeRange(prefs.age)
  };


  const includeQuery = [];  // fields in other tables

  // Build query related to streamers table
  /*
  const usesCam = getYesOrNo(prefs.cam);
  if(usesCam !== null) {
    whereQuery.uses_cam = usesCam;
  }
  */

  /*
  const isMature = getYesOrNo(prefs.mature);
  if(isMature !== null) {
    whereQuery.mature_stream = getYesOrNo(prefs.mature);
  }
  */

  // Build query related to streamers_stats table
  const statWhereQuery = {};

  /*
  const voiceValue = getVoice(prefs.voice);
  if(voiceValue !== null) {
    statWhereQuery.voice = voiceValue;
  }
  */
  statWhereQuery.avg_viewers = {
    [Op.between]: getMinMaxViewers(prefs.average_viewers)
  };
  /*
  statWhereQuery.followers = {
    [Op.between]: getFollowerCountRange(prefs.follower_count)
  };
  */
  
  
  includeQuery.push({
    model: StreamersStats,
    where: statWhereQuery,
  });
  
  // Queries related to languages table
  const languageNames = getLanguageNames(prefs.languages);
  if(languageNames && languageNames.length > 0) {
    includeQuery.push({
      model: Languages,
      where: {language: languageNames}
    })
  }

  // Queries related to categories table
  const categories = getCategories(prefs.content);
  if(categories && categories.length > 0) {
    includeQuery.push({
      model: Categories,
      where: {category: categories}
    });
  }

  try {
    const streamers = await Streamers.findAll({where: whereQuery, include: includeQuery});
    
    // Usernames of matching streamers
    const usernames = streamers.map(streamer => streamer.user_name);
    console.log(`Found ${usernames.length} matching streamers`);
    console.log(`They are: ${usernames}`);

    // The search is broken so we send the first 5 entries from the DB so
    // we can at least handle the data properly client-side once the
    // query actually works.
    if(streamers.length === 0) {
      let fakeStreamersResult = await Streamers.findAll({
        attributes: ['user_name','logo'],
        where: {
          [Op.or]: [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 }
          ]
        }
      });

      // add some kind of match value in percentage (example 98% match)
      const matchedStreamers = fakeStreamersResult.map(streamer=> {
        let streamerObj = Object.assign({}, {user_name: streamer.user_name, logo: streamer.logo });
        let matchValue = Math.floor(Math.random() * 101); // some random value (for now)

        // if it's jinri, put a high match percentage :)
        if(streamer.user_name==='jinritv'){
          matchValue = 98;
        } 
        streamerObj.match_value = matchValue;
        return streamerObj;
      })
      callback(matchedStreamers, null);
    }
    else {  
      const result = {
        streamers: streamers,

      }
      callback(result, null);
    }
  }
  catch(error) {
    callback(null, error.message);
  }
  
}


function getMinMaxViewers(average_viewers) {
  // Frontend sends no values if user skipped the question.
  if(!average_viewers) {
    return [2500, 7500];
  }
  const minAvgViewer = Number(average_viewers.min || 2500);
  const maxAvgViewer = Number(average_viewers.max || 7500);
  return [minAvgViewer, maxAvgViewer];
}


function getFollowerCountRange(follower_count) {
  if(!follower_count || follower_count === "Less than 10000") {
    return [0, 10000];
  }
  if(follower_count === "between 10000 and 100000") {
    return [10000, 100000];
  }
  if(follower_count === "100000 to 1000000") {
    return [100000, 1000000];
  }
  return [0, 1000000] // Returns all if not selected
}

// the database only contains a column for the DOB year,
// not age, so we need to calculate that first
function getStreamerAgeRange(ageRange) {
  let thisYear = new Date().getFullYear();

  const minDOB = Number(thisYear-ageRange.min || thisYear-25);
  const maxDOB = Number(thisYear-ageRange.max || thisYear-75);
  
  return [minDOB, maxDOB];
}


function getCategories(contents) {
  if(!contents) {
    return [];
  }

  // Match frontend content names and backend category names
  // TODO: move this out of function to prevent duplicate creations per function call
  const nameMap = {
    "dancing": ["dancing"],
    "irl": ["irl", "pepega chatting", "just chatting"],
    "music": ["music & performing arts", "singing", "piano", "music"],
    "sciencetech": ["science & technology", "geoguessr"],
    // HACK: For now, recreated_database.js splites categories in spreadsheet by comma or slash,
    // resulting in "Just Chatting (yoga, cooking)" splited into "Just Chatting (yoga" and "cooking)"
    // Should be fixed later
    "yoga": ["just chatting (yoga"],
    "movies": ["movies with viewers on discord"],
    "outdoors": ["irl outdoors", "travel"],
    "food": ["food", "cooking"],
    "cooking": ["food", "pepega cooking", "cooking"],
    "ASMR": ["asmr"],
    "games": ["games", "pepega gaming"],
    "justchatting": ["irl", "pepega chatting", "just chatting"],
  }

  const allCategories = [];
  for(let content of contents) {
    const categories = nameMap[content] || [];
    allCategories.push(...categories);
  }
  // Unique categories
  return [...new Set(allCategories)];
}


function getLanguageNames(languages) {
  // Frontend has long language name, DB has short language names.
  if(!languages) {
    return [];
  }
  const nameMap = {
    "thai": "th",
    "japanese": "jp",
    "korean": "kr",
    "english": "en",
    "chinese": "cn"
  };
  return languages.map(lang => nameMap[lang]);
}


function getVoice(voice) {
  if(!voice) {
    return null;
  }
  return Number(voice.trim()[0]);
}


function getYesOrNo(condition) {
  if(!condition) {
    return false;
  }
  return condition.toString().trim().toLowerCase() === "yes";
}


module.exports = calculateStreamer