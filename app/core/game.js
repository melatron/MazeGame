/**
 * Created by Antony on 1/18/2015.
 */
function init() {
	stage = new createjs.Stage("game-container");
	fps = 30;
	width = stage.canvas.width;
	height = stage.canvas.height;
	manifest = [
		{src: "sea_background.png", id: "background"},
		{src: "ada_0_0.png", id: "char"}
	];
	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", startGame);
	loader.loadManifest(manifest, true, "assets/images/");
}

function startGame() {
	//setup background
	var background = new createjs.Shape();
	var matrix = new createjs.Matrix2D();
	worldHeight = height;
	worldWidth = width * 2;
	worldTraveled = 0;
	matrix.scale(2, 2);
	matrix.translate(0, height / 4);
	world = new createjs.Container(); //make a container for our panning world view
	background.graphics.beginFill("#5DD2FF").drawRect(0, 0, worldWidth, worldHeight); //first fill with color
	background.graphics.beginBitmapFill(loader.getResult("background"), "repeat-x", matrix).drawRect(0, 0, worldWidth, worldHeight);
	world.x = world.y = 0;
	world.addChild(background);
	stage.addChild(world);
	var spriteSheet = new createjs.SpriteSheet({
		framerate: 10,
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
			"idleL" : 1,
			"idleR" : 3
		}
	});
	
	//initiate the player
	var sprite = new createjs.Sprite(spriteSheet);
	sprite.x = 0;
	sprite.y = height / 2;
	player = new Player(sprite);
	stage.addChild(player.sprite);
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.setFPS(fps);
	// createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	if (key.isPressed('left') || key.isPressed('a')) {
		player.direction = 'L';
		player.isIdle = false;
		//keep boundaries
		if (worldTraveled <= 0) {
			stage.update(event);
			return;
		}
		player.left(event.delta);
		worldTraveled -= 10;
		world.regX -= 10;
	} else if (key.isPressed('right') || key.isPressed('d')) {
		player.direction = 'R';
		player.isIdle = false;
		player.right(event.delta);
		//keep boundaries
		if (worldTraveled + player.sprite.getBounds().width >= worldWidth) {
			stage.update(event);
			return;
		}
		// if (worldWidth - worldTraveled <= width) {		
			// stage.update(event);
			// return;
		// }
		world.regX += 10;
		worldTraveled += 10;
	} else {
		player.isIdle = true;
	}
	if (player.isIdle) {
		player.idle(event);
	}
	stage.update(event);
}
