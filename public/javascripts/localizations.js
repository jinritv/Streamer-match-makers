const Languages = {
    ENGLISH: 'english', // make sure this value is the same you put after the 'drop-down-label-' for the dropdown
    FRENCH: 'french',
    KOREAN: 'korean',
    // add a new language here
}

// Change this value is the default language translation when the site loads.
let _CURRENT_LANGUAGE_ = Languages.ENGLISH;

// The icon for the language in the dropdown menu.
const LanguageIconData = {
    [Languages.ENGLISH]: {
        icon: "https://cdn.betterttv.net/emote/566ca04265dbbdab32ec054a/1x"
    },
    [Languages.FRENCH]: {
        icon: "https://cdn.betterttv.net/emote/5558b4ecf417ba167710b35a/1x"
    },
    [Languages.KOREAN]: {
        icon: "https://cdn.betterttv.net/emote/5f67aece97645403e813f0fa/1x"
    },
    // add icon for your new language here
}

// Adds the parameters to the translation (if provided), and returns the language mapping object
function getTranslationTable(params) {

    // retreives the parameters for the text, or displays an error
    function getParams(index){
        if(params[index]==undefined){
            return sadKEK(index, 'missing parameter');
        }
        return params[index];
    }

    if(params.length==0){
        return {
            "drop-down-label-english": { // make sure this drop-down-label- uses the same string value you put in Languages object.
                [Languages.ENGLISH]: "English",
                [Languages.FRENCH]: "Anglais",
                [Languages.KOREAN]: "영국인",
                // add your new language translation to everything
            },
            "drop-down-label-french":{
                [Languages.ENGLISH]: "French",
                [Languages.FRENCH]: "Français",
                [Languages.KOREAN]: "프랑스어",
            },
            "drop-down-label-korean":{
                [Languages.ENGLISH]: "Korean",
                [Languages.FRENCH]: "Coréen",
                [Languages.KOREAN]: "한국어",
            },
            "page-title": {
                [Languages.ENGLISH]: "Welcome to Twiri",
                [Languages.FRENCH]: "Bienvenue à Twiri",
                [Languages.KOREAN]: "Twiri에 오신 것을 환영합니다",
            },
            "logoText": {
                [Languages.ENGLISH]: "Twiri, Stream seeker",
                [Languages.FRENCH]: "Twiri, investigatrice des streams",
                [Languages.KOREAN]: "트위리, 스트림 탐색자"
            },
            "copyright-text": {
                [Languages.ENGLISH]: "Copyright © 2020 JinriTV",
            },
            "animated-words-label": {
                [Languages.ENGLISH]: "Don't know who to",
                [Languages.FRENCH]: "Ne sais pas qui",
                [Languages.KOREAN]: "누구를 어떻게 해야 할지 모르다"
            },
            "animated-words": {
                [Languages.ENGLISH]: ['watch?', 'host?', 'follow?', 'raid?'],
                [Languages.FRENCH]: ['regarder?', 'hoster?', 'suivre?', 'raider?'],
                [Languages.KOREAN]: ['급습하다?', '지켜보다?', '뒤를 따르다?']
            },
            "find-streamer-button": {
                [Languages.ENGLISH]: "Find a Streamer",
                [Languages.FRENCH]: "Rechercher un streamer",
                [Languages.KOREAN]: "스트리머 찾기"
            },
    
            // Question 1: Languages
            "question-text-languages": {
                [Languages.ENGLISH]: "Spoken languages?",
                [Languages.FRENCH]: "Langues de stream?"
            },
            "button-text-languages-english": {
                [Languages.ENGLISH]: "English",
                [Languages.FRENCH]: "Anglais",
            },
            "button-text-languages-korean": {
                [Languages.ENGLISH]: "Korean",
                [Languages.FRENCH]: "Coréen",
            },
            "button-text-languages-japanese": {
                [Languages.ENGLISH]: "Japanese",
                [Languages.FRENCH]: "Japonais",
            },
            "button-text-languages-chinese": {
                [Languages.ENGLISH]: "Chinese",
                [Languages.FRENCH]: "Chinois",
            },
            "button-text-languages-french": {
                [Languages.ENGLISH]: "French",
                [Languages.FRENCH]: "Français",
            },
            "button-text-languages-spanish": {
                [Languages.ENGLISH]: "Spanish",
                [Languages.FRENCH]: "Espagnol",
            },
    
            // Question 2: Content
            "question-text-content": {
                [Languages.ENGLISH]: "I prefer streamers who stream...",
                [Languages.FRENCH]: "Je préfère des streamers qui..."
            },
            "button-text-content-justchatting": {
                [Languages.ENGLISH]: "Just Chatting"
            },
            "button-text-content-games": {
                [Languages.ENGLISH]: "Games",
                [Languages.FRENCH]: "Jeux"
            },
            "button-text-content-ASMR": {
                [Languages.ENGLISH]: "ASMR",
                [Languages.FRENCH]: "ASMR"
            },
            "button-text-content-sciencetech": {
                [Languages.ENGLISH]: "Science & Tech",
                [Languages.FRENCH]: "Science et Technologie"
            },
            "button-text-content-food": {
                [Languages.ENGLISH]: "Food"
            },
            "button-text-content-cooking": {
                [Languages.ENGLISH]: "Cooking"
            },
            "button-text-content-outdoors": {
                [Languages.ENGLISH]: "Outdoors"
            },
            "button-text-content-irl": {
                [Languages.ENGLISH]: "IRL"
            },
            "button-text-content-movies": {
                [Languages.ENGLISH]: "Movies"
            },
            "button-text-content-music": {
                [Languages.ENGLISH]: "Music"
            },
            "button-text-content-dancing": {
                [Languages.ENGLISH]: "Dancing"
            },
            "button-text-content-yoga": {
                [Languages.ENGLISH]: "Yoga"
            },
    
            // Question 3: subonly
            "question-text-subonly": {
                [Languages.ENGLISH]: "What kind of chat?"
            },
            "button-text-subonly-all": {
                [Languages.ENGLISH]: "All"
            },
            "button-text-subonly-sub-only": {
                [Languages.ENGLISH]: "Sub-only"
            },
            "button-text-subonly-follower-only": {
                [Languages.ENGLISH]: "Follower-only"
            },
    
            //Question 4: Mature
            "question-text-mature": {
                [Languages.ENGLISH]: "Mature content?"
            },
            "button-text-mature-true": {
                [Languages.ENGLISH]: "Mature"
            },
            "button-text-mature-false": {
                [Languages.ENGLISH]: "Family-friendly"
            },
    
            // Question 5: chat vibe
            "question-text-chat-vibe": {
                [Languages.ENGLISH]: "Chat Vibe?"
            },
            "button-text-chat-vibe-chatty": {
                [Languages.ENGLISH]: "Chatty"
            },
            "button-text-chat-vibe-chill": {
                [Languages.ENGLISH]: "Chill"
            },
            "button-text-chat-vibe-serious": {
                [Languages.ENGLISH]: "Serious"
            },
            "button-text-chat-vibe-smart": {
                [Languages.ENGLISH]: "Smart"
            },
            "button-text-chat-vibe-funny": {
                [Languages.ENGLISH]: "Funny"
            },
            "button-text-chat-vibe-friendly": {
                [Languages.ENGLISH]: "Friendly"
            },
            "button-text-chat-vibe-moody": {
                [Languages.ENGLISH]: "Moody"
            },
            "button-text-chat-vibe-weird": {
                [Languages.ENGLISH]: "Weird"
            },
            "button-text-chat-vibe-geeky": {
                [Languages.ENGLISH]: "Geeky"
            },
            "button-text-chat-vibe-shy": {
                [Languages.ENGLISH]: "Shy"
            },
            "button-text-chat-vibe-silly": {
                [Languages.ENGLISH]: "Silly"
            },
            "button-text-chat-vibe-rude": {
                [Languages.ENGLISH]: "Rude"
            },
            "button-text-chat-vibe-dorky": {
                [Languages.ENGLISH]: "Dorky"
            },
            "button-text-chat-vibe-angry": {
                [Languages.ENGLISH]: "Angry"
            },
            "button-text-chat-vibe-loud": {
                [Languages.ENGLISH]: "Loud"
            },
            "button-text-chat-vibe-quiet": {
                [Languages.ENGLISH]: "Quiet"
            },
            "button-text-chat-vibe-troll": {
                [Languages.ENGLISH]: "Troll"
            },
            "button-text-chat-vibe-drunk": {
                [Languages.ENGLISH]: "Drunk"
            },
            "button-text-chat-vibe-spam-emotes": {
                [Languages.ENGLISH]: "Spam emotes"
            },
            "button-text-chat-vibe-fast": {
                [Languages.ENGLISH]: "Fast"
            },
            "button-text-chat-vibe-slow": {
                [Languages.ENGLISH]: "Slow"
            },
            "button-text-chat-vibe-wholesome": {
                [Languages.ENGLISH]: "Wholesome"
            },
            "button-text-chat-vibe-toxic": {
                [Languages.ENGLISH]: "Toxic"
            },
    
            // Question 6: average viewers
            "question-text-average_viewers": {
                [Languages.ENGLISH]: "Average viewer count?"
            },
    
            // Question 7: watch time
            "question-text-watchtime": {
                [Languages.ENGLISH]: "I can watch streams on"
            },
            "time-range-watchtime-weekdays": {
                [Languages.ENGLISH]: "Weekdays"
            },
            "time-range-watchtime-weekends": {
                [Languages.ENGLISH]: "Weekends"
            },
            "time-range-watchtime-from": {
                [Languages.ENGLISH]: "from"
            },
            "time-range-watchtime-to": {
                [Languages.ENGLISH]: "to"
            },
    
            // Misc
            "loading-message": {
                [Languages.ENGLISH]: "Matching you with a streamer...",
                [Languages.FRENCH]: "En train de vous trouver des streamers..."
            },
            "match": {
                [Languages.ENGLISH]: "match",
                [Languages.FRENCH]: "égal"
            },
            "results": {
                [Languages.ENGLISH]: "Results",
                [Languages.FRENCH]: "Résultats"
            },
            "restart": {
                [Languages.ENGLISH]: "Restart",
                [Languages.FRENCH]: "à nouveau"
            },
            "continue": {
                [Languages.ENGLISH]: "Continue",
                [Languages.FRENCH]: "Continuez"
            }
        }
    }

    // if we have params, we attempt to get them:
   return {

        // requires parameters (pass the values in params as an array)
        "generated-quiz-modal-progress-label": {
            [Languages.ENGLISH]: `Question ${getParams(0)} of ${getParams(1)}`,
            [Languages.FRENCH]: `Question ${getParams(0)} sur ${getParams(1)}`,
            [Languages.KOREAN]: `이의 있소 ${getParams(0)} 의 ${getParams(1)}`
        },
        "range-display-average_viewers": {
            [Languages.ENGLISH]: `Between ${getParams(0)} and ${getParams(1)} average viewers`,
            [Languages.FRENCH]: `Entre ${getParams(0)} et ${getParams(1)} spectateurs en moyen`,
        }
    }
}

