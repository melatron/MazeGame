Pony.Spritesheet = function() {
	this.hasLoaded = false;
	this.numOfFrames = 0;
	this.animations = null;
};

Pony.Sprite.prototype = Object.create(Pony.Spritesheet.prototype);
Pony.Sprite.prototype.constructor = Pony.Spritesheet;

Pony.Spritesheet.attachAnimation = function(animation) {
	this.animations.push(animation);
};
