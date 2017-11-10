
$(document).ready(function(){
	var time = 500;
	
	setTimeout(function(){
		if ($(window).scrollTop() > 0){
			time = 10;
			$('.titleUnderline').hide();
			$('.titleUnderscore').hide();
			loadInner(time);
			setTimeout(function(){
				$('.titleUnderline').show();
				$('.titleUnderscore').show();
			},20);
		}
	},50);

	setTimeout(function(){$('.titleUnderline').width(500);
	setTimeout(function(){$('.titleUnderscore').css('top',0);
						loadInner(250);},250);},time);
});

function loadInner(time){
	setTimeout(function(){
	$('.slide').each(function(i){
		var wait = time*i;
		if (time == 10){wait = 10};
		
		var thisObject = $(this);
		setTimeout(function(){thisObject.addClass('shown');},time*i);
	});},time);
}

function scrolSlide(className){
	$('html, body').animate({scrollTop:$(className).offset().top-40},500);
}