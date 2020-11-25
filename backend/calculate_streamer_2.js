
const {Op} = require("sequelize");
const {Streamers, StreamersStats, Languages, Categories, StreamersNationalities} = require("../models/models");

const SCORE_NEAR_THRESHOLD = {
  age: 5,
  average_viewers: 300,
}

// holds the values for the 'Points' of each attribute (an alternative to weighting?)
let ATTRIBUTE_POINTS = {
  age: 0.5,
  average_viewers: 1.0,
  languages: 1.0,
  content: 1.5,
  watchtime: 1.0,
}

// total of maximum score
let TOTAL_ATTRIBUTES =  0;


// key is content filter (input)
// value is list of streamer category that can be considered
// as criteria of the filter
// Ex: If input is cooking, streamer must have cooking in it's category
// but if input is food, streamer can have either food, or cooking
const CAT_MAP = {
  "dancing": ["dancing"],
  "irl": ["irl", "irl outdoors"],
  "music": ["music & performing arts", "singing", "piano", "music"],
  "sciencetech": ["science & technology", "geoguessr"],
  // HACK: For now, recreated_database.js splites categories in spreadsheet by comma or slash,
  // resulting in "Just Chatting (yoga, cooking)" splited into "Just Chatting (yoga" and "cooking)"
  // Should be fixed later
  "yoga": ["just chatting (yoga"],
  "movies": ["movies with viewers on discord"],
  "outdoors": ["irl outdoors", "travel"],
  "food": ["food", "cooking", "pepega cooking"],
  "cooking": ["cooking", "pepega cooking"],
  "ASMR": ["asmr"],
  "games": ["games", "pepega gaming", "half-life", "pubg"],
  "justchatting": ["irl", "just chatting", "pepega chatting"],
}


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

  ATTRIBUTE_POINTS = Object.assign({}, ATTRIBUTE_POINTS, prefs.ranks)
  TOTAL_ATTRIBUTES = 0;
  for (const [k, v] of Object.entries(ATTRIBUTE_POINTS)) {
    let num_v = Number(v) || 3; // convert values to ints. For some reason they are converted to string when sent from the client.
    ATTRIBUTE_POINTS[k] = num_v;
    TOTAL_ATTRIBUTES += num_v;
  }

  /* 
  *****************************
  *
  * NOTE: as of Oct 13, we're moving away from SQL queries and instead are
  * implementing a scoring/weighting system, where all streamer's attributes
  * will be given a value, either 1 or 0 (to start).
  * 
  * A value of 1 means that the streamer HAS this attribute
  * A value of 0 means the streamer does NOT have it
  * 
  * Future updates will see these values be adjusted as needed (using decimals < 1), 
  * but for now we are starting with boolean.
  ******* 
  */

  // Get all the streamers from the database
  const allStreamersArray = await Streamers.findAll({
    // we only need a few columns from the main Streamer table
    attributes:['id','user_name', 'dob_year','logo'],
    // we want to include the other associated tables such as StreamerStats, Languages, etc
    include:{ all: true, nested: true }
  });
  // we only want the values from the DB so we have to run the .toJSON() function on the array we got from the query
  const allStreamers = JSON.parse(JSON.stringify(allStreamersArray));
  //console.log(allStreamers)
  // for each streamer we run the matchingFunction to get a value
  const matchResult = matchStreamers(prefs, allStreamers);
  let matchedStreamers = matchResult[0];
  let topStats = matchResult[1];

  // get required data for our streamers
  let orQuery = [];
  matchedStreamers.forEach(m => {
    orQuery.push({
      id: m.id,
    })
  });
  let rows = await Streamers.findAll({
    attributes: ['id', 'user_name','logo'],
    where: {
      [Op.or]: orQuery,
    }
  });

  let streamersMap = {};
  rows.forEach(r => {
    streamersMap[r.id] = r;
  });

  // add the match value to the result
  const matchedStreamersResult = matchedStreamers.map(streamer => {
    if (!(streamer.id in streamersMap)) {
      throw "Streamer id ${streamer.id} not found in DB";
    }
    let r = streamersMap[streamer.id];
    let streamerObj = Object.assign({}, {id: r.id, user_name: r.user_name, logo: r.logo });
    streamerObj.match_value = streamer.match_percent; // add our calculated match %
    return streamerObj;
  })

  callback({
    "result": matchedStreamersResult,
    "stats": topStats,
  }, null);

  /*
  // Two different types of queries needed for Sequelize
  const whereQuery = {};  // fields in streamers table
  whereQuery.dob_year = {
    [Op.between]: getStreamerAgeRange(prefs.age)
  };

  const includeQuery = [];  // fields in other tables

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
  */
}



