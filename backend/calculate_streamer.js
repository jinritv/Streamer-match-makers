const { Op } = require("sequelize");
const { Streamers } = require("../models/models");
const { getDatabase } = require("./db/get_database");
const TwitchApi = require("./twitch_api");

// holds the default values for the 'Points' of each attribute.
const ATTRIBUTE_POINTS_DEFAULTS = {
  average_viewers: 1.0,
  languages: 1.0,
  content: 1.5,
  subonly: 1.0,
  mature: 1.0,
  chat_vibe: 1.0,
  streamer_vibe: 1.0,
  gender: 1.0,
};

// The user supplied weight value is going to be a value between 1 - 5 (equivalent to the number
// of stars selected. When processing the user's selection, the value will be divided by the
// following constant. With 5 total stars and a value of 5.0, all ATTRIBUTE_POINT values will be
// set to a value between [0.2 - 1.0]).
const ATTRIBUTE_POINTS_STAR_TOTAL = 5.0;

const SCORE_NEAR_THRESHOLD = {
  avg_viewers: 300,
};

// key is content filter (input)
// value is list of streamer category that can be considered
// as criteria of the filter
// Ex: If input is cooking, streamer must have cooking in it's category
// but if input is food, streamer can have either food, or cooking
const CAT_MAP = {
  justchatting: ["Just Chatting"],
  games: ["Games"],
  sciencetech: ["Science & Technology"],
  music: ["Music"],
  art: ["Art"],
  food: ["Food & Drink"],
  talk: ["Talk Shows & Podcasts"],
  maker: ["Makers & Crafting"],
  travel: ["Travel & Outdoors"],
  asmr: ["ASMR"],
  fitness: ["Fitness & Health"],
  events: ["Special Events"],
  sports: ["Sports"],
  politics: ["Politics"],
  quiz: ["Quiz Show"],
  crypto: ["Crypto"],
  stock: ["Stocks and Bonds"],
  casino: ["Casino"],
  board: ["Board Games"],
  bodyart: ["Beauty & Body Art"],
  tarot: ["Tarot"],
  makeup: ["Make-Up and Style"],
  sleep: ["Just Sleep - Meditate, Focus, Relax"],
  twitch: ["Twitch Plays"],

  /*dancing: ["dancing"],
  irl: ["irl", "irl outdoors"],
  music: ["music & performing arts", "singing", "piano", "music"],
  sciencetech: ["science & technology", "geoguessr"],
  // HACK: For now, recreated_database.js splites categories in spreadsheet by comma or slash,
  // resulting in "Just Chatting (yoga, cooking)" splited into "Just Chatting (yoga" and "cooking)"
  // Should be fixed later
  yoga: ["just chatting (yoga"],
  movies: ["movies with viewers on discord"],
  outdoors: ["irl outdoors", "travel"],
  food: ["food", "cooking", "pepega cooking"],
  cooking: ["cooking", "pepega cooking"],
  ASMR: ["asmr"],
  games: ["games", "pepega gaming", "half-life", "pubg"],
  justchatting: ["irl", "just chatting", "pepega chatting"],*/
};

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
  console.log(`UserAnswers:`, prefs);
  const db = getDatabase();

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
  const allStreamers = db.getAllStreamers();

  // for each streamer we run the matchingFunction to get a value
  const matchResult = matchStreamers(prefs, allStreamers);
  let matchedStreamers = matchResult[0];
  let topStats = matchResult[1];

  const streamersMap = {};
  for (const streamer of matchedStreamers) {
    streamersMap[streamer.id] = streamer;
  }

  // give updated link to logo and bio
  await updateStreamerObjWithTwitchData(Object.values(streamersMap));

  // add the match value to the result
  const matchedStreamersResult = matchedStreamers.map((streamer) => {
    if (!(streamer.id in streamersMap)) {
      throw "Streamer id ${streamer.id} not found in DB";
    }
    let r = streamersMap[streamer.id];
    let streamerObj = Object.assign(
      {},
      {
        id: r.id,
        user_name: r.user_name,
        logo: r.logo,
        bio: r.bio,
        languages: r.languages,
      }
    );
    streamerObj.match_value = streamer.match_percent; // add our calculated match %
    return streamerObj;
  });

  callback(
    {
      result: matchedStreamersResult,
      stats: topStats,
    },
    null
  );
}

