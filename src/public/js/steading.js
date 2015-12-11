function Steading(steading) {

  //TODO "width" will need to be more flexible to accomodate scaling/zooming
  this.width = steading.width || 64;

  this.x = steading.x || 0;
  this.y = steading.y || 0;
  this.img = steading.img;
  this.offsetX = steading.offsetX || 0;
  this.offsetY = steading.offsetY || 0;

  this.name = steading.name || "";
}

Steading.prototype.namePosX = function(){
  return this.x+this.width/2-this.name.length*3;
}
Steading.prototype.namePosY = function(){
  return this.y+this.width+14;
}

// Draws this steading and its name to a given context
Steading.prototype.draw = function(ctx) {
  ctx.drawImage(this.img, this.offsetX, this.offsetY, 64, 64, this.x, this.y, 64, 64);
  //TODO draw this.name (above or below??)
  ctx.fillText(this.name, this.namePosX(), this.namePosY());
}

// Determine if a point is inside the image bounds, for purposes of click events
Steading.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the image's X and (X + Width) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.width >= mx) &&
          (this.y <= my) && (this.y + this.width >= my);
}
