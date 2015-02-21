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
		"frames": {"regX": 24, "height": 48, "regY": 24, "width": 48},
		   "animations": {
		   		"framerate" : fps,
			   "down": [0, 4, 8, 12],
			   "left" : [1, 5, 9, 13],
			   "up" : [2, 6, 10, 14],
			   "right" : [3, 7, 11, 15],
			   "idle" : [0, false]
		   }
    });
    player = new createjs.Sprite(spriteSheet);
    player.isIdle = true;
    player.up = function(delta) {
    	dt = 150 * delta / 1000;
    	console.log(this.y);
    	if (this.x + this.getBounds().height >= height) {
    		return;
    	}
    	this.y -= dt;
    	this.gotoAndPlay("up");
    };
    player.down = function(delta) {
   		this.y += 150 * delta / 1000;
    	this.gotoAndPlay("down");
    };
    player.left = function(delta) {
    	this.x -= 150 * delta / 1000;
    	this.gotoAndPlay("left");
    };
    player.right = function(delta) {
    	this.x += 150 * delta / 1000;
    	this.gotoAndPlay("right");
    };
    stage.addChild(player);
    // document.onkeydown = function(event) {
    	// switch(event.keyCode) {
    		// case 37 :
    		// // player.dispatchEvent('left')
    		// break;
		// case 38 :
   			// // player.dispatchEvent('up');
			// break;
		// case 39 :
			// // player.dispatchEvent('right');
			// break;
		// case 40 :
			// // player.dispatchEvent('down');
			// break;
		// }
	// };
	// player.addEventListener("down", tick);
	// player.addEventListener("up", tick);
	// player.addEventListener("right", tick);
	// player.addEventListener("left", tick);

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.setFPS(fps);
	createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event, d) {
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
