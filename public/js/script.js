//ejemplo de formato de imagen data = [0,255,8,30,....muchos numeros más]

function init(){
	//Esto necesitas para desplegar la imagen obtenida desde el elemento image.data de la colección soluciones
/*"use strict";
 var ItemPrev = document.getElementById("ItemPrev");
 var ctx = ItemPrev.getContext("2d");
var uInt8Array = data;
var i = uInt8Array.length;
var binaryString = [i];
while(i--){
	binaryString[i] = String.fromCharCode(uInt8Array[i]);
}	
var nData = binaryString.join('');
var base64 = window.btoa(nData);

var img = new Image();
img.src = "data:image/png;base64," + base64;
img.onload = function(){
	console.log("Image Onload");
	ctx.drawImage(img, 33, 71, 500,300);
	
}*/
//esto no
    $('#submt').on("click", function (event) {
        event.preventDefault();
        $.ajax({
            url: "http://localhost:8080/api/login?" + "username=" + $('#additemtitle').val() + "&password=" + $('#additemcontent').val(),
            method: "POST",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            contentType: "application/json",
            success: function (responseJson) {
                $('#status').append(`<div>` + responseJson.username + `logged in</div>`);
                console.log(responseJson);

            },

            error: function (err) {
                $('#status').append(`Something went wrong, try again later`);


            }



        });


    });

    //check user logged in
    $('#checkuser').on("click", function (event) {
        event.preventDefault();
        $.ajax({
            url: "http://localhost:8080/api/checksession",
            method: "GET",
            dataType: "json",
            contentType: "application/json",
            xhrFields: {
                withCredentials: true
            },
            success: function (responseJson) {
                $('#checkuserlist').append(`<div>user is ` + responseJson  + `</div>`);
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
            url: "http://localhost:8080/api/logout",
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