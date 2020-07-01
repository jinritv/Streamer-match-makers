function loadStreamerData(){
    const API_KEY = "AIzaSyAmOr96GzDNuwVNiVg7ZVUwDEEC9P4Qz7A";
    let cell_ranges_to_get = "B6:Y228";
    let spreadsheet_id = "1yQ7YzuM5FhFB13ChTz77W2VyhzYJnjtqMBAEOwJrebI";
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}?ranges=${cell_ranges_to_get}&fields=properties.title,sheets(properties,data.rowData.values(effectiveValue,effectiveFormat))&key=${API_KEY}`

    $.ajax({
        beforeSend: console.log("loading streamer data"),
        url:url,
        type: "GET",
        success: function (data) { 
          var row_data = data.sheets[0].data[0].rowData;
          var rows = extractRowData(row_data);
          let streamers = build_streamer_map(rows);
          console.log(streamers)
          let feature = evaluate(streamers);
          question(feature);
          setupExample3(streamers);
        },
        complete: function(xhr, status) {
          if (status == 'error') {
            console.log('error')
          }
        }
      });
    
}

function extractRowData(row_data){
    var row_values = [];
    var row_labels = row_data[0].values; // first row is the column labels
    var extracted_labels = []; // prepare array for the labels
    row_labels.forEach(label=>{
        if(label.effectiveValue!=null){
          extracted_labels.push(label.effectiveValue.stringValue); // add the label to the array
        } else {
          extracted_labels.push('');
        }
    });
    var remaining_rows = row_data.slice(1); // remove column labels from the data
    remaining_rows.forEach(row=>{
      var rowObj = {}
      var column_index = 0; // to keep track of which column the data is for, so we can label it
      var values = row.values;
      values.forEach(row_value=>{
        if(row_value.effectiveValue != null){
			if( row_value.effectiveValue.stringValue == undefined){ // now it's a number value...
				 rowObj[extracted_labels[column_index]] = row_value.effectiveValue.numberValue;
			} else {
				 rowObj[extracted_labels[column_index]] = row_value.effectiveValue.stringValue;
			}
        }
        column_index += 1; // advance to next column index
      });
      row_values.push(rowObj);
    });

    return row_values;
}


const SLIDERS_PER_ROW = 4;
let SliderValues = {};
function setupExample3(){
  let feature_sliders_html = `<div class="row">`;
  let feature_weight_values_table_html = ``;
  
  let slidersInCurrentRow = 0;
  let featuresSliders = Object.keys(DATA_MAPPING_STREAMER);

  featuresSliders.forEach(feature=>{
    if(slidersInCurrentRow == SLIDERS_PER_ROW){
      feature_sliders_html += `</div><div class="row">`;
      slidersInCurrentRow = 0;
    } else {
      slidersInCurrentRow += 1;
    }
    SliderValues[feature] = "50"
    feature_sliders_html += createSliderForFeature(feature,DATA_MAPPING_STREAMER[feature].ui_label);
    feature_weight_values_table_html += createTableRowForFeatureInWeightTable(feature, DATA_MAPPING_STREAMER[feature].ui_label);
  })
 
  $('#feature-sliders').html(feature_sliders_html);
  $('#feature-values-table').html(feature_weight_values_table_html);

}

function updateTableValue(feature,value){
  SliderValues[feature] = value
  var td = $(`#${feature}-weight-value`);
  td.html(value)
}

function createSliderForFeature(feature_id, label, defaultValue = "50"){
  let slider_html = `<div class="col">
  <p>${label}</p>
  <input id="${feature_id}-slider" type="range" min="1" max="100" value="${defaultValue}" class="slider" oninput="updateTableValue('${feature_id.toString()}',this.value)">
</div>`;
  return slider_html
}

function createTableRowForFeatureInWeightTable(feature_id, label, defaultValue = "50"){
  let features_table_html = `<tr>
  <th scope="row">${label}</th>
  <td id="${feature_id}-weight-value">${defaultValue}</td>
  </tr>`
return features_table_html
}


$(()=>{
    // once page is loaded
    // search for the data and display it in a view
    loadStreamerData();

    $("#streamer-quiz-form").steps({
      headerTag: "h3",
      bodyTag: "fieldset",
      transitionEffect: "fade",
      transitionEffectSpeed: 500,
      onStepChanging: function (event, currentIndex, newIndex) { 
        return true; },
      onStepChanged: function (event, currentIndex, priorIndex) { 
        return true;
    }, 
    });

    $("#yesButton").parent().click(() => {
      response(true)
      $('.card').toggleClass('is-flipped');
    });
  
    $("#noButton").parent().click(() => {
      response(false)
      $('.card').toggleClass('is-flipped');
    });
  
    $("#resetButton").parent().click(() => {
      reset()
    });

   // attachSlidersToTable();
})

