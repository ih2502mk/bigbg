function Vect(x, y){
    this.x;
    this.y;
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

function Movable($el){
    this.el = $el;
    $el.data('movable', this);
}

Movable.prototype.move = function(x, y){
    this.el.offset({left:x, top:y});
}

function Drag($el){
    this.active = false;
    this.draggy = new Movable($el);
    this.draggyToMouse = new Vect(0, 0);
}

Drag.prototype.start = function(x, y){
    this.active = true;
    this.draggyToMouse.setXY(this.draggy.el.offset().left - x, this.draggy.el.offset().top - y);
}

Drag.prototype.move = function(x, y){
    if (this.active) {
        this.draggy.move(x + this.draggyToMouse.x, y + this.draggyToMouse.y);
    }
}

Drag.prototype.stop = function(){
    this.active = false;
}

$(document).ready(function(){
  var $bigbg = $('#bigbg');
  
  var speed = new Vect(0, 0),
  oldPos = new Vect(0, 0),
  pos = new Vect(0, 0),
  relPos = new Vect(0, 0);
            
  var measure, move, drag = new Drag($('#bigbg'));
            
  $(document).mousedown(function(e){
    //TODO: wrap into method with callback as a callback pass drag init which does relPos setting and drag = true
    clearInterval(move);
    
    drag.start(e.pageX, e.pageY)
    
    //TODO: wrap measure into method which sets old pos and then inits measure intervaled 
    oldPos.setXY(e.pageX, e.pageY);
                
    measure = setInterval(function(){
      speed.vadd(pos, oldPos.negate());
      oldPos.setXY(pos.x, pos.y);
    },50);
    
  });
            
  $(document).mouseup(function(e){
    drag.stop();
    
    clearInterval(measure);
    
    //TODO: make this not so crappy
    var left = drag.draggy.el.offset().left;
    var top = drag.draggy.el.offset().top;
    var vx = Math.abs(Math.round(speed.x/5));
    var vy = Math.abs(Math.round(speed.y/5));
    var dirx = vx/Math.round(speed.x/5);
    var diry = vy/Math.round(speed.y/5);
    move = setInterval(function(){
      left += --vx*dirx;
      top += --vy*diry;
      if (vx && vy) {
          drag.draggy.move(left, top);
      }
      else {
          clearInterval(move);
      }    
    }, 10)
  });
            
  $(document).mousemove(function(e){
    pos.setXY(e.pageX, e.pageY);
    
    drag.move(e.pageX, e.pageY);
  });
})