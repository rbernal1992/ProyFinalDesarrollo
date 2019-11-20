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
            var Iditem;
            var ItemPrev;
            var ctx = [];
            
            for (check in responseJson){
            $('#listasoluciones').append(`<li><div> title: ` + responseJson[check].title + `</div>
                                            <div> author:` + responseJson[check].author + `</div>
                                            <div> description:` + responseJson[check].description + `</div>
                                            <div> review:` + responseJson[check].grade + `</div>
                                            <div> grade:` + responseJson[check].gradenum + `</div>
                                            <div> last user who accessed:` + responseJson.lastuseraccess + `</div>
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
}

init();