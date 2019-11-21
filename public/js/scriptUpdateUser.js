var usuario;
var datos;
var idFav;

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
            datos = responseJson;
            $("#user").val(datos.username);
            $("#user").prop("disabled", true);
            $("#country").val(datos.country);
            $("#business").val(datos.business);
            idFav = datos.id;
            if (datos.SolutionOne) {
                $.ajax({
                    url : "/api/findOneSolution" + idFav,
                    method : "GET",
                    dataType : "json",
                    contentType: "application/json",
                    success : function(responseJson) {
                        $("#fav").apend(`<li>
                                            <div>Titulo: `+responseJson.title+`</div>
                                            <div>Autor: `+responseJson.author+`</div>
                                            <div>Descripción: `+responseJson.description+`</div>
                                            <div>Fecha de creación: `+responseJson.datecreated+`</div>
                                            <div>Calificación: `+responseJson.grade+`</div>
                                         </li>`)
                    },
                    error : function(error) {
                        console.log(error);
                        $("#fav").apend(`<li>Solución no existente</li>`);
                    }
                })
            }
            if (datos.SolutionTwo) {
                $.ajax({
                    url : "/api/findOneSolution" + idFav,
                    method : "GET",
                    dataType : "json",
                    contentType: "application/json",
                    success : function(responseJson) {
                        $("#fav").apend(`<li>
                                            <div>Titulo: `+responseJson.title+`</div>
                                            <div>Autor: `+responseJson.author+`</div>
                                            <div>Descripción: `+responseJson.description+`</div>
                                            <div>Fecha de creación: `+responseJson.datecreated+`</div>
                                            <div>Calificación: `+responseJson.grade+`</div>
                                         </li>`)
                    },
                    error : function(error) {
                        console.log(error);
                        $("#fav").apend(`<li>Solución no existente</li>`);
                    }
                })
            }
            if (datos.SolutionThree) {
                $.ajax({
                    url : "/api/findOneSolution" + idFav,
                    method : "GET",
                    dataType : "json",
                    contentType: "application/json",
                    success : function(responseJson) {
                        $("#fav").apend(`<li>
                                            <div>Titulo: `+responseJson.title+`</div>
                                            <div>Autor: `+responseJson.author+`</div>
                                            <div>Descripción: `+responseJson.description+`</div>
                                            <div>Fecha de creación: `+responseJson.datecreated+`</div>
                                            <div>Calificación: `+responseJson.grade+`</div>
                                         </li>`)
                    },
                    error : function(error) {
                        console.log(error);
                        $("#fav").apend(`<li>Solución no existente</li>`);
                    }
                })
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
                    "level": "",
                    "lastlogindate": dnow,
                    "country": $("#coutnry").val(),
                    "business": $("#business").val(),
                    "Solution": {}
                }),
                method: "PUT",
                dataType: "json",
                contentType: "application/json",
                success: function (responseJson) {
                    alert("Usuario registrado");
                },
                error: function (error) {
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