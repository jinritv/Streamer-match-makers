const Languages = {
    ENGLISH: 'english', // make sure this value is the same you put after the 'drop-down-label-' for the dropdown
    FRENCH: 'french',
    KOREAN: 'korean',
    JAPANESE: 'japanese'
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
    [Languages.JAPANESE]: {
        icon: "https://seek-team-prod.s3.fr-par.scw.cloud/users/5f5f179929493659471294.jpg"
    }
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
                [Languages.JAPANESE]: "日本語",
                // add your new language translation to everything
            },
            "drop-down-label-french":{
                [Languages.ENGLISH]: "French",
                [Languages.FRENCH]: "Français",
                [Languages.KOREAN]: "프랑스어",
                [Languages.JAPANESE]: "フランス語",
            },
            "drop-down-label-korean":{
                [Languages.ENGLISH]: "Korean",
                [Languages.FRENCH]: "Coréen",
                [Languages.KOREAN]: "한국어",
                [Languages.JAPANESE]: "韓国語",
            },
            "page-title": {
                [Languages.ENGLISH]: "Welcome to Twiri",
                [Languages.FRENCH]: "Bienvenue à Twiri",
                [Languages.KOREAN]: "Twiri에 오신 것을 환영합니다",
                [Languages.JAPANESE]: "トィリへようこそ！",
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
                [Languages.FRENCH]: "Qui",
                [Languages.KOREAN]: "누구를 어떻게 해야 할지 모르다"
            },
            "animated-words": {
                [Languages.ENGLISH]: ['watch?', 'host?', 'follow?', 'raid?'],
                [Languages.FRENCH]: ['regarder ?', 'héberger ?', 'suivre ?', 'raider ?'],
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
                [Languages.FRENCH]: "Dans quelle(s) langue(s) ?"
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
                [Languages.FRENCH]: "Dans quelle(s) catégorie(s) ?"
            },
            "button-text-content-justchatting": {
                [Languages.ENGLISH]: "Just Chatting",
                [Languages.FRENCH]: "Discussion"
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
                [Languages.ENGLISH]: "Food",
                [Languages.FRENCH]: "Nourriture et boissons"
            },
            "button-text-content-cooking": {
                [Languages.ENGLISH]: "Cooking",
                [Languages.FRENCH]: "Cuisine"
            },
            "button-text-content-outdoors": {
                [Languages.ENGLISH]: "Outdoors",
                [Languages.FRENCH]: "Extérieur"
            },
            "button-text-content-irl": {
                [Languages.ENGLISH]: "IRL",
                [Languages.FRENCH]: "IRL"
            },
            "button-text-content-movies": {
                [Languages.ENGLISH]: "Movies",
                [Languages.FRENCH]: "Films"
            },
            "button-text-content-music": {
                [Languages.ENGLISH]: "Music",
                [Languages.FRENCH]: "Musique"
            },
            "button-text-content-dancing": {
                [Languages.ENGLISH]: "Dancing",
                [Languages.FRENCH]: "Danse",
            },
            "button-text-content-yoga": {
                [Languages.ENGLISH]: "Yoga",
                [Languages.FRENCH]: "Yoga"
            },
    
            // Question 3: subonly
            "question-text-subonly": {
                [Languages.ENGLISH]: "What kind of chat?",
                [Languages.FRENCH]: "Qui peut discuter ?"
            },
            "button-text-subonly-all": {
                [Languages.ENGLISH]: "All",
                [Languages.FRENCH]: "Tout le monde"
            },
            "button-text-subonly-sub-only": {
                [Languages.ENGLISH]: "Sub-only",
                [Languages.FRENCH]: "Abonnés seulement"
            },
            "button-text-subonly-follower-only": {
                [Languages.ENGLISH]: "Follower-only",
                [Languages.FRENCH]: "Suiveurs seulement"
            },
    
            //Question 4: Mature
            "question-text-mature": {
                [Languages.ENGLISH]: "Mature content?",
                [Languages.FRENCH]: "Avec quel type de contenu ?",
            },
            "button-text-mature-true": {
                [Languages.ENGLISH]: "Mature",
                [Languages.FRENCH]: "Adulte"
            },
            "button-text-mature-false": {
                [Languages.ENGLISH]: "Family-friendly",
                [Languages.FRENCH]: "Tout public"
            },
    
            // Question 5: chat vibe
            "question-text-chat-vibe": {
                [Languages.ENGLISH]: "Chat Vibe?",
                [Languages.FRENCH]: "Dans une ambiance…"
            },
            "button-text-chat-vibe-chatty": {
                [Languages.ENGLISH]: "Chatty",
                [Languages.FRENCH]: "Papoteuse"
            },
            "button-text-chat-vibe-chill": {
                [Languages.ENGLISH]: "Chill",
                [Languages.FRENCH]: "Posée"
            },
            "button-text-chat-vibe-serious": {
                [Languages.ENGLISH]: "Serious",
                [Languages.FRENCH]: "Sérieuse"
            },
            "button-text-chat-vibe-smart": {
                [Languages.ENGLISH]: "Smart",
                [Languages.FRENCH]: "Intelligente"
            },
            "button-text-chat-vibe-funny": {
                [Languages.ENGLISH]: "Funny",
                [Languages.FRENCH]: "Drôle"
            },
            "button-text-chat-vibe-friendly": {
                [Languages.ENGLISH]: "Friendly",
                [Languages.FRENCH]: "Amicale"
            },
            "button-text-chat-vibe-moody": {
                [Languages.ENGLISH]: "Moody",
                [Languages.FRENCH]: "Maussade"
            },
            "button-text-chat-vibe-weird": {
                [Languages.ENGLISH]: "Weird",
                [Languages.FRENCH]: "Bizarre"
            },
            "button-text-chat-vibe-geeky": {
                [Languages.ENGLISH]: "Geeky",
                [Languages.FRENCH]: "Geeky"
            },
            "button-text-chat-vibe-shy": {
                [Languages.ENGLISH]: "Shy",
                [Languages.FRENCH]: "Timide"
            },
            "button-text-chat-vibe-silly": {
                [Languages.ENGLISH]: "Silly",
                [Languages.FRENCH]: "Idiote"
            },
            "button-text-chat-vibe-rude": {
                [Languages.ENGLISH]: "Rude",
                [Languages.FRENCH]: "Vulgaire"
            },
            "button-text-chat-vibe-dorky": {
                [Languages.ENGLISH]: "Dorky",
                [Languages.FRENCH]: "Dorky"
            },
            "button-text-chat-vibe-angry": {
                [Languages.ENGLISH]: "Angry",
                [Languages.FRENCH]: "Énervée"
            },
            "button-text-chat-vibe-loud": {
                [Languages.ENGLISH]: "Loud",
                [Languages.FRENCH]: "Bruyante"
            },
            "button-text-chat-vibe-quiet": {
                [Languages.ENGLISH]: "Quiet",
                [Languages.FRENCH]: "Tranquille"
            },
            "button-text-chat-vibe-troll": {
                [Languages.ENGLISH]: "Troll",
                [Languages.FRENCH]: "Troll"
            },
            "button-text-chat-vibe-drunk": {
                [Languages.ENGLISH]: "Drunk",
                [Languages.FRENCH]: "Bourrée"
            },
            "button-text-chat-vibe-spam-emotes": {
                [Languages.ENGLISH]: "Spam emotes",
                [Languages.FRENCH]: "Spam emotes"
            },
            "button-text-chat-vibe-fast": {
                [Languages.ENGLISH]: "Fast",
                [Languages.FRENCH]: "Rapide"
            },
            "button-text-chat-vibe-slow": {
                [Languages.ENGLISH]: "Slow",
                [Languages.FRENCH]: "Lente"
            },
            "button-text-chat-vibe-wholesome": {
                [Languages.ENGLISH]: "Wholesome",
                [Languages.FRENCH]: "Saine"
            },
            "button-text-chat-vibe-toxic": {
                [Languages.ENGLISH]: "Toxic",
                [Languages.FRENCH]: "Toxique"
            },
    
            // Question 6: average viewers
            "question-text-average_viewers": {
                [Languages.ENGLISH]: "Average viewer count?",
                [Languages.FRENCH]: "Nombre moyen de spectateurs ?"
            },
    
            // Question 7: watch time
            "question-text-watchtime": {
                [Languages.ENGLISH]: "I can watch streams on",
                [Languages.FRENCH]: "Je regarde des streams…",
            },
            "time-range-watchtime-weekdays": {
                [Languages.ENGLISH]: "Weekdays",
                [Languages.FRENCH]: "En semaine"
            },
            "time-range-watchtime-weekends": {
                [Languages.ENGLISH]: "Weekends",
                [Languages.FRENCH]: "Le weekend"
            },
            "time-range-watchtime-from": {
                [Languages.ENGLISH]: "from",
                [Languages.FRENCH]: "de"
            },
            "time-range-watchtime-to": {
                [Languages.ENGLISH]: "to",
                [Languages.FRENCH]: "à"
            },
    
            // Misc
            "loading-message": {
                [Languages.ENGLISH]: "Matching you with a streamer...",
                [Languages.FRENCH]: "Recherche de streamers en cours…"
            },
            "match": {
                [Languages.ENGLISH]: "match",
                [Languages.FRENCH]: "de correspondance"
            },
            "results": {
                [Languages.ENGLISH]: "Results",
                [Languages.FRENCH]: "Résultats"
            },
            "restart": {
                [Languages.ENGLISH]: "Restart",
                [Languages.FRENCH]: "Relancer la recherche"
            },
            "continue": {
                [Languages.ENGLISH]: "Continue",
                [Languages.FRENCH]: "Continuer"
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