/** THIS IS NOT COMPLETE!

  The basic matching algorithm is Jaccard index, essentially:

  * for each streamer, we count how many attributes are shared with the user's preferences

  * we divide this number by the total number of unique attributes from both the user's and streamer's sets

  * then multiply by 100 to get a percentage value. 
 
  * 
*/

function matchStreamers(prefs, streamers){
  // stats to help score debugging
  let stats = {};

  // array to store the matched streamers
  let matchValues = [];
  let preferredLanguages = getLanguageNames(prefs.languages);
  let normalizedWatchtime = normalizeWatchtime(prefs.watchtime);
  console.log("Input categories", prefs.content);
  console.log("Normalized watchtime", normalizedWatchtime);

  streamers.forEach(streamer=>{
    // create an entry for the streamer in the score object
    let scores = 0.0;
    stats[streamer.id] = {
      "Age": 0,
      "Viewers": 0,
      "Language": 0,
      "Content": 0,
      "Watchtime": 0,
    };

    // check against age preference
    if(streamer.dob_year){
      let DOBrange = getStreamerAgeRange(prefs.age);
      let score = countNearScore(
        ATTRIBUTE_POINTS.age,
        streamer.dob_year,
        DOBrange[0],
        DOBrange[1],
        SCORE_NEAR_THRESHOLD.age,
      );
      scores += score;
      stats[streamer.id]["Age"] = Math.ceil(score / ATTRIBUTE_POINTS.age * 100);
    }

    // check against average viewers preference
    if(streamer.StreamersStat){
      let viewerRange = getMinMaxViewers(prefs.average_viewers);
      let score = countNearScore(
        ATTRIBUTE_POINTS.average_viewers,
        streamer.StreamersStat.avg_viewers,
        viewerRange[0],
        viewerRange[1],
        SCORE_NEAR_THRESHOLD.average_viewers,
      );
      scores += score;
      stats[streamer.id]["Viewers"] = Math.ceil(score / ATTRIBUTE_POINTS.average_viewers * 100);
    }

    // check against language preference
    // get the streamers and the user's language arrays
    let totalLangMatch = 0;
    let streamersLanguages = streamer.Languages.map(lang=>lang.language);
    preferredLanguages.forEach(strLang=>{
      if(streamersLanguages.includes(strLang)){
        totalLangMatch += 1;
     }
    });
    if (preferredLanguages.length != 0) {
      let langScore = totalLangMatch * ATTRIBUTE_POINTS.languages / preferredLanguages.length;
      scores += langScore;
      stats[streamer.id]["Language"] = Math.ceil(langScore / ATTRIBUTE_POINTS.languages * 100);
    }

    //check against stream content
    let totalCatMatch = 0;
    let streamersCategories = streamer.Categories.map(cat=>cat.category);
    prefs.content.forEach(parentCat=>{
      if (!(parentCat in CAT_MAP)) {
        throw `${parentCat} does not exist in category map`
      }

      let catMap = CAT_MAP[parentCat];
      for (var i = 0; i < catMap.length; i++) {
        if(streamersCategories.includes(catMap[i])){
          totalCatMatch += 1;
          break
        }
      }
    });
    if (prefs.content.length != 0) {
      let catScore = totalCatMatch * ATTRIBUTE_POINTS.content / prefs.content.length;
      scores += catScore;
      stats[streamer.id]["Content"] = Math.ceil(catScore / ATTRIBUTE_POINTS.content * 100);
    }

    // check for watch time
    let watchtimeScore = calculateWatchtimeScore(
      normalizedWatchtime,
      streamer.StreamersStat.start_stream,
      streamer.StreamersStat.avg_stream_duration
    ) * ATTRIBUTE_POINTS.watchtime;
    scores += watchtimeScore;
    stats[streamer.id]["Watchtime"] = Math.ceil(watchtimeScore / ATTRIBUTE_POINTS.watchtime * 100);

    // finally calculate the match % for our matched streamers and add them to the object we return back to the client
    let similarity = Math.round((scores/TOTAL_ATTRIBUTES)*100);
    matchValues.push({
      id: streamer.id,
      streamer:streamer.user_name,
      avg_viewer: streamer.StreamersStat.avg_viewers,
      match_percent:similarity
    });
  })
  
  // sort the streamers
  matchValues.sort(orderStreamers);

  // we only want top 5
  let topStreamers = matchValues.slice(0,5);
  let topStats = collectStats(topStreamers, stats);
  console.log(topStreamers);
  return [topStreamers, topStats];
}

