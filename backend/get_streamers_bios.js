const fetch = require("node-fetch");

// TODO: Change this to Twitch official client ID
const ClientId = "s2frr164040bp9l6mgurxaz32i6rm1";

const Url = "https://api.twitch.tv/v5/users?login=";

module.exports.getStreamersBio = async function (usernames) {
    const joined = usernames.join(',');
    const fullUrl= Url + joined;

    const response = await fetch(fullUrl, {
        headers: {
            "Client-ID": ClientId,
            "Accept": "application/vnd.twitchtv.v5+json",
        }
    });
    const responseJson = await response.json()

    let streamerBios = {}
    for(let user of responseJson.users) {
        
        streamerBios[user.name] = user.bio;
    }
   
    return streamerBios;
};
