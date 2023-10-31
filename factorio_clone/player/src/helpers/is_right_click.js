

function is_right_click(e){
    var is_right = false;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        is_right = e.which == 3;
    else if ("button" in e)  // IE, Opera
        is_right = e.button == 2;

    return is_right;
}

export default is_right_click;
