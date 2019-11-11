//ejemplo de formato de imagen data = [0,255,8,30,....muchos numeros más]

function init(){
	//Esto necesitas para desplegar la imagen obtenida desde el elemento image.data de la colección soluciones
"use strict";
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
	
}
//esto no
 fetch('/api/students')
		.then( response => {

			if ( response.ok ){
				return response.json();
			}

			throw new Error ( response.statusText );
		})
		.then( responseJSON => {

			for ( let i = 0; i < responseJSON.length; i ++ ){
				$('#studentList').append(`<li>
											${responseJSON[i].firstName}
										</li>`);
			}
		})
		.catch( err => {
			console.log( err );
		});
		
		


}

init();