function loadStreamerData(){
    const API_KEY = "AIzaSyAmOr96GzDNuwVNiVg7ZVUwDEEC9P4Qz7A";
    let cell_ranges_to_get = "A6:L1000"; // gets first 1000 rows of data (if exists)
    let spreadsheet_id = "1yQ7YzuM5FhFB13ChTz77W2VyhzYJnjtqMBAEOwJrebI";
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}?ranges=${cell_ranges_to_get}&fields=properties.title,sheets(properties,data.rowData.values(effectiveValue,effectiveFormat))&key=${API_KEY}`

    $.ajax({
        beforeSend: console.log("loading streamer data"),
        url:url,
        type: "GET",
        success: function (data) { 
          var row_data = data.sheets[0].data[0].rowData;
          var rows = extractRowData(row_data);
          console.log(rows)
        },
        complete: function(xhr,status){
          if(status == 'error'){
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
})
