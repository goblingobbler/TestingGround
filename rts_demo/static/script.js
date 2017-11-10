var i = 0;
var unitMove = 20;
var units = [];

$(document).ready(function() {
	$( ".draggable" ).draggable();
	
	$('.gamePiece').each(function(){
		$(this).attr('num', units.length);
		units.push({'object':this,'move':0,'health':10,'attack':1});
		var z = 2*$(this).height();
		$(this).append('<div class="circle" style="width:'+z+'px;height:'+z+'px;"></div>');
		$(this).append('<div class="health">'+units[units.length-1].health+'</div>');
	});
	
	if (document.addEventListener) {
        document.addEventListener('contextmenu', function(e) {
			left = $(document).width()/2 - $('.gameboard').width()/2;
			right = $('.gameboard').width() + left;
			if (e.clientX >= left && e.clientX <= right && e.clientY <= $('.gameboard').height()){
				e.preventDefault();
				moveUnits(e.clientX - left, e.clientY);
			}
        }, false);
    } else {
        document.attachEvent('oncontextmenu', function() {
            alert("You've tried to open context menu");
            window.event.returnValue = false;
        });
    }
	
    $('.gameboard').selectable({ 
                start: function(e) {
                        //get the mouse position on start
                        x_begin = e.pageX,
                        y_begin = e.pageY;
                    },
                stop: function(e) {
                        //get the mouse position on stop
                        x_end = e.pageX,
                        y_end = e.pageY;
                        /***  if dragging mouse to the right direction, calcuate width/height  ***/
						$('.gamePiece').removeClass('selected');
						
                        if( x_end - x_begin >= 1 ) {
                            width  = x_end - x_begin,
                            height = y_end - y_begin;
							$('.gamePiece').each(function(){
								if (inBoundingBox(this, x_begin, y_begin, x_end, y_end)){
									$(this).addClass('selected');
								}
							});
                        /***  if dragging mouse to the left direction, calcuate width/height (only change is x) ***/
                        } else {
                            width  = x_begin - x_end,
                            height =  y_end - y_begin;
                            var drag_left = true;
							$('.gamePiece').each(function(){
								if (inBoundingBox(this, x_end, y_end, x_begin, y_begin)){
									$(this).addClass('selected');
								}
							});
                        }
                        i++;
                }});
});


function inBoundingBox(thisObject, left, top, right, bottom){
	thisLeft = $(thisObject).position().left + $(thisObject).width()/2;
	thisTop = $(thisObject).position().top + $(thisObject).height()/2;
	left = left - ($(document).width()/2 - $('.gameboard').width()/2);
	right = right - ($(document).width()/2 - $('.gameboard').width()/2);
	if (thisTop <= bottom && thisTop >= top){
		if (thisLeft <= right && thisLeft >= left){
			return true;
		}
	}
	return false;
}

function moveUnits(x, y){
	$('.gamePiece.selected').each(function(){
		$(this).addClass('moving');
		units[$(this).index()].move += 1;
		moveUnit(this, x, y, units[$(this).index()].move);
	});
}
function moveUnit(unit, x, y, num){
	var j = $(unit).index();
	if (units[$(unit).index()].move == num){
		var i = unitMove;
		var again = false;
		
		if ($(unit).position().top < y){i = -unitMove}
		var a = y - $(unit).position().top + i;
		var b = y - $(unit).position().top;
		if (Math.abs(a) < Math.abs(b)){
			again = true;
		}
		else { i = 0;}
		var newTop = $(unit).position().top - i;
		
		var j = unitMove;
		if ($(unit).position().left < x){j = -unitMove}
		var a = x - $(unit).position().left + j;
		var b = x - $(unit).position().left;
		if (Math.abs(a) < Math.abs(b)){
			again = true;
		}
		else { j = 0;}
		var newLeft = $(unit).position().left - j;
		
		var dist = $(unit).height()*2;
		$('.gamePiece').each(function(){
			var z = Math.sqrt(Math.pow(newTop - $(this).position().top, 2) + Math.pow(newLeft - $(this).position().left, 2));
			if (z < dist && z > 0){
				console.log('Intercetction');
				var g = Math.sqrt(Math.pow($(unit).position().top - $(this).position().top, 2) + Math.pow($(unit).position().left - $(this).position().left, 2));
				if (g > z){
					again = false;
					setTimeout(function(){
						moveUnit(unit, x, y, num);},425);
				}
			}
		});
		
		if (again){
			$(unit).css('top', $(unit).position().top - i);
			$(unit).css('left', $(unit).position().left - j);
			setTimeout(function(){
				moveUnit(unit, x, y, num);},125);
		}
	}
}	
