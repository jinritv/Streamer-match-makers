function initializeDatabase(){
  
    // Create the database
    $.ajax({
        beforeSend: displayResultMessage("Setting up database..."),
        url:"/initializeDatabase",
        type: "POST",
        success: function (data) { 
            console.log(data)
            setIsConnected(data.Success);
            if(data.Error != null){
                displayOutput(`<br/>${data.Error.sqlMessage}`);
            } else {
                displayOutput("<br/>Success.");
            }
        },
        complete: function(xhr, status) {
          if (status == 'error') {
            console.log('error')
          }
        }
      });
}

function displayOutput(text){
    $('#connectionMessage').append(text);
}

function setIsConnected(connected){
    if(connected){
        $("#isConnected").addClass("btn-success");
        $("#isConnected").removeClass("btn-danger");
    } else {
        $("#isConnected").addClass("btn-danger");
        $("#isConnected").removeClass("btn-success");
    }
}

function displayResultMessage(message){
    $("#connectionMessage").text(message);
}
