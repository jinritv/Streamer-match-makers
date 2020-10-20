
const {Op} = require("sequelize");
const {Streamers, StreamersStats, Languages, Categories, StreamersNationalities} = require("../models/models");


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
  const matchedStreamers = matchStreamers(prefs, allStreamers);

  // get required data for our streamers
  let streamersResult = await Streamers.findAll({
    attributes: ['user_name','logo'],
    where: {
      [Op.or]: [
        { id: matchedStreamers[0].id },
        { id: matchedStreamers[1].id },
        { id: matchedStreamers[2].id },
        { id: matchedStreamers[3].id },
        { id: matchedStreamers[4].id }
      ]
    }
  });

  // add the match value to the result
  const matchedStreamersResult = streamersResult.map((streamer,index)=> {
    let streamerObj = Object.assign({}, {user_name: streamer.user_name, logo: streamer.logo });

    streamerObj.match_value = matchedStreamers[index].match_percent; // add our calculated match %
    return streamerObj;
  })

  callback(matchedStreamersResult,null);

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
  // scores will keep track of all the values for each streamer as we iterate through the attributes
  let scores = {};

  // holds the values for the 'Points' of each attribute (an alternative to weighting?)
  const AttributePoints = {
    age: 1,
    avg_viewers: 1,
    language: 1,
    content: 1,
    watchtime: 1
  }

  // array to store the matched streamers
  let matchValues = [];

  streamers.forEach(streamer=>{
    let totalAttributes = 0;
    // create an entry for the streamer in the score object
    scores[streamer.user_name] = 0;

    // check against age preference
    if(streamer.dob_year){
      let DOBrange = getStreamerAgeRange(prefs.age);
      if(streamer.dob_year >= DOBrange[0] && streamer.dob_year <= DOBrange[1]){
        // if the dob is within range, increase the score
        scores[streamer.user_name] += AttributePoints.age
      }
    }
    totalAttributes += 1; 

    // check against average viewers preference
    if(streamer.StreamersStat){
      let viewerRange = getMinMaxViewers(prefs.average_viewers);
      if(streamer.StreamersStat.avg_viewers >= viewerRange[0] && streamer.StreamersStat.avg_viewers <= viewerRange[1] ){
          // if the average viewers is within range, increase the score
          scores[streamer.user_name] += AttributePoints.avg_viewers;
      }
    }
    totalAttributes += 1;

    // check against language preference
    // get the streamers and the user's language arrays
    let streamersLanguages = streamer.Languages.map(lang=>lang.language);
    let preferredLanguages = getLanguageNames(prefs.languages);

    // add together ALL languages (we don't care about duplicates yet)
    let totalLanguageAttributes = streamersLanguages.length + preferredLanguages.length;
    
	let totalLangMatch = 0;
    streamersLanguages.forEach(strLang=>{
      if(preferredLanguages.includes(strLang)){
        // if the viewer selected that language, add it as a match
        // scores[streamer.user_name] += AttributePoints.language;
		totalLangMatch += 1;

        // and this means there are duplicates in the two datasets, 
        // we reduce the TOTAL attributes by 1 (removing the duplicate)
        // totalLanguageAttributes -= 1;
     }
    });
	// count total match with total input (floating number)
	if streamersLanguage.length != 0 {
	   scores[streamer.user_name] += totalLangMatch * 1.0 / streamersLanguage.length
	}
    totalAttributes += 1;

    //check against stream content
    let streamersCategories = streamer.Categories.map(cat=>cat.category);
    let preferredCategories = getCategories(prefs.content);

    let totalCategoryAttributes = streamersCategories.length + preferredCategories.length;
   
	let totalCatMatch = 0;
    preferredCategories.forEach(cat=>{
      if(streamersCategories.includes(cat)){
        // if the streamer's category, increase the score
        // scores[streamer.user_name] += AttributePoints.content;
		totalCatMatch += 1;

        // and remove the total by 1 so we dont have duplicate
        // totalCategoryAttributes -= 1;
     }
    });
	if streamersCategories.length != 0 {
		scores[streamer.user_name] += totalCatMatch * 1.0 / streamersCategories.length
	}
    totalAttributes += 1;

    // TODO check against watch time (stream start/end time)
      
    // finally calculate the match % for our matched streamers and add them to the object we return back to the client
    let similarity = Math.round((scores[streamer.user_name]/totalAttributes)*100);
    matchValues.push({id: streamer.id, streamer:[streamer.user_name], match_percent:similarity});
  })
  
  // sort the streamers
  matchValues.sort(orderStreamers);

  // we only want top 5
  let topStreamers = matchValues.slice(0,5);
  console.log(topStreamers);
  return topStreamers;
}

// sorts the list of streamers by match percentage (highest first)
function orderStreamers(a, b) {
  if ( a.match_percent > b.match_percent ){
    return -1;
  }
  if ( a.match_percent < b.match_percent ){
    return 1;
  }
  return 0;
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

  const maxDOB = Number(thisYear-ageRange.min || thisYear-25);
  const minDOB = Number(thisYear-ageRange.max || thisYear-75);
  
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


module.exports = calculateStreamer