// sorts the list of streamers by match percentage (highest first)
// if percentage is the same, get random so we get different streamer
function orderStreamers(a, b) {
  if (a.match_percent > b.match_percent) {
    return -1;
  }
  if (a.match_percent < b.match_percent) {
    return 1;
  }

  if (Math.random() > 0.5) {
    return 1;
  }

  return -1;
}

function collectStats(topStreamers, stats) {
  let topStats = {};
  topStreamers.forEach(streamer=>{
    topStats[streamer.id] = stats[streamer.id];
  });
  return topStats
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

// base score is score multiplier
// val is actual value (input)
// minimum and max value is range for the val to get 100% base score
// threshold is maximum difference of value with range
// value difference larger than threshold = 0
function countNearScore(base_score, val, min_val, max_val, threshold) {
  if (val >= min_val && val <= max_val) {
    return base_score
  }

  let abs_diff = threshold + 1;
  if (val < min_val) {
    abs_diff = min_val - val;
  } else if (val > max_val) {
    abs_diff = val - max_val;
  }

  if (abs_diff > threshold) {
    return 0
  }

  return base_score * Math.log(threshold + 1 - abs_diff) / Math.log(threshold + 1);
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

  const maxDOB = Number(thisYear-ageRange.min || thisYear-25);
  const minDOB = Number(thisYear-ageRange.max || thisYear-75);
  
  return [minDOB, maxDOB];
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
    "chinese": "cn",
    "french": "fr",
    "spanish": "es"
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

// only handle weekdays because thats all we have
// on DB
function normalizeWatchtime(input) {
  if (input == undefined || !input.weekdays) {
    return null
  }

  let from = new Date("January 5 1980 " + input.weekdaysFrom);

  // handling next date
  let to_date = "5";
  if (parseInt(input.weekdaysFrom.replace(":", "")) > parseInt(input.weekdaysTo.replace(":", ""))) {
    to_date = "6";
  }
  let to = new Date("January "+to_date+" 1980 " + input.weekdaysTo);

  let fromT = new Date(from.getTime());
  fromT.setDate(fromT.getDate() + 1);
  let toT = new Date(to.getTime());
  toT.setDate(toT.getDate() + 1);

  let fromY = new Date(from.getTime());
  fromY.setDate(fromY.getDate() - 1);
  let toY = new Date(to.getTime());
  toY.setDate(toY.getDate() - 1);

  return [from, to, fromT, toT, fromY, toY]
}

// going to assume most streamers stream for 3 hours
// if not defined in DB
function calculateWatchtimeScore(input, start_time, stream_duration) {
  if (input == null) {
    return 1
  }

  if (start_time == null) {
    return 0
  }

  if (stream_duration == null) {
    stream_duration = 3;
  }

  let st_from = new Date("January 5 1980 "+start_time);
  let st_to = new Date("January 5 1980 "+start_time);
  st_to.setHours(st_to.getHours() + stream_duration);

  // current
  let s1 = compareTime(st_from, st_to, input[0], input[1]);
  if (s1 != 0) {
    return s1
  }

  // tomorrow
  let s2 = compareTime(st_from, st_to, input[2], input[3]);
  if (s2 != 0) {
    return s2
  }

  // yesterday
  return compareTime(st_from, st_to, input[4], input[5]);
}

function compareTime(st_from, st_to, d1, d2) {
  let watch_duration = d2 - d1;
  // check for full watchtime, stream duration is longer than input (within)
  // a   |   |   b
  // a: stream from
  // b: stream end
  // |: input
  if (d1 >= st_from && d2 <= st_to) {
    return 1
  }

  // input is longer than stream (surrounding)
  // |  a   b  |
  if (st_from >= d1 && st_to <= d2) {
    return 1
  }

  // partial early
  // | a | b
  if (d1 < st_from && d2 < st_to && d2 > st_from) {
    let watched = d2 - st_from;
    return watched *1.0 / watch_duration;
  }

  // partial late
  // a | b |
  if (st_from < d1 && st_to < d2 && d1 < st_to) {
    let watched = st_to - d1;
    return watched *1.0 / watch_duration;
  }

  // outside range
  return 0
}


module.exports = calculateStreamer
