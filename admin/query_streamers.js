const { getSequelizeFromConfig, testConnection} = require("../db/db");
const fs = require("fs");
const { QueryTypes } = require("sequelize");
const { findOrCreateStreamerFromData } = require("../db/find_or_create_streamer");
const { validateData } = require("../validation/validator");
const { Streamers, Languages, StreamersLanguages, StreamersStats, Categories, Locations } = require("../models/models");


let whereQuery = {
  uses_cam: true,
  mature_stream: false,

  /*languages: {
    language: [
      "en",
      "jp",
      "th"
    ]
  },
  categories: {
    category: [
      "irl",
      "pepega chatting",
      "just chatting",
      "movies with viewers on discord",
      "science & technology",
      "geoguessr"
    ]
  }*/
}

let includeQuery = [
  {
    model: Languages,
    //where: {language: ['cn', 'kr']}
  },
  {
    model: StreamersStats,
  },
  {
    model: Categories,
  },
  {
    model: StreamersStats,
  },
  /*{
    model: Languages,
    as: "languages",
    attributes: ["language"],
    through: {
      model: StreamersLanguages,
      //as: "streamers_languages",
    }
  }*/

]


async function queryStreamer() {
  const found = await Streamers.findAll({where:whereQuery, include: includeQuery});
  const streamers = [];
  for(let f of found) {
    streamers.push(f);
    const langModels = f.Languages;
    const langNames = langModels.map(langModel => langModel.language);
    f.StreamersStat.voice;
    console.log(f.user_name + ", " + langNames + ": " + Object.keys(f));
  }

  //console.log(streamers.length);
  //console.log(streamers[0].user_name);
  
  //console.log(streamers[10].user_name);
  //console.log(streamers[10].languages);
}



queryStreamer();