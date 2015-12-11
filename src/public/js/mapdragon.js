function Popup(){

  var self = this;
  this.onAddCallback;

  this.spriteSheet;
  this.options = [];
  this.selectedOptionIdx;

  //TODO vs Popup.prototype.hide = function()? convention? answer: .prototype properties/methods are not visible (with console.log, etc.)
  this.hide = function(){
    self.popupElement.className = "hidden";
    self.popupElement.setAttribute('style', 'top:0;left:0;');
  }
  this.show = function(x, y){
    self.popupElement.className = "";
    self.popupElement.setAttribute('style', 'top:'+y+'px;left:'+x+'px;');
    self.steadingNameInput.focus();
  }

  this.selectObjectOptions = function(x, y, callback){
    self.onAddCallback = callback;
    self.show(x, y);
  }

  this.keyPressed = function(e){
    console.log(e);
    if(e.keyCode=='13'){
      self.addButtonClicked();
    }
  }

  this.addButtonClicked = function(e) {
    if (self.selectedOptionIdx > -1) {
      var steading = new Steading({
        name: self.steadingNameInput.value,
        img: self.options[self.selectedOptionIdx].img,
        offsetX: self.options[self.selectedOptionIdx].offsetX,
        width: self.options[self.selectedOptionIdx].width
      });

      self.steadingNameInput.value = "";
      self.hide();
      self.onAddCallback(steading);
    }
  }
  this.cancelButtonClicked = function(e) {
    self.hide();
    self.steadingNameInput.value = "";
  }
  this.optionItemClicked = function(e) {
    var allItems = document.getElementsByClassName("popup-item");
    for (var i = 0; i < allItems.length; i++) {
      if (allItems[i] === this) {
        allItems[i].className = "popup-item selected";
        self.selectedOptionIdx = i;
      } else {
        allItems[i].className = "popup-item";
      }
    }
  }

  function init() {
    //populate array of options to present
    self.spriteSheet = new Image();
    self.spriteSheet.src = 'static/img/cowboyspritestrip.png';
    var spriteWidth = 64;
    var numSprites = 10;
    for (var i = 0; i < numSprites; i ++){
      self.options.push({
        img: self.spriteSheet,
        offsetX: i*spriteWidth,
        width: spriteWidth,
      });
    }

    //construct and style the popup element
    var popup = document.createElement("div");
    popup.setAttribute('id', 'popup');
    popup.setAttribute('class', 'hidden');

    var nav = document.createElement("div");
    nav.setAttribute('class', 'popup-nav');

    var navItem1 = document.createElement("input");
    navItem1.setAttribute('class', 'nav-title nav-left');
    navItem1.setAttribute('placeholder', 'Title (optional)');
    self.steadingNameInput = navItem1;

    var navItem2 = document.createElement("div");
    navItem2.onclick = self.cancelButtonClicked;
    navItem2.setAttribute('class', 'nav-item nav-right');
    navItem2.appendChild(document.createTextNode("x"));

    var navItem3 = document.createElement("div");
    navItem3.onclick = self.addButtonClicked;
    navItem3.setAttribute('class', 'nav-item nav-right');
    navItem3.appendChild(document.createTextNode("+"));

    var navItems = [
      navItem1,
      navItem2,
      navItem3,
    ];

    for (i in navItems){
      nav.appendChild(navItems[i]);
    }
    popup.appendChild(nav);

    var body = document.createElement("div");
    body.setAttribute('class', 'popup-window');

    var list = document.createElement("ul");
    list.setAttribute('class', 'popup-options');

    var optionsDivs = [];

    var img,imgDiv,optionItem;
    for (var i = 0; i < self.options.length; i ++){

      img = document.createElement('img');
      img.src = self.options[i].img.src;
      img.className = "popup-icon-image";
      img.style.left = "-"+self.options[i].offsetX+"px";
      img.style.top = self.options[i].offsetY+"px";

      imgDiv = document.createElement("div");
      imgDiv.className = "popup-icon-frame";
      imgDiv.style.height = "64px";
      imgDiv.style.width = "64px";
      imgDiv.appendChild(img);

      optionItem = document.createElement("li");
      optionItem.appendChild(imgDiv);
      optionItem.className = "popup-item";
      optionItem.onclick = self.optionItemClicked;
      optionsDivs.push(optionItem);
    }

    for (i in optionsDivs) {
      list.appendChild(optionsDivs[i]);
    }
    body.appendChild(list);
    popup.appendChild(body);

    //support for submitting with the enter key
    popup.onkeydown = self.keyPressed;

    self.popupElement = popup;

    if (!document.getElementById("popup")) {
      document.getElementById("canvas-container").appendChild(self.popupElement);
    }
  }
  init();
}

