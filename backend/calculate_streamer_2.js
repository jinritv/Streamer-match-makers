
const {Op} = require("sequelize");
const {Streamers, StreamersStats, Languages, Categories} = require("../models/models");


async function calculateStreamer(quizValues, callback) {

  console.log("quizValues: ");
  console.log(JSON.stringify(quizValues, null, 2));
  //callback(null, new Error("temporary error"));

  const prefs = quizValues.UsersAnswers || {};  
  
  const whereQuery = {};
  const includeQuery = [];

  // Build query related to streamers table
  const usesCam = getYesOrNo(prefs.cam);
  if(usesCam !== null) {
    whereQuery.uses_cam = usesCam;
  }
  const isMature = getYesOrNo(prefs.mature);
  if(isMature !== null) {
    whereQuery.mature_stream = getYesOrNo(prefs.mature);
  }

  // Build query related to streamers_stats table
  const statWhereQuery = {};
  const voiceValue = getVoice(prefs.voice);
  if(voiceValue !== null) {
    statWhereQuery.voice = voiceValue;
  }
  statWhereQuery.avg_viewers = {
    [Op.between]: getMinMaxViewers(prefs.average_viewers)
  };
  statWhereQuery.followers = {
    [Op.between]: getFollowerCountRange(prefs.follower_count)
  };
  /*statWhereQuery.streamer_age = {
    [Op.between]: getStreamerAgeRange(prefs.age)
  };*/
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

  // followers_only is ignored. currently not in DB  
  console.log("WhereQuery: " + JSON.stringify(whereQuery));
  console.log("IncludeQuery: " + JSON.stringify(includeQuery));
  
  try {
    const streamers = await Streamers.findAll({where: whereQuery, include: includeQuery});

    console.log(streamers.length);
    if(streamers.length === 0) {
      callback({user_name: "No One!"}, null);
    }
    else {
      const usernames = streamers.map(streamer => streamer.user_name);
      console.log("usernames:" + usernames);
  
      const result = {
        user_name: usernames[0],
        //logo: "",
      }
      callback(result, null);
    }
  }
  catch(error) {
    callback(null, error.message);
  }
}


function getMinMaxViewers(average_viewers) {
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


function getStreamerAgeRange(ageRange) {
  if(!ageRange) {
    return [25, 75];
  }
  const minAge = Number(ageRange.min || 25);
  const maxAge = Number(ageRange.max || 75);
  return [minAge, maxAge];
}


function getCategories(contents) {
  // match frontend content names and backend category names
  const nameMap = {
    "dancing": ["dancing"],
    "irl": ["irl", "pepega chatting", "just chatting"],
    "music": ["music & performing arts", "singing", "piano", "music"],
    "sciencetech": ["science & technology", "geoguessr"],
    "yoga": ["just chatting (yoga"],
    "movies": ["movies with viewers on discord"],
    "outdoors": ["irl outdoors", "travel"],
    "food": ["food", "cooking"],
    "cooking": ["food", "pepega cooking", "cooking"],
    "ASMR": ["asmr"],
    "games": ["games", "pepega gaming"],
    "justchatting": ["irl", "pepega chatting", "just chatting"],
  }
  if(!contents) {
    return [];
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