async function updateStreamerObjWithTwitchData(streamers) {
  const user_names = streamers.map((streamer) => streamer.user_name);

  const users = await TwitchApi.getUsers(user_names);
  streamers.forEach((streamer) => {
    const user = users[streamer.user_name];
    streamer.bio = user.description;
    streamer.logo = user.profile_image_url;
  });
}

/** THIS IS NOT COMPLETE!

  The basic matching algorithm is Jaccard index, essentially:
z
  * for each streamer, we count how many attributes are shared with the user's preferences

  * we divide this number by the total number of unique attributes from both the user's and streamer's sets

  * then multiply by 100 to get a percentage value. 
 
  * 
*/

function matchStreamers(prefs, streamers) {
  // stats to help score debugging
  let stats = {};

  // setup question ranks
  let results = processRanks(prefs.ranks);
  const RANK_SCORE = results[0];
  const TOTAL_SCORE = results[1];
  console.log("Rank Score: ", RANK_SCORE);
  console.log("Total Score (100%): ", TOTAL_SCORE);

  // array to store the matched streamers
  let matchValues = [];
  let preferredLanguages = getLanguageNames(prefs.languages);
  //let normalizedWatchtime = normalizeWatchtime(prefs.watchtime);
  console.log("Input categories", prefs.content);
  //console.log("Normalized watchtime", normalizedWatchtime);

  streamers.forEach((streamer) => {
    // create an entry for the streamer in the score object
    let scores = 0.0;
    stats[streamer.id] = {
      Viewers: 0,
      Language: 0,
      Content: 0,
      Maturity: 0,
      "Chat Mode": 0,
      "Chat Vibe": 0,
      Gender: 0,
    };

    // check against average viewers preference
    if (streamer.avg_viewers) {
      let viewerRange = getMinMaxViewers(prefs.average_viewers);
      let score = countNearScore(
        RANK_SCORE.average_viewers,
        streamer.avg_viewers,
        viewerRange[0],
        viewerRange[1],
        SCORE_NEAR_THRESHOLD.avg_viewers
      );
      scores += score;
      stats[streamer.id]["Viewers"] = Math.round(
        (score / RANK_SCORE.average_viewers) * 100
      );
    }

    // check against language preference
    // get the streamers and the user's language arrays
    let totalLangMatch = 0;
    preferredLanguages.forEach((strLang) => {
      // Database has uppercased language name code: EN, KR, CN etc
      if (streamer.languages.includes(strLang.toUpperCase())) {
        totalLangMatch += 1;
      }
    });
    if (preferredLanguages.length != 0) {
      let langScore =
        (totalLangMatch * RANK_SCORE.languages) / preferredLanguages.length;
      scores += langScore;
      stats[streamer.id]["Language"] = Math.round(
        (langScore / RANK_SCORE.languages) * 100
      );
    }

    //check against stream content
    let totalCatMatch = 0;
    prefs.content.forEach((parentCat) => {
      if (!(parentCat in CAT_MAP)) {
        throw `${parentCat} does not exist in category map`;
      }

      let catMap = CAT_MAP[parentCat];
      for (var i = 0; i < catMap.length; i++) {
        if (streamer.categories.includes(catMap[i])) {
          totalCatMatch += 1;
          break;
        }
      }
    });
    if (prefs.content.length != 0) {
      let catScore =
        (totalCatMatch * RANK_SCORE.content) / prefs.content.length;
      scores += catScore;
      stats[streamer.id]["Content"] = Math.round(
        (catScore / RANK_SCORE.content) * 100
      );
    }

    // Sub only check
    // TODO: mapping model not completed, only handling 'all' choice
    let chatModeScore = 0.5;
    if (prefs.subonly == "all") {
      chatModeScore = 1;
    }
    scores += chatModeScore * RANK_SCORE.subonly;
    stats[streamer.id]["Chat Mode"] = chatModeScore * 100;

    // maturity check
    if (prefs.mature) {
      let bMature = prefs.mature == "true" ? true : false;
      let score = 0;
      if (streamer.mature_stream == null) {
        score = 0.5;
      } else if (
        (bMature && streamer.mature_stream == 1) ||
        (!bMature && streamer.mature_stream == 0)
      ) {
        score = 1;
      }

      scores += score * RANK_SCORE.mature;
      stats[streamer.id]["Maturity"] = score * 100;
    }

    // chat vibe check
    let matchVibes = 0;
    prefs.chat_vibe.forEach((vibe) => {
      if (streamer.chat_vibes.includes(vibe.toLowerCase())) {
        matchVibes += 1;
      }
    });

    if (prefs.chat_vibe.length != 0) {
      let vibeScore =
        (matchVibes * RANK_SCORE.chat_vibe) / prefs.chat_vibe.length;
      scores += vibeScore;
      stats[streamer.id]["Chat Vibe"] = Math.round(
        (vibeScore / RANK_SCORE.chat_vibe) * 100
      );
    }

    // Streamer vibe check
    let matchVibes_S = 0;
    prefs.streamer_vibe.forEach((vibe) => {
      if (streamer.streamer_vibes.includes(vibe.toLowerCase())) {
        matchVibes_S += 1;
      }
    });

    if (prefs.streamer_vibe.length != 0) {
      let vibeScore_S =
        (matchVibes_S * RANK_SCORE.streamer_vibe) / prefs.streamer_vibe.length;
      scores += vibeScore_S;
      stats[streamer.id]["Streamer Vibe"] = Math.round(
        (vibeScore_S / RANK_SCORE.streamer_vibe) * 100
      );
    }

    //check for gender preference
    // if they chose male and female, its 100% match anyways, or 0

    if (
      prefs.gender[0].toUpperCase() == streamer.gender ||
      prefs.gender == "nopreference"
    ) {
      // we receive a string of 'male', 'female', or "no preference" so we convert to M or F
      scores += 1 * RANK_SCORE.gender;
      stats[streamer.id]["Gender"] = 100; // set 100% match
    } else {
      stats[streamer.id]["Gender"] = 0; // set 100% match
    }

    // // check for watch time
    // let watchtimeScore =
    //   calculateWatchtimeScore(
    //     normalizedWatchtime,
    //     streamer.StreamersStat.start_stream,
    //     streamer.StreamersStat.avg_stream_duration
    //   ) * ATTRIBUTE_POINTS.watchtime;
    // scores += watchtimeScore;
    // stats[streamer.id]["Watchtime"] = Math.ceil(
    //   (watchtimeScore / ATTRIBUTE_POINTS.watchtime) * 100
    // );

    // finally calculate the match % for our matched streamers and add them to the object we return back to the client
    let similarity = Math.round((scores / TOTAL_SCORE) * 100);
    streamer.match_percent = similarity;
    matchValues.push(streamer);
  });

  // sort the streamers
  matchValues.sort(orderStreamers);

  // we only want top 5
  let topStreamers = matchValues.slice(0, 9);
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
  topStreamers.forEach((streamer) => {
    topStats[streamer.id] = stats[streamer.id];
  });
  return topStats;
}