//December 2015 - the following CanvasState code was modified from code by Simon Sarris
// www.simonsarris.com
// sarris@acm.org
// Last update December 2011
// Free to use and distribute at will
// So long as you are nice to people, etc

function CanvasState(canvas) {

  this.popup = new Popup();

  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  this.ctx.font = "12px Arial";
  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****

  this.valid = false; // when set to false, the canvas will redraw everything
  this.steadings = []; // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;



  // **** Then events! ****
  var self = this;

  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging
  canvas.addEventListener('mousedown', function(e) {
    //TODO clicking on a steading should move it to the end of the array
    var mouse = self.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var steadings = self.steadings;
    for (var i = steadings.length-1; i >= 0; i--) {
      if (steadings[i].contains(mx, my)) {
        var mySel = steadings[i];
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        self.dragoffx = mx - mySel.x;
        self.dragoffy = my - mySel.y;
        self.dragging = true;
        self.selection = mySel;
        self.valid = false;
        return;
      }
    }
  }, true);
  canvas.addEventListener('mousemove', function(e) {
    if (self.dragging){
      var mouse = self.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      self.selection.x = mouse.x - self.dragoffx;
      self.selection.y = mouse.y - self.dragoffy;
      self.valid = false; // Something's dragging so we must redraw
    }
  }, true);
  canvas.addEventListener('mouseup', function(e) {
    self.dragging = false;
    self.selection = null;
    self.valid = false;
  }, true);

  // double click to open popup at mouse coordinates
  canvas.addEventListener('dblclick', function(e) {
    var mouse = self.getMouse(e);

    //popup menu with options for adding objects to canvas
    self.popup.selectObjectOptions(mouse.x, mouse.y, function(steading) {
      steading.x = mouse.x - steading.width/2;
      steading.y = mouse.y - steading.width/2;
      self.addSteading(steading);
    });
  }, true);


  // **** Options! ****
  this.selectionColor = 'rgb(152, 198, 233)';
  this.selectionWidth = 1;
  this.interval = 30;
  setInterval(function() { self.draw(); }, self.interval);
}

CanvasState.prototype.addSteading = function(steading) {
  this.steadings.push(steading);
  this.valid = false;
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    var ctx = this.ctx;
    var steadings = this.steadings;
    this.clear();

    // ** Add stuff you want drawn in the background all the time here **

    // draw all steadings
    var l = steadings.length;
    for (var i = 0; i < l; i++) {
      var steading = steadings[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (steading.x > this.width || steading.y > this.height ||
          steading.x + steading.width < 0 || steading.y + steading.width < 0) continue;
      steadings[i].draw(ctx);
    }

    // draw selection
    // right now this is just a stroke along the edge of the selected image
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      var mySel = this.selection;
      ctx.strokeRect(mySel.x,mySel.y,mySel.width,mySel.width);
    }

    // ** Add stuff you want drawn on top all the time here **

    this.valid = true;
  }
}

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  return {x: mx, y: my};
}

init();

function init() {
  var s = new CanvasState(document.getElementById('exampleCanvas'));

  var image = new Image();
  image.src = 'static/img/cowboyspritestrip.png';
  s.addSteading(new Steading({
    x: 60,
    y: 140,
    img: image,
    name: "Title",
    width: 64
  }));
}
