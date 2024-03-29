var slideIndex = 1;
showSlides(slideIndex);
var usuario;
var califs = [];
var obj = {};
var contador = 0;

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
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
            console.log("entro");
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

    //----------------------------------sort 
	
	$.ajax({
        url: "/api/solutionslist",
        method: "GET",
        dataType: "json",
        contentType: "application/json",
        success: function (responseJson) {
			var sortable = [];
			for(var chk in responseJson){
				sortable.push([responseJson[chk], (responseJson[chk].grade/responseJson[chk].gradenum)]);
				
			}
			
			sortable.sort(function(a,b){
				return a[1] - b[1];
				
			});
			console.log(sortable);
			
			var newArray = [];
			for(var chk in sortable)
			{
				newArray[chk] = sortable[chk][0];
			}
			console.log(newArray);
			var contsol = 0;
		  for (var chkk in newArray) {
			  if(contsol > 1){
             $("#mejores").append(`<li><div> title: ` + newArray[chkk].title + `</div>
                                                <div id="id0" style="visibility: hidden">`+ newArray[chkk]._id + `</div> 
                                                <div> author:` + newArray[chkk].author + `</div>
                                                <div> description:` + newArray[chkk].description + `</div>
                                                <div> review:` + newArray[chkk].grade + `</div>
                                                <div> last user who accessed:` + newArray[chkk].lastuseraccess + `</div>
                                                
			  </li>`);
			  }
			  contsol++;
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
	
	
	
	
}

init();
showSlides();