function getMinMaxViewers(average_viewers) {
  // Frontend sends no values if user skipped the question.
  if (!average_viewers) {
    return [2500, 7500];
  }

  let minAvgViewer = Number(average_viewers.min || 2500);
  let maxAvgViewer = Number(average_viewers.max || 7500);

  // frontend doesnt' send over 2000 for max value (it said 2000+ on the UI)
  // so we modify max value if user submit 2000+ to also include large streamers
  if (maxAvgViewer == 2000) {
    maxAvgViewer = 10000;
  }
  return [minAvgViewer, maxAvgViewer];
}

// base score is score multiplier
// val is actual value (input)
// minimum and max value is range for the val to get 100% base score
// threshold is maximum difference of value with range
// value difference larger than threshold = 0
function countNearScore(base_score, val, min_val, max_val, threshold) {
  if (val >= min_val && val <= max_val) {
    return base_score;
  }

  let abs_diff = threshold + 1;
  if (val < min_val) {
    abs_diff = min_val - val;
  } else if (val > max_val) {
    abs_diff = val - max_val;
  }

  if (abs_diff > threshold) {
    return 0;
  }

  return (
    (base_score * Math.log(threshold + 1 - abs_diff)) / Math.log(threshold + 1)
  );
}

function getFollowerCountRange(follower_count) {
  if (!follower_count || follower_count === "Less than 10000") {
    return [0, 10000];
  }
  if (follower_count === "between 10000 and 100000") {
    return [10000, 100000];
  }
  if (follower_count === "100000 to 1000000") {
    return [100000, 1000000];
  }
  return [0, 1000000]; // Returns all if not selected
}

