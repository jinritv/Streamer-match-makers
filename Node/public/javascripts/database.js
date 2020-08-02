function testDatabase(){
    const DB_USERNAME = $('#db-username').val();
    const DB_PASSWORD = $('#db-password').val();
    if (DB_USERNAME == "" || DB_PASSWORD == "" ){
        displayResultMessage("Missing username or password.");
        return
    }
    
    $.ajax({
        beforeSend: console.log("testing db connection"),
        url:"/testMySQLConnection",
        type: "POST",
        data: {
            Username: DB_USERNAME,
            Password: DB_PASSWORD
        },
        success: function (data) { 
            setIsConnected(data.Connected);
            if(data.Error != null){
                displayResultMessage(data.Error.sqlMessage);
            } else {
                displayResultMessage("Successfully connected!");
            }
        },
        complete: function(xhr, status) {
          if (status == 'error') {
            console.log('error')
          }
        }
      });
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
