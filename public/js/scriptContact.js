var usuario;

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

    $(document).ready(function () {
        $('form').submit(function (event) {
            event.preventDefault();
            var mailto_link = 'mailto:' + $('#email').val() + '?subject=' + $('#subject').val() + '&body=' + $('#body').val();

            win = window.open(mailto_link, 'emailWindow');
            if (win && win.open && !win.closed) win.close();
        });
    });
}

init();