function getLanguageNames(languages) {
  // Frontend has long language name, DB has short language names.
  if (!languages) {
    return [];
  }

  const nameMap = {
    thai: "TH",
    japanese: "JP",
    korean: "KR",
    english: "EN",
    mandarin: "CN",
    french: "FR",
    spanish: "ES",
    russian: "RU",
    vietnamese: "VI",
    german: "DE",
    filipino: "FIL",
    cantonese: "CA",
    portuguese: "PT",
  };
  return languages.map((lang) => nameMap[lang]);
}

function getYesOrNo(condition) {
  if (!condition) {
    return false;
  }
  return condition.toString().trim().toLowerCase() === "yes";
}

// only handle weekdays because thats all we have
// on DB
function normalizeWatchtime(input) {
  if (input == undefined || !input.weekdays) {
    return null;
  }

  let from = new Date("January 5 1980 " + input.weekdaysFrom);

  // handling next date
  let to_date = "5";
  if (
    parseInt(input.weekdaysFrom.replace(":", "")) >
    parseInt(input.weekdaysTo.replace(":", ""))
  ) {
    to_date = "6";
  }
  let to = new Date("January " + to_date + " 1980 " + input.weekdaysTo);

  let fromT = new Date(from.getTime());
  fromT.setDate(fromT.getDate() + 1);
  let toT = new Date(to.getTime());
  toT.setDate(toT.getDate() + 1);

  let fromY = new Date(from.getTime());
  fromY.setDate(fromY.getDate() - 1);
  let toY = new Date(to.getTime());
  toY.setDate(toY.getDate() - 1);

  return [from, to, fromT, toT, fromY, toY];
}

// going to assume most streamers stream for 3 hours
// if not defined in DB
function calculateWatchtimeScore(input, start_time, stream_duration) {
  if (input == null) {
    return 1;
  }

  if (start_time == null) {
    return 0;
  }

  if (stream_duration == null) {
    stream_duration = 3;
  }

  let st_from = new Date("January 5 1980 " + start_time);
  let st_to = new Date("January 5 1980 " + start_time);
  st_to.setHours(st_to.getHours() + stream_duration);

  // current
  let s1 = compareTime(st_from, st_to, input[0], input[1]);
  if (s1 != 0) {
    return s1;
  }

  // tomorrow
  let s2 = compareTime(st_from, st_to, input[2], input[3]);
  if (s2 != 0) {
    return s2;
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
    return 1;
  }

  // input is longer than stream (surrounding)
  // |  a   b  |
  if (st_from >= d1 && st_to <= d2) {
    return 1;
  }

  // partial early
  // | a | b
  if (d1 < st_from && d2 < st_to && d2 > st_from) {
    let watched = d2 - st_from;
    return (watched * 1.0) / watch_duration;
  }

  // partial late
  // a | b |
  if (st_from < d1 && st_to < d2 && d1 < st_to) {
    let watched = st_to - d1;
    return (watched * 1.0) / watch_duration;
  }

  // outside range
  return 0;
}

function processRanks(ranks) {
  let new_rank = {};
  let total = 0;
  // read and update question weights from supplied user data
  for (const [key, val] of Object.entries(ATTRIBUTE_POINTS_DEFAULTS)) {
    let newWeightValue = parseFloat(ranks[key]);
    if (isNaN(newWeightValue)) {
      // use from default
      // Log helpful debug information
      console.log(
        new Error(
          `Question weight for 'ATTRIBUTE_POINTS' key '${key}' was not found in client request payload. Inspect request[ranks] data for possible naming mismatch.`
        )
      );
      new_rank[key] = val;
      total += new_rank[key];
      continue;
    }

    new_rank[key] = newWeightValue / ATTRIBUTE_POINTS_STAR_TOTAL;
    total += new_rank[key];
  }

  return [new_rank, total];
}

module.exports = calculateStreamer;
