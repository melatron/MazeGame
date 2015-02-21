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
	this.children.push(child);

	if (child.stage !== this) {
		child.setStage(this);
		console.log(5, child.image.src);
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

Pony.GameObject = function(anchor) {

};

Pony.GameObject.prototype = Object.create(Pony.GameObject.prototype);
Pony.GameObject.constructor = Pony.GameObject;

Pony.Texture = function(path, x, y) {
	this.anchor = new Pony.Point(x, y);
	this.hasLoaded = false;
	var self = this;
	this.image = new Image();
	this.image.onload = function() {
		self.width = self.image.width;
		self.height = self.image.height;
		self.hasLoaded = true;
		self.onLoaded();
	};
	this.image.src = path;
};

Pony.Texture.prototype = Object.create(Pony.Texture.prototype);
Pony.Texture.prototype.constructor = Pony.Texture;

Pony.Texture.prototype.onLoaded = function() {
	this.path = this.image.src;
	var event = new CustomEvent("imageLoaded", {"detail": {"path" : this.image.src}});
	document.dispatchEvent(event);
	if (this.stage !== undefined) {
		this.update();
	}
};

Pony.Texture.prototype.setStage = function(stage) {
	if (stage instanceof Pony.Stage) {
		this.stage = stage;
	}
};

Pony.Texture.prototype.update = function() {
	if (this.stage !== undefined) {
		console.log(this.image.src);
		this.stage.ctx.drawImage(this.image, this.anchor.x, this.anchor.y);
	}
};

Pony.Texture.animate = function() {
	requestAnimFrame();
	this.stage.ctx.clearRect(this.anchor.x, this.anchor.y, this.width, this.height);
	this.update();
};

Pony.Spritesheet = function(path, frameWidth, frameHeight, anchor) {
	this.currentFrame = 0;
	this.framesPerRow = 0;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;
	this.fps = 1;
	this.animationPool = {};
	this.achor = anchor || new Pony.Point();
	this.texture = new Pony.Texture(path);
	document.addEventListener("imageLoaded", this.onLoaded.bind(this), false);
};

Pony.Spritesheet.prototype = Object.create(Pony.Spritesheet.prototype);
Pony.Spritesheet.prototype.constructor = Pony.Spritesheet;

Pony.Spritesheet.prototype.onLoaded = function(e) {
	if (e.detail.path == this.texture.path) {
		this.width = this.texture.width;
		this.heigth = this.texture.height;
		this.hasLoaded = true;
		this.framesPerRow = Math.floor(this.width / this.frameWidth);
	}
};

Pony.Spritesheet.prototype.update = function() {

};

Pony.Spritesheet.prototype.attachAnimation = function(key, frames) {
	this.animationPool[key] = frames;
};

Pony.Spritesheet.prototype.runAnimation = function(key) {

};
