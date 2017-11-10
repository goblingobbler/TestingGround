var slideCount = 0;
var spouse = 0;
var children = 0;
var eligDate = 'January 1st';
var rollover = 0;

$(document).ready(function() {
	$('.slide[num='+slideCount+']').show();
	$('.slide[num='+slideCount+']').css('opacity',1);
	
	$('.dk_options li a').click(function(){
		eligDate = $(this).html();
		$('.dk_label').html(eligDate);
	});
	
	$('.inputCont input').keyup(function(){changeRollover(this);});
});

function next(i){
	var temp = slideCount + i;
	$('.slide[num="'+temp+'"]').show();
	$('.slide[num="'+(slideCount)+'"]').css('opacity',0);
	
	setTimeout(function(){
		$('.slide[num="'+slideCount+'"]').hide();
		$('.slide[num="'+temp+'"]').css('opacity',1);
		slideCount += i;
		
		if (slideCount > 0 && $('.backbtn').css('display') == 'none'){
			$('.backbtn').show();
			setTimeout(function(){$('.backbtn').css('opacity',1);},0);}
		else if (slideCount == 0){$('.backbtn').hide();}
	},400);
}

function showSub(){
	$('.slide[num="'+slideCount+'"] .main').css('opacity',0);
	
	setTimeout(function(){
		$('.slide[num="'+slideCount+'"] .main').hide();
		$('.slide[num="'+slideCount+'"] .subslide').show();
		setTimeout(function(){$('.slide[num="'+slideCount+'"] .subslide').css('opacity',1);},0);
	},400);
}

function changeSpouse(i){
	spouse = i;
	next(1);
}
function changeChildren(i){
	children += i;
	if (children < 0){children = 0;}
	$('.childDisplay').html(children);
	
}

function changeRollover(thisObject){
	rollover = parseInt($(thisObject).val());
}