//ejemplo de formato de imagen data = [0,255,8,30,....muchos numeros más]
var contador = 0;
var globalUser;
var allPosts;
let page = 0;
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
                globalUser = responseJson;
                //console.log(responseJson);
                usuario = responseJson;
                if (usuario == "none") {
                    $("#nModify").css("visibility", "hidden");
                }
                else {
                    $("#nModify").css("visibility", "visible");
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
    // DisplaySolutions
    var check;
    $.ajax({
        url: "/api/solutionslist",
        method: "GET",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        contentType: "application/json",
        success: function (responseJson) {
            allPosts = responseJson;
            var Iditem;
            var ItemPrev;
            var ctx = [];
            var i;
            
            for (i = page*5; i < i+5; i++){
            $('#listasoluciones').append(`<li><div> title: ` + allPosts[i].title + `</div>
                                            <div class="id`+i+`" style="visibility: hidden">`+allPosts[i]._id+`</div> 
                                            <div> author:` + allPosts[i].author + `</div>
                                            <div> description:` + allPosts[i].description + `</div>
                                            <div> review:` + allPosts[i].grade + `</div>
                                            <div> grade:` + allPosts[i].gradenum + `</div>
                                            <div> last user who accessed:` + responseJson.lastuseraccess + `</div>
                                            <div> Favorito: <button class="favorito">Favorito</button>
                                            <canvas id="ItemPrev`+contador+`"> </canvas>
                                           </li>`);
            
            var img = new Image();
            bufferurl[contador] = responseJson[check].imageOne;	
            Iditem = "ItemPrev" + contador;
                ItemPrev = document.getElementById(Iditem);
                //console.log(ItemPrev);
                img.src = bufferurl[contador];
                ctx[contador] = ItemPrev.getContext("2d");
                //console.log("After context");
                loadSprite(bufferurl[contador],ctx[contador],function(){
                    
                });
                //img.src = responseJson[check].imageOne;
                //console.log(img.src);
            
                /*img.onload = function(){
                    console.log("Image Onload");
                    ctx.drawImage(img, 33, 71, 500,300);
                
                }*/
            //console.log(bufferurl[contador]);
            contador++;
            };
        },
        error: function (err) {
            $('#status').append(`Something went wrong, try again later`);
        },
            async: false
    });

    // Favorito
    $("#solutions").on("click", ".favorito", function(event) {
        event.preventDefault();
        let favID = $("#favID"+this.id).text();

        $.ajax({
            url : "/api/addUserFav/" + globalUser,
            data : JSON.stringify({
                "nId" : favID
            }),
            method : "PUT",
            dataType : "json",
            contentType : "application/json",
            success : function(responseJson) {
                alert("Post añadido a favoritos");
            },
            error : function(error) {
                console.log(error);
            }
        });
    });

    if (page == 0) {
        $("#prev").css("visibility", "hidden");
    }
    else {
        $("#prev").css("visibility", "visible");
    }
}

init();