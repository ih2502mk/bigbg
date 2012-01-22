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
        
Vect.prototype.negate = function() {
  this.setXY(-this.x, -this.y);          
  return this;
}
        
Vect.prototype.setXY = function(x, y) {
  this.x = x;
  this.y = y;
}

function Movable($el){
    this.el = $el;
    $el.data('movable', this);
    this.path = []
}

Movable.prototype.move = function(x, y){
    var left = Math.round(x),
    top = Math.round(y);
    this.el.offset({left:left, top:top});
    this.path.unshift({
        point: new Vect(left, top), 
        tick: new Date.getTime()
    });
    if(this.path.length > 100) {
        this.path.pop();
    }
}

function Drag($el, startCb, posUpdateCb, stopCb){
    this.active = false;
    this.draggy = new Movable($el);
    this.draggyToMouse = new Vect(0, 0);
    this.startCb = startCb;
    this.posUpdateCb = posUpdateCb;
    this.stopCb = stopCb;
}

Drag.prototype.start = function(x, y){
    this.active = true;
    this.draggyToMouse.setXY(this.draggy.el.offset().left - x, this.draggy.el.offset().top - y);
    if(typeof this.startCb === "function") {
        this.startCb(this);
    }
}

Drag.prototype.move = function(x, y){
    if (this.active) {
        this.draggy.move(x + this.draggyToMouse.x, y + this.draggyToMouse.y);
        if(typeof this.posUpdateCb === "function") {
            this.posUpdateCb(this);
        }
    }
}

Drag.prototype.stop = function(){
    this.active = false;
    if(typeof this.stopCb === "function" ) {
        this.stopCb(this);
    }
}

$(document).ready(function(){
  
  var speed = new Vect(0, 0),
  oldPos = new Vect(0, 0),
  pos = new Vect(0, 0);
            
  var measure, move, drag = new Drag($('#bigbg'));
            
  $(document).mousedown(function(e){
    clearInterval(move);
    
    drag.start(e.pageX, e.pageY)
    
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