//ejemplo de formato de imagen data = [0,255,8,30,....muchos numeros más]
var contador = 0;
var globalUser;
var allPosts;
let page = 0;
var usuario;
var bufferurl = [];
File.prototype.convertToBase64 = function(callback){
    var reader = new FileReader();
    reader.onloadend = function (e) {
        callback(e.target.result, e.target.error);
    };   
    reader.readAsDataURL(this);
};
function loadSprite(src, ctx ,callback){
	//var Sprite = new Image();
	console.log(ctx);
	var img = new Image();
	img.src = src;
	img.onload = function() {
    ctx.drawImage(img, 0, 0, 200, 150);
	};
	
}	

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
                console.log(responseJson);
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


            },
			async: false
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
            
            for (i in responseJson){
			if(globalUser[0].level == 1 || globalUser == "none"){
            $('#listasoluciones').append(`<li><div> Titulo: ` + allPosts[i].title + `</div>
                                            <div id="id0" style="visibility: hidden">`+allPosts[i]._id+`</div> 
                                            <div> Autor:` + allPosts[i].author + `</div>
                                            <div> Descripcion:` + allPosts[i].description + `</div>
                                            <div> Calificacion:` + (allPosts[i].grade / allPosts[i].gradenum) + `</div>
                                            <div> Ultimo usuario accesado:` + responseJson.lastuseraccess + `</div>
                                            <div> Favorito: <button class="favorito">Favorito</button></div>
                                            <div><canvas id="ItemPrev`+contador+`"> </canvas></div>
											<div><label for="gradsol">Califica la solucion </label><input id="gradsol" type="number" min="0" max="10" /></div>
											<div><button class="calif">Calificar</button></div>
                                           </li>`);
            }
			else
			{
				   $('#listasoluciones').append(`<li><div> Titulo: ` + allPosts[i].title + `</div>
                                            <div id="id0" style="visibility: hidden">`+allPosts[i]._id+`</div> 
                                            <div> Autor:` + allPosts[i].author + `</div>
                                            <div> Descripcion:` + allPosts[i].description + `</div>
                                            <div> Calificacion:` + allPosts[i].gradenum + `</div>
                                            <div> Ultimo usuario accesado:` + responseJson.lastuseraccess + `</div>
                                            <div> Favorito: <button class="favorito">Favorito</button></div>
                                            <div><canvas id="ItemPrev`+contador+`"> </canvas></div>
											<div><label for="mtitle">Titulo</label><input type="text" id="mtitle" value="` + allPosts[i].title + `"/></div>
											<div><label for="mauthor">Autor</label><input type="text" id="mauthor" value="` + allPosts[i].author + `"/></div>
                                            <div><label for="mdescription">Descripcion</label><textarea id="mdescription" cols="30" rows="10">`+allPosts[i].description + `</textarea></div>                                        
											<div> Modificar: <button class="modificar">Modificar</button></div>
											<div> Eliminar: <button class="eliminar">Eliminar</button></div>
                                           </li>`);
				
				
			}
            var img = new Image();
			
            bufferurl[contador] = responseJson[i].imageOne;
			//console.log(bufferurl[contador]);
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
        let favID = $(this).parent().parent().find('#id0').html();
		console.log(globalUser[0].username);
        $.ajax({
            url : "/api/addUserFav/" + globalUser[0].username,
            data : JSON.stringify({
                "nid" : favID
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
	$("#solutions").on("click", ".modificar", function(event) {
        event.preventDefault();
		let favID = $(this).parent().parent().find('#id0').html();
		let title = $(this).parent().parent().find('#mtitle').val();
		let author = $(this).parent().parent().find('#mauthor').val();
		let description = $(this).parent().parent().find('#mdescription').val();
		
		console.log("title: " + title + " author: " + author + " id " + favID );
		//console.log(globalUser[0].username);
        $.ajax({
            url : "/api/updateSolution/" + favID,
            data : JSON.stringify({
                "title" : title,
				"author" : author,
				"description" : description
            }),
            method : "PUT",
            dataType : "json",
            contentType : "application/json",
            success : function(responseJson) {
                alert("Post modificado");
				console.log(responseJson);
            },
            error : function(error) {
                console.log(error);
            },
			async: false
        });
		$('#listasoluciones').empty();
		//reload description
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
            
            for (i in responseJson){
			if(globalUser[0].level == 1  || globalUser == "none"){
            $('#listasoluciones').append(`<li><div> Titulo: ` + allPosts[i].title + `</div>
                                            <div id="id0" style="visibility: hidden">`+allPosts[i]._id+`</div> 
                                            <div> Autor:` + allPosts[i].author + `</div>
                                            <div> Descripcion:` + allPosts[i].description + `</div>
                                            <div> Calificacion:` + (allPosts[i].grade / allPosts[i].gradenum) + `</div>
                                            <div> Ultimo usuario accesado:` + responseJson.lastuseraccess + `</div>
                                            <div> Favorito: <button class="favorito">Favorito</button></div>
                                            <div><canvas id="ItemPrev`+contador+`"> </canvas></div>
											<div><label for="gradsol">Califica la solucion </label><input id="gradsol" type="number" min="0" max="10" /></div>
											<div><button class="calif">Calificar</button></div>
                                           </li>`);
            }
			else
			{
				   $('#listasoluciones').append(`<li><div> Titulo: ` + allPosts[i].title + `</div>
                                            <div id="id0" style="visibility: hidden">`+allPosts[i]._id+`</div> 
                                            <div> Autor:` + allPosts[i].author + `</div>
                                            <div> Descripcion:` + allPosts[i].description + `</div>
                                            <div> Calificacion:` + (allPosts[i].grade / allPosts[i].gradenum) + `</div>
                                            <div> Ultimo usuario accesado:` + responseJson.lastuseraccess + `</div>
                                            <div> Favorito: <button class="favorito">Favorito</button></div>
                                            <div><canvas id="ItemPrev`+contador+`"> </canvas></div>
											<div><label for="mtitle">Titulo</label><input type="text" id="mtitle" value="` + allPosts[i].title + `"/></div>
											<div><label for="mauthor">Autor</label><input type="text" id="mauthor" value="` + allPosts[i].author + `"/></div>
                                            <div><label for="mdescription">Descripcion</label><textarea id="mdescription" cols="30" rows="10">`+allPosts[i].description + `</textarea></div>                                        
											<div> Modificar: <button class="modificar">Modificar</button></div>
											<div> Eliminar: <button class="eliminar">Eliminar</button></div>
                                           </li>`);
				
				
			}
            var img = new Image();
			
            bufferurl[contador] = responseJson[i].imageOne;
			//console.log(bufferurl[contador]);
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
		
		
		
    });
	
	
	
	
	
	//eliminar-----------------------------------------------------------------------------------------------
	$("#solutions").on("click", ".eliminar", function(event) {
        event.preventDefault();
		let favID = $(this).parent().parent().find('#id0').html();
		
		//console.log("title: " + title + " author: " + author + " id " + favID );
		//console.log(globalUser[0].username);
        $.ajax({
            url : "/api/deleteSolution/" + favID,
            method : "DELETE",
            dataType : "json",
            contentType : "application/json",
            success : function(responseJson) {
                alert("Post borrado");
				console.log(responseJson);
            },
            error : function(error) {
                console.log(error);
            },
			async: false
        });
		$('#listasoluciones').empty();
		//reload description
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
            
            for (i in responseJson){
			if(globalUser[0].level == 1  || globalUser == "none"){
             $('#listasoluciones').append(`<li><div> Titulo: ` + allPosts[i].title + `</div>
                                            <div id="id0" style="visibility: hidden">`+allPosts[i]._id+`</div> 
                                            <div> Autor:` + allPosts[i].author + `</div>
                                            <div> Descripcion:` + allPosts[i].description + `</div>
                                            <div> Calificacion:` + (allPosts[i].grade / allPosts[i].gradenum) + `</div>
                                            <div> Ultimo usuario accesado:` + responseJson.lastuseraccess + `</div>
                                            <div> Favorito: <button class="favorito">Favorito</button></div>
                                            <div><canvas id="ItemPrev`+contador+`"> </canvas></div>
											<div><label for="gradsol">Califica la solucion </label><input id="gradsol" type="number" min="0" max="10" /></div>
											<div><button class="calif">Calificar</button></div>
                                           </li>`);
            }
			else
			{
				   $('#listasoluciones').append(`<li><div> Titulo: ` + allPosts[i].title + `</div>
                                            <div id="id0" style="visibility: hidden">`+allPosts[i]._id+`</div> 
                                            <div> Autor:` + allPosts[i].author + `</div>
                                            <div> Descripcion:` + allPosts[i].description + `</div>
                                            <div> Calificacion:` + (allPosts[i].grade / allPosts[i].gradenum) + `</div>
                                            <div> Ultimo usuario accesado:` + responseJson.lastuseraccess + `</div>
                                            <div> Favorito: <button class="favorito">Favorito</button></div>
                                            <div><canvas id="ItemPrev`+contador+`"> </canvas></div>
											<div><label for="mtitle">Titulo</label><input type="text" id="mtitle" value="` + allPosts[i].title + `"/></div>
											<div><label for="mauthor">Autor</label><input type="text" id="mauthor" value="` + allPosts[i].author + `"/></div>
                                            <div><label for="mdescription">Descripcion</label><textarea id="mdescription" cols="30" rows="10">`+allPosts[i].description + `</textarea></div>                                        
											<div> Modificar: <button class="modificar">Modificar</button></div>
											<div> Eliminar: <button class="eliminar">Eliminar</button></div>
                                           </li>`);
				
				
			}
            var img = new Image();
			
            bufferurl[contador] = responseJson[i].imageOne;
			//console.log(bufferurl[contador]);
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
	});
		//calificar-------------------------------------------------------------------------------------------------------------------------------------------
		
		$("#solutions").on("click", ".calif", function(event) {
        event.preventDefault();
		let favID = $(this).parent().parent().find('#id0').html();
		let grade = $(this).parent().parent().find('#gradsol').val();
		//console.log("title: " + title + " author: " + author + " id " + favID );
		//console.log(globalUser[0].username);
        $.ajax({
            url : "/api/gradeSolution/" + favID,
			data: JSON.stringify({ "grade" : grade }),
            method : "PUT",
            dataType : "json",
            contentType : "application/json",
            success : function(responseJson) {
                alert("Post calif");
				console.log(responseJson);
            },
            error : function(error) {
                console.log(error);
            },
			async: false
        });
		$('#listasoluciones').empty();
		//reload description
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
            
            for (i in responseJson){
			if(globalUser[0].level == 1  || globalUser == "none"){
             $('#listasoluciones').append(`<li><div> Titulo: ` + allPosts[i].title + `</div>
                                            <div id="id0" style="visibility: hidden">`+allPosts[i]._id+`</div> 
                                            <div> Autor:` + allPosts[i].author + `</div>
                                            <div> Descripcion:` + allPosts[i].description + `</div>
                                            <div> Calificacion:` + (allPosts[i].grade / allPosts[i].gradenum) + `</div>
                                            <div> Ultimo usuario accesado:` + responseJson.lastuseraccess + `</div>
                                            <div> Favorito: <button class="favorito">Favorito</button></div>
                                            <div><canvas id="ItemPrev`+contador+`"> </canvas></div>
											<div><label for="gradsol">Califica la solucion </label><input id="gradsol" type="number" min="0" max="10" /></div>
											<div><button class="calif">Calificar</button></div>
                                           </li>`);
            }
			else
			{
				   $('#listasoluciones').append(`<li><div> Titulo: ` + allPosts[i].title + `</div>
                                            <div id="id0" style="visibility: hidden">`+allPosts[i]._id+`</div> 
                                            <div> Autor:` + allPosts[i].author + `</div>
                                            <div> Descripcion:` + allPosts[i].description + `</div>
                                            <div> Calificacion:` + (allPosts[i].grade / allPosts[i].gradenum) + `</div>
                                            <div> Ultimo usuario accesado:` + responseJson.lastuseraccess + `</div>
                                            <div> Favorito: <button class="favorito">Favorito</button></div>
                                            <div><canvas id="ItemPrev`+contador+`"> </canvas></div>
											<div><label for="mtitle">Titulo</label><input type="text" id="mtitle" value="` + allPosts[i].title + `"/></div>
											<div><label for="mauthor">Autor</label><input type="text" id="mauthor" value="` + allPosts[i].author + `"/></div>
                                            <div><label for="mdescription">Descripcion</label><textarea id="mdescription" cols="30" rows="10">`+allPosts[i].description + `</textarea></div>                                        
											<div> Modificar: <button class="modificar">Modificar</button></div>
											<div> Eliminar: <button class="eliminar">Eliminar</button></div>
                                           </li>`);
				
				
			}
            var img = new Image();
			
            bufferurl[contador] = responseJson[i].imageOne;
			//console.log(bufferurl[contador]);
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
		
		
		
		
		
		
		
		
		
		
		
		
		
		
    });
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
    if (page == 0) {
        $("#prev").css("visibility", "hidden");
    }
    else {
        $("#prev").css("visibility", "visible");
    }
}

init();