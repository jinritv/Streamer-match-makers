"use strict";
/******************/
// sample of how to use streamers data
$(() => {
    // callback once streamers data is
    // loaded from the google sheet
    loadStreamerData(streamers => {
        console.log(streamers);
        // see the structure of streamers
        // data at 'data/01-07-20.json`

        // do stuff here
    });
});
/******************/


const ParsingMethods = {
    none: (val) => {
        return val;
    },
    stringArray: (val) => {
        return val != undefined ? val.toString().replace(/[^a-z0-9+]+/gi, ' ').split(' ') : [];
    },
    lowercaseValue: (val) => {
        return (val != undefined) ? val.toLowerCase() : val;
    },
    bool: (val) => {
        return ["Y", "Cam", "Yes"].includes(val);
    }
};

const STREAMER_DATA_FIELDS = {
    'Year/Date of Birth': { // is the column name in the google sheet
        name: 'DOB', // the name we will use in our generated JSON for the streamer
        uiLabel: 'Birth year', // what we use to display in labels in the UI
        parsingMethod: ParsingMethods.none // how to parse the data from the cell value
    },
    'username': {
        name: 'username',
        uiLabel: 'English username',
        parsingMethod: ParsingMethods.lowercaseValue
    },
    'display name': {
        name: 'displayName',
        uiLabel: 'Display Name',
        parsingMethod: ParsingMethods.lowercaseValue
    },
    'Streamer Name': {
        name: 'steamerName',
        uiLabel: 'Steamer Name',
        parsingMethod: ParsingMethods.lowercaseValue
    },
    'Partner?': {
        name: 'partner',
        uiLabel: 'Partner',
        parsingMethod: ParsingMethods.bool
    },
    'Name': {
        name: 'name',
        uiLabel: 'Name',
        parsingMethod: ParsingMethods.lowercaseValue
    },
    'Date Started': {
        name: 'dateStarted',
        uiLabel: 'Date Started',
        parsingMethod: ParsingMethods.none
    },
    'Alcohol streaming?': {
        name: 'alcohol',
        uiLabel: 'Drinking',
        parsingMethod: ParsingMethods.bool
    },
    'Cam/No Cam': {
        name: 'cam',
        uiLabel: 'Uses camera',
        parsingMethod: ParsingMethods.bool
    },
    'Age': {
        name: 'age',
        uiLabel: 'Age',
        parsingMethod: ParsingMethods.none
    },
    'Streaming Time': {
        name: 'avgStreamStartTime',
        uiLabel: 'Average stream start time',
        parsingMethod: ParsingMethods.none
    },
    'Stream duration': {
        name: 'avgStreamLength',
        uiLabel: 'Average stream length',
        parsingMethod: ParsingMethods.none
    },
    'avg viewer count\n/stream': {
        name: 'avgViewerCountPerStream',
        uiLabel: 'Viewer count',
        parsingMethod: ParsingMethods.none
    },
    'Follower Count': {
        name: 'followers',
        uiLabel: 'Followers',
        parsingMethod: ParsingMethods.none
    },
    'Display (foreign language) Name': {
        name: 'foreignUsername',
        uiLabel: 'Foreign name',
        parsingMethod: ParsingMethods.none
    },
    'Main Game': {
        name: 'mainGame',
        uiLabel: 'Main stream topic',
        parsingMethod: ParsingMethods.none
    },
    'Pictures (please put link)': {
        name: 'picture',
        uiLabel: 'Picture',
        parsingMethod: ParsingMethods.none
    },
    'Language(s)\nspoken': {
        name: 'languages',
        uiLabel: 'Spoken languages',
        parsingMethod: ParsingMethods.stringArray
    },
    'Location (or time zone?)': {
        name: 'location',
        uiLabel: 'Location',
        parsingMethod: ParsingMethods.stringArray
    },
    'Voice': {
        name: 'voice',
        uiLabel: 'Voice',
        parsingMethod: ParsingMethods.stringArray
    },
    'Ethnicity': {
        name: 'ethnicities',
        uiLabel: 'Ethnicity',
        parsingMethod: ParsingMethods.stringArray
    },
    'Common collaborators/co-streamers': {
        name: 'collaborations',
        uiLabel: 'Collaborations',
        parsingMethod: ParsingMethods.stringArray
    },
    'Collaboration streamer?': {
        name: 'collaboration',
        uiLabel: 'Collaborations',
        parsingMethod: ParsingMethods.bool
    },
    'Vibe': {
        name: 'vibes',
        uiLabel: 'Vibes',
        parsingMethod: ParsingMethods.stringArray
    },
    'Fulltime?': {
        name: 'fulltime',
        uiLabel: 'Full Time',
        parsingMethod: ParsingMethods.bool
    },
    'Frequency of Streaming': {
        name: 'frequency',
        uiLabel: 'Frequency of Streaming',
        parsingMethod: ParsingMethods.bool
    },
    'Engage with viewers?': {
        name: 'engage',
        uiLabel: 'Engage with viewers',
        parsingMethod: ParsingMethods.bool
    },
    'PG - 13 ? (swearing)': {
        name: 'pg13',
        uiLabel: 'PG - 13? (swearing)',
        parsingMethod: ParsingMethods.bool
    },
    'Content type': {
        name: 'content',
        uiLabel: 'Content type',
        parsingMethod: (val) => { // we need to figure out how to define the 'content'...
            let contentString = 'no content :(';
            let content = [];
            if (val != undefined) {
                contentString = val.toString().split('/').join('$').split(',').join('$').split('$').forEach(e => {
                    e = e.replace('(', '');
                    e = e.replace(')', '');
                    e = e.trim();
                    e = e.toLowerCase();
                    if (e != '') {
                        content.push(e)
                    }
                });
                return content
            }
            return contentString;
        }
    }
};

