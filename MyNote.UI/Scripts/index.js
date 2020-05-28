//GLOBAL VARIABLES

var apiUrl = "https://localhost:44372/";


        
//FUNCTIONS
function checkLogin() {  
    // todo:sessionstorage ve localstorage da tutulan login bilgilerine bakarak
    // login olup olmadığına karar ver ve eğer logins uygulamayı aç
    // login değilse login/register sayfasını göster
    var loginData = getLoginData();

    //giriş jetonu yok
    if (!loginData || !loginData.access_token) {
        showLoginPage();
        return;
    }
    // token'ı geçerli mi?
    $.ajax({
        url: apiUrl + "api/Account/UserInfo",
        type: "GET",
        headers: { Authorization: "Bearer " + loginData.access_token },
        success: function (data) {
             showAppPage();
        },
        error: function () {
            showLoginPage();
        }
    });
}

function showLoginPage() {
    $(".only-logged-in").hide();
    $(".only-logged-out").show();
    $(".page").hide();
    $("#page-login").show();
}

function showAppPage() {
    $(".only-logged-in").show();
    $(".only-logged-out").hide();
    $(".page").hide();
    $("#page-app").show();
}

function getLoginData() {
    // todo:sessionstorage da, eğer orada bulamadıysan
    // localstorage da kayıtlı login data yı json'dan object'e dönüştür ve yolla
    // eğer yoksa null yolla
    var json = sessionStorage["login"] || localStorage["login"];

    if (json) {
        try {
            return JSON.parse(json);
        }
        catch(e) {
            return null;
        }
    }

    return null;

}

function success(message) {
    //aktif olanın message classını içeren
    $(".tab-pane.active .message")
        .removeClass("alert-danger")
        .addClass("alert-success")
        .text(message)
        .show();

}

function error(modelState) {
    if (modelState) {
        var errors = [];
        for (var prop in modelState) {
            for (var i = 0; i < modelState[prop].length; i++) {
                errors.push(modelState[prop][i]);
            }
        }
    }

    var ul = $("<ul>");
    for (var i = 0; i < errors.length; i++) {
        ul.append($("<li>").text(errors[i]));
        $(".tab-pane.active .message")
            .removeClass("alert-success")
            .addClass("alert-danger")
            .html(ul)
            .show();
    }
}

function errorMessage(message) {
    if (message) {
        $(".tab-pane.active .message")
            .removeClass("alert-success")
            .addClass("alert-danger")
            .text(message)
            .show();
    }
}

function resetLoginForms() {
    $(".message").hide();
    $("#login form").each(function () {
        this.reset();
    });
}

//EVENTS

$(document).ajaxStart(function () {
    $(".loading").removeClass("d-none");
});

$(document).ajaxStop(function () {
    $(".loading").addClass("d-none");
});

//register
$("#signupform").submit(function (event) {
    event.preventDefault();
    var formdata = $(this).serialize();

    $.post(apiUrl + "api/Account/Register", formdata, function (data) {
        resetLoginForms();
        success("Your account has been succesfully created. ");

    }).fail(function (xhr) {
        error(xhr.responseJSON.ModelState);

    });
});

//login
$("#signinform").submit(function (event) {
    event.preventDefault();
    var formdata = $(this).serialize();

    $.post(apiUrl + "Token", formdata, function (data) {


        var datastr = JSON.stringify(data);
        if ($("#signinrememberme").prop("checked")) {
            sessionStorage.removeItem("login");
            localStorage["login"] = datastr;
        } else {
            localStorage.removeItem("login");
            sessionStorage["login"] = datastr;
        }
        resetLoginForms();
        success("You have been logged in successfully. Redirecting..");

        setTimeout(function () {
            resetLoginForms();
            showAppPage();
        }, 1000);

    }).fail(function (xhr) {
        errorMessage(xhr.responseJSON.error_description);

    });
});

// https://getbootstrap.com/docs/4.0/components/navs/#events
$('#login a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
    // e.target // newly activated tab
    // e.relatedTarget // previous active tab
    resetLoginForms();

});

//https://getbootstrap.com/docs/4.0/components/navs/#via-javascript

$(".navbar-login a").click(function (event) {
    event.preventDefault();
    var href = $(this).attr("href");
    $('#pills-tab a[href="' + href + '"]').tab('show') // Select tab by name

});


//logout
$("#btnLogout").click(function (event) {
    event.preventDefault();
    sessionStorage.removeItem("login");
    localStorage.removeItem("login");
    showLoginPage();
});

// ACTIONS
checkLogin();