// getTranslation is the main function that provides the translations.
// We give it the key for the text we want the translation for, and
// and an array of parameters we need to complete the text (such as values from inputs).
// Passing the parameters array is optional. 
function getTranslation(label, params = []) {
    // set the translation table, if we are using parameters or not
    let TranslationTable = getTranslationTable(params);

    // check if there is translation for this label, then use it
    if (TranslationTable[label]) {
        if (TranslationTable[label][_CURRENT_LANGUAGE_]) {
            return TranslationTable[label][_CURRENT_LANGUAGE_]
        }
        return sadKEK(label, 'missing translation');
    }
    return sadKEK(label, 'missing label');
}

// returns an error message and outputs and error to the console.
function sadKEK(label, message){
    console.error(`${getLanguage()} language error for '${label}': ${message}`)
    return `<span style="color:red">${message} <img src="https://cdn.betterttv.net/emote/5d72ae0aa32edb714a9df060/1x"/></span>`;
}

//retreives the language's icon to display on the dropdown menu.
function getLanguageIcon(language) {
    if (LanguageIconData[language]) {
        return LanguageIconData[language].icon
    }
    return ''
}

function setLanguage(language) {
    _CURRENT_LANGUAGE_ = language;
}
function getLanguage() {
    return _CURRENT_LANGUAGE_;
}