/**
 * Gets streamer data from google sheets
 */
const loadStreamerData = (callback) => {
    const API_KEY = "AIzaSyAmOr96GzDNuwVNiVg7ZVUwDEEC9P4Qz7A"; // TODO: hide this
    let cellRange = "'New DB format ADD INFO IF YOU WANT'!B2:AC463";
    let spreadsheetId = "1yQ7YzuM5FhFB13ChTz77W2VyhzYJnjtqMBAEOwJrebI";
    let fields = "sheets.data.rowData.values(effectiveValue)";
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?ranges=${cellRange}&fields=${fields}&key=${API_KEY}`;

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data.sheets);
            var rowData = data.sheets[0].data[0].rowData;
            var streamers = getStreamers(rowData);
            callback(streamers);
        },
        failure: function (err) {
            console.log("AJAX Error");
            console.log(err)
        }
    });
};

/**
 * Returns an order list (left-to-right on the
 * spreadsheet) of column names.
 * @param columnRow
 * @returns columnNames
 */
const getColumnNames = function (columnRow) {
    var columnNames = [];
    columnRow.values.forEach(column => {
        columnNames.push(column.effectiveValue.stringValue);
    });
    return columnNames;
};

/**
 * Create a JSON structure of streamers
 * @param rowData - raw spreadsheet data from google API
 * @return streamers - list of streamer JSON objects
 */
const getStreamers = (rowData) => {
    var streamers = [];
    // get a list of ordered columns
    var columnNames = getColumnNames(rowData[0]);
    // first row is column headers
    rowData = rowData.slice(1);
    // iterate the rows (each row is a steamer's data)
    rowData.forEach(row => {
        var streamer = {};
        // iterate each data field for a steamer
        row.values.forEach((column, i) => {
            var columnName = columnNames[i]; // column name from spreadsheet
            console.log(columnName);
            var name = STREAMER_DATA_FIELDS[columnName].name; // JSON appropriate name
            if (column.effectiveValue) { // check if value is null
                 // get the string or number value
                var value = column.effectiveValue.stringValue ?
                    column.effectiveValue.stringValue : column.effectiveValue.numberValue;
                var parser = STREAMER_DATA_FIELDS[columnName].parsingMethod;
                // add data to streamer object
                streamer[name] = parser(value);
            } else {
                // adding empty value
                streamer[name] = null;
            }
        });
        streamers.push(streamer);
    });
    return streamers;
};

