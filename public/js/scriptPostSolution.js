//ejemplo de formato de imagen data = [0,255,8,30,....muchos numeros más]
var contador = 0;
File.prototype.convertToBase64 = function(callback){
    var reader = new FileReader();
    reader.onloadend = function (e) {
        callback(e.target.result, e.target.error);
    };   
    reader.readAsDataURL(this);
};

function init() {
    //check user logged in
    $('#checkuser').on("click", function (event) {
        event.preventDefault();
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

            },

            error: function (err) {
                $('#checkuserlist').append(err);


            }
        });
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

    $("#postLists").on("submit", function (event) {
        event.preventDefault();
        let d = Date.now();
        let dnow = d.toString();
        var nbase64;
        var files = $('#img')[0].files[0];
        files.convertToBase64(function(base64) {
			//console.log(base64);
            $.ajax({
                url: "/api/createSolution",
                data: JSON.stringify({
                    "title": $("#additemtitle").val(),
                    "description": $("#additemcontent").val(),
                    "author": $("#additemauthor").val(),
                    "datecreated" : dnow,
                    "grade" : $("#additemcomment").val(),
                    "gradenum" : 10,
                    "counteraccess" : 0,
                    "lastuseraccess" : "",
                    "imageOne" : base64
                }),
                method : "POST",
                dataType : "json",
                contentType : "application/json",
                xhrFields: {
                    withCredentials: true
                },
                success : function(responseJson) {
                    alert("Post publicado");
                },
                error : function(error) {
                    console.log(error);
                }
            })
        });
    });

}

init();