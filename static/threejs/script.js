var ALERTS = false;
var mobile = false;
var AJAXING = false;
var SUCCESS = false;
var NOTIFCOUNT = 0;

$(document).ready(function () {

});

function ajaxWrapper(type, url, data, returnFunc, container){
    SUCCESS = false;
    AJAXING = true;

    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function (value) {
            AJAXING = false;
            SUCCESS = true;
            returnFunc(value, container);
        },
        error: function(xhr, status, error) {
            AJAXING = false;
            console.log(xhr.responseText);
        }
    });
}

function ajaxFileWrapper(type, url, data, returnFunc, container){
    SUCCESS = false;
    AJAXING = true;

    $.ajax({
        type: type,
        url: url,
        data: data,

        dataType: 'json',
        processData: false,
        contentType: false,

        success: function (value) {
            AJAXING = false;
            SUCCESS = true;
            returnFunc(value, container);
        },
        error: function(xhr, status, error) {
            AJAXING = false;
            console.log(xhr.responseText);
        }
    });
}


function showNotif(container, msg, color, btn){
    NOTIF = true;
    if (color == undefined){color = 'warning';}
    var num = NOTIFCOUNT;
    NOTIFCOUNT += 1;

    var notif = $('<p class="showInput col-xs-12"></p>');
    notif.append('<div class="row transitions alertbox" num="'+num+'" style="height:0px;overflow:;overflow:hidden;opacity:0;"></div>');
    notif.append('<div class="col-xs-12 alert alert-'+color+'" role="alert" style="margin-bottom:0px;">'+msg+'</div>');

    //Conditional add-ins for special buttons
    if (btn == 'details'){
        notif.find('.alert').append('<div class="btn btn-danger" onclick="goToStep(\'fullAddress\')" style="margin-left:10px;">Show Details</div>');
    } else if (btn == 'booking'){
        notif.find('.alert').append('<a class="btn btn-primary" href="'+ OTHER_HOUSE_LINK +'" style="margin-left:10px;">Continue Booking</a>');
    }

    $(container).append(notif);
}