'use strict';

angular.module('mapDragon')
.service('canvasService', function(){

  //drawing stuff
  this.clear = function(){
    this.ctx.clearRect(0,0,this.width, this.height);
  };
  this.draw = function(){
    if (!this.valid){
      var ctx = this.ctx;
      var steadings = this.steadings;
      this.clear();

      //draw all steadings
      var l = steadings.length;
      for (var i = 0; i < l; i++) {
        var steading = steadings[i];
        // We can skip the drawing of elements that have moved off the screen:
        if (steading.x > this.width || steading.y > this.height ||
            steading.x + steading.width < 0 || steading.y + steading.width < 0) continue;
        steadings[i].draw(ctx);
      }

      if (this.selection != null) {
        ctx.strokeStyle = this.selectionColor;
        ctx.lineWidth = this.selectionWidth;
        var mySel = this.selection;
        ctx.strokeRect(mySel.x,mySel.y,mySel.width,mySel.width);
      }

      this.valid = true;
    }
  };

  this.getMouse =  function(e){
    var mouse = {
      x : e.offsetX,
      y : e.offsetY
    };
    console.log(mouse);
    return mouse;
  };

  //events stuff
  this.onMousedown = function(e) {
    //TODO clicking on a steading should move it to the end of the array
    var mouse = this.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var steadings = this.steadings;
    for (var i = steadings.length-1; i >= 0; i--) {
      if (steadings[i].contains(mx, my)) {
        var mySel = steadings[i];
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        this.dragoffx = mx - mySel.x;
        this.dragoffy = my - mySel.y;
        this.dragging = true;
        this.selection = mySel;
        this.valid = false;
        return;
      }
    }
  };
  this.onMouseup = function() {
    this.dragging = false;
    this.selection = null;
    this.valid = false;
  };
  this.onMousemove = function(e){
    if(this.dragging){
      var mouse = this.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      this.selection.x = mouse.x - this.dragoffx;
      this.selection.y = mouse.y - this.dragoffy;
      this.valid = false; // Something's dragging so we must redraw
    }
  };

  //popup interface
  this.addSteading = function(steading){
    this.steadings.push(steading);
    this.valid = false;
  };
  this.openPopup = function(e){
    var mouse = this.getMouse(e);

    //open popup at mouse coordinates, create steading at coordinates (if user chooses)
    console.log("popup should open");
  };

  this.initCanvas = function(canvasElement){
    console.log("init canvas");

    this.canvas = angular.element(canvasElement)[0];
    this.width = canvasElement.width;//unused
    this.height = canvasElement.height;//unused
    this.ctx = canvasElement.getContext('2d');
    this.ctx.font = "12px Arial";

    this.valid = false;
    this.steadings = [];
    this.dragging = false;
    this.selection = null;
    this.dragoffx = 0;
    this.dragoffy = 0;

    // **** Options! ****
    this.selectionColor = 'rgb(152, 198, 233)';
    this.selectionWidth = 1;
    this.interval = 30;
    var self = this;
    setInterval(function() {
      self.draw();
    }, this.interval);
  };

});
