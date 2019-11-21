var usuario;

function init() {
    $('#submt').on("click", function (event) {
        event.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            data : JSON.stringify({
                "username" : $("#username").val(),
                "password" : $("#password").val()
            }),
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            contentType: "application/json",
            success: function (responseJson) {
                $('#status').append(`<div>` + responseJson.username + `logged in</div>`);
                console.log(responseJson);
                alert("Inicio de sesión exitosos");
                $("#username").val("");
                $("#password").val("");
            },

            error: function (err) {
                $('#status').append(`Something went wrong, try again later`);


            }
        });
    });

    //check user logged in
        $.ajax({
            url: "/api/checksession",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
            xhrFields: {
                withCredentials: true
            },
            success: function (responseJson) {
                $('#checkuserlist').append(`<div>user is ` + responseJson + `</div>`);
                //console.log(responseJson);
                usuario = responseJson;
                if (usuario == "none") {
                    $("#nModify").css("visibility", "hidden");
                    $("#nNew").css("visibility", "hidden");
                }
                else {
                    $("#nModify").css("visibility", "visible");
                    $("#nNew").css("visibility", "visible");
                }
            },

            error: function (err) {
                $('#checkuserlist').append(err);


            }
        });
    //logout
    $('#logout').on("click", function (event) {
        event.preventDefault();
        $.ajax({
            url: "/api/logout",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
            xhrFields: {
                withCredentials: true
            },
            success: function (responseJson) {
                $('#logoutdiv').append(`<div>user is` + responseJson + ` logout</div>`);
                //console.log(responseJson);

            },

            error: function (err) {
                $('#checkuserlist').append(err);


            }
        });
    });
}

init();