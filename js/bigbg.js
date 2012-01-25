function Vect(x, y){
  this.x;
  this.y;
  this.setXY(x, y);
}
        
Vect.prototype.vadd = function(v1, v2) {
  if((v1 instanceof Vect) && (v2 instanceof Vect)) {
    this.setXY(v1.x + v2.x, v1.y + v2.y)
  }
            
  return this;
}

Vect.prototype.scale = function(factor) {
  this.setXY(this.x * factor, this.y * factor);
  return this;
}
        
Vect.prototype.negate = function() {
  this.scale(-1);          
  return this;
}
        
Vect.prototype.setXY = function(x, y) {
  this.x = x;
  this.y = y;
}

function Movable($el){
  this.el = $el;
  //$el.data('movable', this);
  this.path = [];
  this.speed = new Vect(0, 0);
}

Movable.prototype.move = function(x, y){
  //this.el.offset({left:x, top:y});
  this.el[0].style.left = x + "px";
  this.el[0].style.top = y + "px";
  this.path.unshift({
    point: new Vect(x, y), 
    tick: new Date().getTime()
  });
  if(this.path.length > 100) {
    this.path.pop();
  }
}

Movable.prototype.speedMeasure = function(x, y, stopTime){
  var lastPoint,
  threshold = 100,
  deltaTime = 0,
  len = this.path.length;
  if(len) {
    for(var i = 0; i < len; i++) {
      deltaTime = stopTime - this.path[i].tick;
      if(deltaTime > threshold) {
        lastPoint = this.path[i].point;
        break;
      }
    }
        
    if(!lastPoint) {
      lastPoint = this.path[len-1].point;
    }
        
    this.speed.vadd(lastPoint, new Vect(-x, -y)).scale(1000/deltaTime);
  }
  else {
    this.speed.setXY(0, 0);
  }
}

function Drag($el){
  this.active = false;
  this.draggy = new Movable($el);
  this.draggyToMouse = new Vect(0, 0);
}

Drag.prototype.start = function(x, y){
  this.active = true;
  this.draggy.path = [];
  this.draggyToMouse.setXY(this.draggy.el.offset().left - x, this.draggy.el.offset().top - y);
}

Drag.prototype.move = function(x, y){
  if (this.active) {
    this.draggy.move(x + this.draggyToMouse.x, y + this.draggyToMouse.y);
  }
}

Drag.prototype.stop = function(x, y){
  this.active = false;
  this.draggy.speedMeasure(x + this.draggyToMouse.x, y + this.draggyToMouse.y, new Date().getTime());
}

$(document).ready(function(){
         
  var drag = new Drag($('#bigbg'));
            
  $(document).mousedown(function(e){    
    drag.start(e.pageX, e.pageY);
  });
            
  $(document).mouseup(function(e){
    drag.stop(e.pageX, e.pageY);
  });
            
  $(document).mousemove(function(e){
    drag.move(e.pageX, e.pageY);
  });
});