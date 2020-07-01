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
          let feature = evaluate(streamers);
          question(feature);
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

function build_streamer_map(rows) {
  // data is not normalized..
  // garbage code ahead
  // someone needs to refactor code and data
  // additional classification can help generalize and reduce search space

  var firstRow = true;
  rows.forEach(r => {
    if(firstRow){
      console.log("BEFORE",r)
    }

    // the regex removes all non-letters and replaces with a space... probably not the best way
    let ethnicities = r['Ethnicity'] != undefined ? r['Ethnicity'].toString().replace(/[^a-z0-9+]+/gi, ' ').split(' ') : [];
    let languages = r['Language\nspoken'] != undefined ? r['Language\nspoken'].toString().replace(/[^a-z0-9+]+/gi, ' ').split(' ') : [];
    let collaborations = r['Common collaborators/co-streamers'] != undefined ? r['Common collaborators/co-streamers'].toString().replace(/[^a-z0-9+]+/gi, ' ').split(' ') : [];
    let vibes = r['Vibe?'] != undefined ? r['Vibe?'].toString().replace(/[^a-z0-9+]+/gi, ' ').split(' ') : [];
    
    // not sure how to deal with this
    temp = r['Content type'];
    let content = [];
    if (temp != undefined) {
      let contentString = temp.toString();
      console.log(contentString)
      contentString.split('/').join('$').split(',').join('$').split('$').forEach(e => {
        e = e.replace('(', '')
        e = e.replace(')', '')
        e = e.trim()
        e = e.toLowerCase()

        if (e != '') {
          content.push(e)
        }
      });
    }

    function getLowercaseValue(key){return(r[key] != undefined) ? r[key].toLowerCase() : r[key]}

    let streamer = {
      'username': getLowercaseValue('English'),
      'alcohol': getLowercaseValue('Alcohol streaming?'),
      'cam': getLowercaseValue('Cam/No Cam'),
      'viewerEngagement': getLowercaseValue('Engage with viewers?'),
      'DOB': r['Date of Birth'],
      'age': r['Age'],
      'avgStreamStartTime': r['Streaming Time'],
      'avgStreamLength': r['Stream duration'],
      'avgViewerCountPerStream': r['avg viewer count\n/stream'],
      'followers': r['Follower Count'],
      'foreignUsername': r['Display (foreign language) Name'],
      'voiceStyle': r['Voice (1-5)\n5: loud\n1: quiet'],
      'mainGame': r['Main Game'],
      'picture': r['Pictures (please put link)'],
      languages,
      content,
      ethnicities,
      collaborations,
      vibes,
      'mature': r['19 + Maturity'] != undefined ? r['19 + Maturity'].toLowerCase() : r['Does 19+ Jokes?'] != undefined ? r['Does 19+ Jokes?'].toLowerCase() : r['Does 19+ Jokes?'],
    };

    if(firstRow){
      console.log("AFTER",streamer)
      firstRow = false;
    }
  
    streamers.set(streamer.username, streamer);
  });
  /* console.log(JSON.stringify(Array.from(streamers.entries()))) */
  /* console.log(JSON.stringify(Array.from(ethnicityCount))) */
  /* console.log(languageCount) */
  /* console.log(contentCount) */
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
  $('#debug').html(debug)
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
