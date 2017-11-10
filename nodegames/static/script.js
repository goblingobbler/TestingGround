

var MESSAGEWRAPPER = $('<div></div>');
function chatMessage(msg){
    var chat = $('.chat .channel');
    var message = MESSAGEWRAPPER.clone();
    message.html(msg);
    chat.append(message);
}