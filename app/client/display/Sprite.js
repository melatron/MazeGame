Pony.Sprite = function(image, x, y) {
	this.anchor = new Pony.Point(x, y);
	this.hasLoaded = false;
	var that = this;
	image.onload = function() {
		that.width = image.width;
		that.height = image.height;
		that.image = image;
		that.hasLoaded = true;
		that.onLoaded();
		console.log(this.image);
	};
};

Pony.Sprite.prototype = Object.create(Pony.Sprite.prototype);
Pony.Sprite.prototype.constructor = Pony.Sprite;

Pony.Sprite.prototype.onLoaded = function() {
	if (this.stage !== undefined) {
		this.update();
	}
};

Pony.Sprite.prototype.setStage = function(stage) {
	if (stage instanceof Pony.Stage) {
		this.stage = stage;
	}
};

Pony.Sprite.prototype.update = function() {
	this.stage.ctx.drawImage(this.image, this.anchor.x, this.anchor.y);
};

Pony.Sprite.animate = function() {
	requestAnimFrame();
	this.stage.ctx.clearRect(this.anchor.x, this.anchor.y, this.width, this.height);
	this.update();
};