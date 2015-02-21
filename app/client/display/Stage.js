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
		console.log(child.image.scr);
		child.update();
	});
};