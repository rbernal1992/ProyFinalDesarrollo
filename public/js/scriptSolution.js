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

    $.ajax({
        url: "/api/solutionslist",
        method : "GET",
        dataType : "json",
        contentType : "application/json",
        xhrFields: {
            withCredentials: true
        },
        success : function(responseJson) {
            var i;
            var k;
            for (k = 0; k < 6; k++) {
                for (i in responseJson) {
                    $("#solutions").append(`<li>
                                                <div><h6>`+responseJson[i].title+`</h6></div>
                                                <div>Por: `+responseJson[i].author+`</div>
                                                <div>`+responseJson[i].description+`</div>
                                                <div> Calificacion: `+responseJson[i].gradenum+`</div>
                                                <div>Comentarios: `+responseJson[i].grade+`</div>
                                                <div> ID: `+responseJson[i].id+`</div>
                                            </li>`)
                }
            }
        },
        error : function(error) {
            console.log(error);
        }
    })
}

init();