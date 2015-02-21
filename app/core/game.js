/**
 * Created by Antony on 1/18/2015.
 */
function init() {
	stage = new createjs.Stage("game-container");
	fps = 30;
	width = stage.canvas.width;
	height = stage.canvas.height;
	manifest = [
		{src: "tile3.png", id: "tilemap"},
		{src: "ada_0_0.png", id: "char"}
	];
	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", startGame);
	loader.loadManifest(manifest, true, "assets/images/");
}

function startGame() {
	var spriteSheet = new createjs.SpriteSheet({
		framerate: 1,
		"images": [loader.getResult("char")],
		"frames": {"regX": 0, "height": 48, "regY": 0, "width": 48},
		"animations": {
			"down": {
				"frames" : [0, 4, 8, 12]
			},
			"left": {
				"frames" : [1, 5, 9, 13]
			},
			"up": {
				"frames" : [2, 6, 10, 14]
			},
			"right": {
				"frames" : [3, 7, 11, 15]
			},
			"idle" : 0
		}
	});
	var background = new createjs.Bitmap(loader.getResult("tilemap"));
	stage.addChild(background);
	player = new createjs.Sprite(spriteSheet);
	player.isIdle = true;
	player.up = function(delta) {
		this.y -= 150 * delta / 1000;
		if (this.currentAnimation != "up") {
			this.gotoAndPlay("up");
		}
	};
	player.down = function(delta) {
		this.y += 150 * delta / 1000;
		if (this.currentAnimation != "down") {
			this.gotoAndPlay("down");
		}
	};
	player.left = function(delta) {
		this.x -= 150 * delta / 1000;
		if (this.currentAnimation != "left") {
			this.gotoAndPlay("left");
		}
	};
	player.right = function(delta) {
		this.x += 150 * delta / 1000;
		if (this.currentAnimation != "right") {
			this.gotoAndPlay("right");
		}
	};
	stage.addChild(player);

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.setFPS(fps);
	createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	if (key.isPressed('up') || key.isPressed('w')) {
		player.isIdle = false;
		player.up(event.delta);
	} else if (key.isPressed('down') || key.isPressed('s')) {
		player.isIdle = false;
		player.down(event.delta);
	} else if (key.isPressed('left') || key.isPressed('a')) {
		player.isIdle = false;
		player.left(event.delta);
	} else if (key.isPressed('right') || key.isPressed('d')) {
		player.isIdle = false;
		player.right(event.delta);
	} else {
		player.isIdle = true;
	}
	if (player.isIdle) {
		player.gotoAndPlay('idle');
	}
	stage.update(event);
}