function reset() {
  loadStreamerData();
  yesFeatures = new Set();
  noFeatures = new Set();
  $('#quiz').show();
  $('#streamers').hide();
}

var streamers = new Map();
var skipFeatures = [];
var currentFeature;
var yesFeatures = new Set();
var noFeatures = new Set();


const ParsingMethods = {
  none: (val)=>{return val},
  string_array: (val) => {return val != undefined ? val.toString().replace(/[^a-z0-9+]+/gi, ' ').split(' ') : []},
  lowercase_value: (val) => {return(val != undefined) ? val.toLowerCase() : val},
  bool:(val)=>{return 'TRUE'}
}

const DATA_MAPPING_STREAMER = {
  'DOB': {
    column_name: 'Date of Birth', // the column name in the google sheet
    ui_label: 'Birth year', // what we use to display in labels in the UI 
    parsing_method: ParsingMethods.none // how to parse the data from the cell value
  },
  'username': {
    column_name: 'English', 
    ui_label: 'English username',
    parsing_method: ParsingMethods.lowercase_value
  },
  'alcohol': {
    column_name: 'Alcohol streaming?', 
    ui_label: 'Drinking',
    parsing_method: ParsingMethods.bool
  },
  'cam':  {
    column_name: 'Cam/No Cam', 
    ui_label: 'Uses camera',
    parsing_method: ParsingMethods.bool
  },
  'viewerEngagement':{
    column_name: 'Engage with viewers?', 
    ui_label: 'Viewer engagement',
    parsing_method: ParsingMethods.bool
  },
  'age': {
    column_name: 'Age', 
    ui_label: 'Age',
    parsing_method: ParsingMethods.none
  },
  'avgStreamStartTime': {
    column_name: 'Streaming Time', 
    ui_label: 'Average stream start time',
    parsing_method: ParsingMethods.none
  },
  'avgStreamLength': {
    column_name: 'Stream duration', 
    ui_label: 'Average stream length',
    parsing_method: ParsingMethods.none
  },
  'avgViewerCountPerStream':{
    column_name: 'avg viewer count\n/stream',
    ui_label: 'Viewer count',
    parsing_method: ParsingMethods.none
  },
  'followers': {
    column_name: 'Follower Count',
    ui_label: 'Followers',
    parsing_method: ParsingMethods.none
  },
  'foreignUsername': {
    column_name: 'Display (foreign language) Name',
    ui_label: 'Foreign name',
    parsing_method: ParsingMethods.none
  },
  'voiceStyle': {
    column_name: 'Voice (1-5)\n5: loud\n1: quiet',
    ui_label: 'Voice level',
    parsing_method: ParsingMethods.none
  },
  'mainGame': {
    column_name: 'Main Game',
    ui_label: 'Main stream topic',
    parsing_method: ParsingMethods.none
  },
  'picture':  {
    column_name: 'Pictures (please put link)',
    ui_label: 'Picture',
    parsing_method: ParsingMethods.none
  },
  'languages': {
    column_name: 'Language\nspoken',
    ui_label: 'Spoken languages',
    parsing_method: ParsingMethods.string_array
  },
  'ethnicities':{
    column_name: 'Ethnicity',
    ui_label: 'Ethnicity',
    parsing_method: ParsingMethods.string_array
  },
  'collaborations':{
    column_name: 'Common collaborators/co-streamers',
    ui_label: 'Collaborations',
    parsing_method: ParsingMethods.string_array
  },
  'vibes': {
    column_name: 'Vibe?',
    ui_label: 'Vibes',
    parsing_method: ParsingMethods.string_array
  },
  'mature': {
    column_name: '19 + Maturity',
    ui_label: '19+ channel',
    parsing_method: ParsingMethods.bool
  },
  'matureJokes': {
    column_name: 'Does 19+ Jokes?',
    ui_label: 'Mature jokes',
    parsing_method: ParsingMethods.bool
  },
  'content':{
    column_name: 'Content type',
    ui_label: 'Content type',
    parsing_method: (val)=>{ // we need to figure out how to define the 'content'... 
      let contentString = 'no content :(';
      let content = [];
      if (val != undefined) {
        contentString = val.toString().split('/').join('$').split(',').join('$').split('$').forEach(e => {
          e = e.replace('(', '')
          e = e.replace(')', '')
          e = e.trim()
          e = e.toLowerCase()
  
          if (e != '') {
            content.push(e)
          }
        });
       return content
      }
      return contentString;
    }
  }
}

