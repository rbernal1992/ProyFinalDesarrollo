var slideIndex = 1;
showSlides(slideIndex);
var usuario;
var califs = [];

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

    $.ajax({
        url: "/api/solutionslist",
        method: "GET",
        dataType: "json",
        contentType: "application/json",
        success: function (responseJson) {
            for (each in responseJson) {
                let ky = responseJson[each].id;
                let value = responseJson[each].grade;
                califs.push({
                    ky: value
                })
            }
            // Create items array
            var items = Object.keys(califs).map(function (key) {
                return [key, califs[key]];
            });

            // Sort the array based on the second element
            items.sort(function (first, second) {
                return second[1] - first[1];
            });

            // Create a new array with only the first 5 items
            items.slice(0, 5);

            for (i in items) {
                $("#mejores").append(`<li><div> title: ` + items[i].title + `</div>
                                        <div id="id0" style="visibility: hidden">`+ items[i]._id + `</div> 
                                        <div> author:` + items[i].author + `</div>
                                        <div> description:` + items[i].description + `</div>
                                        <div> review:` + items[i].grade + `</div>
                                        <div> last user who accessed:` + responseJson.lastuseraccess + `</div>
                                        <div> Favorito: <button class="favorito">Favorito</button>
                                        <canvas id="ItemPrev`+ contador + `"> </canvas>
                                      </li>`);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

init();
showSlides();