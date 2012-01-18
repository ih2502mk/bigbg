function Vect(x, y){
  this.setXY(x, y);
}
        
Vect.prototype.vadd = function(v1, v2) {
  if((v1 instanceof Vect) && (v2 instanceof Vect)) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
  }
            
  return this;
}
        
Vect.prototype.negate = function() {
  this.x = (-this.x);
  this.y = (-this.y);
            
  return this;
}
        
Vect.prototype.setXY = function(x, y) {
  this.x = x;
  this.y = y;
}

$(document).ready(function(){
  var $bigbg = $('#bigbg');
  
  var speed = new Vect(0, 0),
  oldPos = new Vect(0, 0),
  pos = new Vect(0, 0),
  relPos = new Vect(0, 0);
            
  var measure, move, drag = false;
            
  $(document).mousedown(function(e){
    //TODO: wrap into method with callback as a callback pass drag init which does relPos setting and drag = true
    clearInterval(move);
    
    relPos.setXY(($bigbg.offset().left - e.pageX), ($bigbg.offset().top - e.pageY));
    drag = true;
    
    //TODO: wrap measure into method which sets old pos and then inits measure intervaled 
    oldPos.setXY(e.pageX, e.pageY);
                
    measure = setInterval(function(){
      speed.vadd(pos, oldPos.negate());
      oldPos.setXY(pos.x, pos.y);
    },50);
    
  });
            
  $(document).mouseup(function(e){
    drag = false;
    
    clearInterval(measure);
    
    var left = $bigbg.offset().left;
    var top = $bigbg.offset().top;
                
    move = setInterval(function(){
      left += Math.round(speed.x/10);
      top += Math.round(speed.y/10);
      $bigbg.offset({left:left, top:top})    
    }, 5)
  });
            
  $(document).mousemove(function(e){
    pos.setXY(e.pageX, e.pageY);
    
    if(drag) {
      $bigbg.offset({left:(relPos.x + e.pageX), top:(relPos.y + e.pageY) })
    }
  });
})