function build_streamer_map(rows) {
  // data is not normalized..
  // additional classification can help generalize and reduce search space
  rows.forEach(r => {
  
    let StreamerFeatures = Object.keys(DATA_MAPPING_STREAMER);
    let streamer = {};
    StreamerFeatures.forEach(feature=>{
      let FeatureMappingInfo = DATA_MAPPING_STREAMER[feature];
      let feature_value = FeatureMappingInfo.parsing_method(r[FeatureMappingInfo.column_name]);
      streamer[feature] = feature_value;
    });
   
    streamers.set(streamer.username, streamer);
  });
 
  streamers.delete(undefined)
  return streamers
}

function evaluate() {
  // find some way to incorporate heuristic()

  // features should result in a yes no question
  let features = new Map();

  streamers.forEach((streamer) => {
    for (let property in streamer) {
      switch (property) {
        case 'username':
        case 'age':
        case 'avgViewerCountPerStream':
        case 'followers':
          continue
      }

      if (streamer[property] == undefined || streamer[property] == null) {
        continue
      }

      let key = property + '=' + streamer[property];

      if (!Array.isArray(streamer[property])) {
        if (!features.has(streamer[property])) {
          features.set(key, [])
        }

        features.get(key).push(streamer.username)

      } else {
        streamer[property].forEach((element) => {
          if (element != undefined && element != null) {
            key = property + '=' + element;

            if (!features.has(key)) {
              features.set(key, [])
            }

            features.get(key).push(streamer.username)
          }
        });
      }
    }
  });

  feats = Array.from(features)
  feats.sort((a, b) => {
    return b[1].length - a[1].length
  });

  /* console.log(JSON.stringify(feats)) */

  let i = 0;

  for (i = 0; i < feats.length; i++) {
    // match on type and streamer list.. leads to repeats for reconsideration
    if (!skipFeatures.includes(feats[i].toString())) {
      break
    }
  }

  // will run out of options
  // if we skip all then do a comparison against types rather than feats
  // calculate % of streamers that would be elminated
  // or group feats just chatting + korean

  currentFeature = feats[i]
  return currentFeature
}

function question(feature) {
  const questionFormat = {
    'ethnicities': 'Are you interested in %v streamers?',
    'content': 'Do you watch %v?',
    'languages': 'Do you care if they speak %v?',
  }

  if (feature != undefined) {
    let type = feature[0].split('=')[0]
    let feat = feature[0].split('=')[1]
    let format = questionFormat[type]

    $('#question').html(format.replace('%v', feat))
  } else {
    $('#question').html('Something broke..')
  }

  // Debug junk to follow
  let options = Array.from(streamers)
  let debug = 'Options remaining: ' + options.length
  debug += '<br>Yes: ' + JSON.stringify(Array.from(yesFeatures))
  debug += '<br>No: ' + JSON.stringify(Array.from(noFeatures))
  debug += '<br><br>' + JSON.stringify(options)
 // $('#debug').html(debug)
}

function response(important) {
  // Use weighted answers to assign a confidence level to streamers

  if (!important) {
    noFeatures.add(currentFeature[0]);

    // Would delete all options.. should use weights instead
    if (currentFeature[1].length == streamers.size) {
      let options = 'No questions left<br>Suggested streamers based on last response<br><ul class="collection">';

      streamers.forEach(function(v, k) {
        options += '<li class="collection-item">' + k + '<a href="https://twitch.tv/' + k + '" class="secondary-content"><i class="material-icons">visit channel</i></a></li>';
      });

      options += '</ul>'
      $('#streamers').show();
      $('#streamers').html(options);
      $('#quiz').hide();
    } else {
      currentFeature[1].forEach(function(streamer) {
        console.log(streamer)
        streamers.delete(streamer)
      });
      question(evaluate())
    }
  } else {
    yesFeatures.add(currentFeature[0]);
    let matches = [];

    streamers.forEach(function(streamer) {
      if (!currentFeature[1].includes(streamer.username)) {
        matches.push(streamer.username)
      }
    });

    if (matches.length == streamers.size || streamers.size < 5) {
      let options = 'No questions left<br>Suggested streamers based on last response<br><ul class="collection">';

      streamers.forEach(function(v, k) {
        options += '<li class="collection-item">' + k + '<a href="https://twitch.tv/' + k + '" class="secondary-content"><i class="material-icons">visit channel</i></a></li>';
      });

      options += '</ul>'
      $('#streamers').show();
      $('#streamers').html(options);
      $('#quiz').hide();
    } else {
      console.log(matches)
      matches.forEach(function(streamer) {
        streamers.delete(streamer)
      });

      skipFeatures.push(currentFeature.toString())
    }

    question(evaluate())
  }
}

function heuristic(answer) {
  // binary search
  //  - ask questions that would remove at least half of streamers
  // direct match against answers
  //   - score = sum(match)
  // use weighted answers. would require us to score each streamer in each category.
  //   - dont know, probably, probably not
  //   - 1, 1.5, 0.5
  //   - score = sum(streamer matched features * weight)
}
