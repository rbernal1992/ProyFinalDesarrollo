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
            console.log(responseJson);
            usuario = responseJson[0].username;
            if (usuario == "none") {
                $("#nModify").css("visibility", "hidden");
                $("#nNew").css("visibility", "hidden");
            }
            else {
                $("#nModify").css("visibility", "visible");
                $("#nNew").css("visibility", "visible");
            }
            datos = responseJson;
            $("#user").val(datos[0].username);
            $("#user").prop("disabled", true);
            $("#country").val(datos[0].country);
            $("#business").val(datos[0].business);
            
            if (datos[0].SolutionOne) {
				idFav = datos[0].SolutionOne;
                $.ajax({
                    url : "/api/findOneSolution?id=" + idFav,
                    method : "GET",
                    dataType : "json",
                    contentType: "application/json",
                    success : function(responseJson) {
                        $("#fav").append(`<li>
                                            <div>Titulo: `+responseJson.title+`</div>
                                            <div>Autor: `+responseJson.author+`</div>
                                            <div>Descripción: `+responseJson.description+`</div>
                                            <div>Fecha de creación: `+responseJson.datecreated+`</div>
                                            <div>Calificación: `+responseJson.grade+`</div>
                                         </li>`)
                    },
                    error : function(error) {
                        console.log(error);
                        $("#fav").append(`<li>Solución no existente</li>`);
                    }
                })
            }
            if (datos[0].SolutionTwo) {
				idFav = datos[0].SolutionTwo;
                $.ajax({
                    url : "/api/findOneSolution?id=" + idFav,
                    method : "GET",
                    dataType : "json",
                    contentType: "application/json",
                    success : function(responseJson) {
                        $("#fav").append(`<li>
                                            <div>Titulo: `+responseJson.title+`</div>
                                            <div>Autor: `+responseJson.author+`</div>
                                            <div>Descripción: `+responseJson.description+`</div>
                                            <div>Fecha de creación: `+responseJson.datecreated+`</div>
                                            <div>Calificación: `+responseJson.grade+`</div>
                                         </li>`)
                    },
                    error : function(error) {
                        console.log(error);
                        $("#fav").append(`<li>Solución no existente</li>`);
                    }
                })
            }
            if (datos[0].SolutionThree) {
				idFav = datos[0].SolutionThree;
                $.ajax({
                    url : "/api/findOneSolution?id=" + idFav,
                    method : "GET",
                    dataType : "json",
                    contentType: "application/json",
                    success : function(responseJson) {
                        $("#fav").append(`<li>
                                            <div>Titulo: `+responseJson.title+`</div>
                                            <div>Autor: `+responseJson.author+`</div>
                                            <div>Descripción: `+responseJson.description+`</div>
                                            <div>Fecha de creación: `+responseJson.datecreated+`</div>
                                            <div>Calificación: `+responseJson.grade+`</div>
                                         </li>`)
                    },
                    error : function(error) {
                        console.log(error);
                        $("#fav").append(`<li>Solución no existente</li>`);
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
		let pais = $("#country").find(":selected").text();
        if ($("#pswd").val() == $("#repPswd").val()) {
            $.ajax({
                url: "/api/updateUser",
                data: JSON.stringify({
                    "username": $("#user").val(),
                    "password": $("#pswd").val(),
                    "country": pais,
                    "business": $("#business").val()
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