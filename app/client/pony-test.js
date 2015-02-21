//namespace
var Pony = Pony || {};

Pony.defaultCanvasWidth = 800;
Pony.defaultCanvasHeight = 600;
Pony.defaultContainerName = 'pony-container'; //lolz

Pony.Stage = function(width, height, scale) {
	this.children = [];
	this.width = width || Pony.defaultCanvasWidth;
	this.height = height || Pony.defaultCanvasHeight;
	this.scale = scale || 1;
};

//constructor and single inheritance
Pony.Stage.prototype = Object.create(Pony.Stage.prototype);
Pony.Stage.prototype.constructor = Pony.Stage;

Pony.Stage.prototype.init = function(canvas) {
	if (canvas !== undefined) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		return;
	}
	this.canvas = document.createElement('canvas');
	this.canvas.id = Pony.defaultContainerName;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.ctx = this.canvas.getContext('2d');
	document.body.appendChild(this.canvas);
};

Pony.Stage.prototype.addChild = function(child) {
	this.children.unshift(child);
	
	if (child.stage !== this) {
		child.setStage(this);
	}
};

Pony.Stage.prototype.removeChild = function (index) {
	this.children.splice(index);
};

Pony.Stage.prototype.update = function() {
	this.children.forEach(function(child) {
		child.stage.ctx.clearRect(child.anchor.x, child.anchor.y, child.width, child.height);
		child.update();
	});
};

Pony.Point = function(x, y) {
	//put point at (x, y) or (0, 0)
	this.x = x || 0;
	this.y = y || 0;
};

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
		console.log(2);
	};
};

Pony.Sprite.prototype = Object.create(Pony.Sprite.prototype);
Pony.Sprite.prototype.constructor = Pony.Sprite;

Pony.Sprite.prototype.onLoaded = function() {
	console.log(3, this.image.src);
		this.update();
		console.log(4, this.image.src);
};

Pony.Sprite.prototype.setStage = function(stage) {
	if (stage instanceof Pony.Stage) {
		this.stage = stage;
	}
};

Pony.Sprite.prototype.update = function() {
	if (this.stage !== undefined) {
		this.stage.ctx.drawImage(this.image, this.anchor.x, this.anchor.y);
	}	
};

Pony.Sprite.animate = function() {
	requestAnimFrame();
	this.stage.ctx.clearRect(this.anchor.x, this.anchor.y, this.width, this.height);
	this.update();
};
