//ejemplo de formato de imagen data = [0,255,8,30,....muchos numeros más]
var contador = 0;
var usuario;

File.prototype.convertToBase64 = function(callback){
    var reader = new FileReader();
    reader.onloadend = function (e) {
        callback(e.target.result, e.target.error);
    };   
    reader.readAsDataURL(this);
};

function init() {
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
                usuario = responseJson.username;
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

    $("#register").on("submit", function (event) {
        event.preventDefault();
        let d = Date.now();
        let dnow = d.toString();
        
        if ($("#pswd").val() != $("#repPswd").val()) {
            $.ajax({
                url: "/api/",
                data: JSON.stringify({
                    "username": $("#user").val(),
                    "passwd": $("#pswd").val(),
                    "level" : "",
                    "lastlogindate" : dnow,
                    "country": $("#coutnry").val(),
                    "business" : $("#business").val(),
                    "Solution" : {}
                }),
                method : "POST",
                dataType : "json",
                contentType : "application/json",
                success : function(responseJson) {
                    alert("Usuario registrado");
                    $("#user").val("")
                    $("#pswd").val("")
                    $("#coutnry").val("")
                    $("#business").val("")
                },
                error : function(error) {
                    console.log(error);
                }
            })
        }
        else {
            alert("Asegurese que la contraseña sea correcta")
        }
    });
}

init();