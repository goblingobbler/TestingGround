$(window).ready(function() {
  //Setup the board and choose the starting color
  setup('red');
});

function setup(startingColor){
  //Lay down the checkerboard
  for (var i=0;i<8;i++){
    $('.checkerBoard').append('<tr row="'+i+'"></tr>');
    for (var j=0;j<8;j++){
      var color = 'black';
      if ((i+j)%2 == 0){color = 'white'};
      $('.checkerBoard tr[row='+i+']').append('<td class="cell '+color+'" row="'+i+'" col="'+j+'"></td>');
    }
  }
  //Create the pieces
  for (var i=0;i<4;i++){
    for (var j=0;j<3;j++){
      $('.checkerBoard [row='+(i*2+(j%2))+'][col='+j+']').append('<div class="piece black"><div class="kingCenter">&#9812;</div></div>');
      $('.checkerBoard [row='+(i*2+((j+1)%2))+'][col='+(7-j)+']').append('<div class="piece red"><div class="kingCenter">&#9812;</div></div>');
    }
  }
  
  //give the pieces draggablility
  $('.piece').draggable({
      containment: '.checkerBoard',
      cursor: 'move',
      revert: true,
      start: findCells,
      stop: removeActive,
      helper: myHelper
    });
  
  $('.piece.'+startingColor).draggable('disable');
}

function findCells(event, ui){
  //When a piece is picked up, find the possible moves
  var row = parseInt($(this).parent().attr('row'));
  var col = parseInt($(this).parent().attr('col'));
  var dir = 1;
  var color = 'black';
  if ($(this).hasClass('red')){
    dir = -1;
    color = 'red';
  }
  piece = $(this);
  checkCells(piece,row,col,dir,color,0);
}

function checkCells(piece,row,col,dir,color,double){
  if (piece.hasClass('king')){
    checkCell(row,col,1,dir*-1,color,double);
    checkCell(row,col,-1,dir*-1,color,double);
  }
  checkCell(row,col,1,dir,color,double);
  checkCell(row,col,-1,dir,color,double);
}

function checkCell(row,col,step,dir,color,double){
  if ($('.cell[row='+(row+step)+'][col='+(col+dir)+'] .piece').length > 0){
    if (!$('.cell[row='+(row+step)+'][col='+(col+dir)+'] .piece').hasClass(color)){
      if ($('.cell[row='+(row+step*2)+'][col='+(col+dir*2)+'] .piece').length == 0){
        $('.cell[row='+(row+step*2)+'][col='+(col+dir*2)+']').addClass('activeCell');
      }
    }
  }
  else if (double == 0){
    $('.cell[row='+(row+step)+'][col='+(col+dir)+']').addClass('activeCell');
  }
  $('.activeCell').droppable({
    accept: '.piece',
    hoverClass: 'hovered',
    drop: handlePieceDrop
  });
}

function handlePieceDrop(event, ui){
  var oldRow = parseInt(ui.draggable.parent().attr('row'));
  var oldCol = parseInt(ui.draggable.parent().attr('col'));
  var newCol = parseInt($(this).attr('col'));
  var newRow = parseInt($(this).attr('row'));
  
  removeActive();
  $(this).append(ui.draggable);
  $('#draggableHelper').remove();
  
  var color = 'black';
  if (ui.draggable.hasClass('red')){color = 'red';}
  
  if (Math.abs(oldRow-newRow) == 2 || Math.abs(oldCol-newCol) == 2){
    jumpPiece(ui.draggable,color,oldRow,oldCol,newRow,newCol);}
  
  if (color == 'black' && newCol == 7){ui.draggable.addClass('king');}
  else if (color == 'red' && newCol == 0){ui.draggable.addClass('king');}
    
  if ($('.activeCell').length == 0){
    if (ui.draggable.hasClass('red')){
      $('.piece.red').draggable('disable');
      $('.piece.black').draggable('enable');
    }
    else{
      $('.piece.black').draggable('disable');
      $('.piece.red').draggable('enable');
    }
  }
  else {
      $('.piece').draggable('disable');
      ui.draggable.draggable('enable');
  }
}

function jumpPiece(piece,color,oldRow,oldCol,newRow,newCol){
  $('.cell[row='+(oldRow+(newRow-oldRow)/2)+'][col='+(oldCol+(newCol-oldCol)/2)+'] .piece').remove();
  checkCells(piece,newRow,newCol,(newCol-oldCol)/2,color,1);
    
  if ($('.piece').length - $('.piece.'+color).length == 0){victory(color);}
}

function removeActive(event, ui){
  $('.activeCell').droppable('destroy');
  $('.activeCell').removeClass('activeCell');
}

function myHelper( event ) {return '<div id="draggableHelper" class="piece"></div>';}

function victory(color){
  if (color == 'black'){$('.victory').html('Black Winnnnnnssssss!!!!!');}
  else{$('.victory').html('Red Winnnnnnssssss!!!!!');}
  
  $('.piece').draggable('disable');
}