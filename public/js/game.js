    /**
 * Created by elitsa.ilieva and antony.dikov on 2/21/2015.
 */
var Game = (function () {
    function init() {
        stage = new createjs.Stage("game-container");
        fps = 30;
        width = stage.canvas.width;
        height = stage.canvas.height;
        manifest = [
            { src: "sea_background.png", id: "background" },
            { src: "ada_0_0.png", id: "char" }
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
        
        //initiate the player
        poolOfPlayers = {};
        var sprite = createPlayerSprite();
        player = new Player(sprite);
        var rand = Math.floor(Math.random() * 10);
        // for (var i = 0; i <= rand; i++) {
        	// var g = new createjs.Shape().graphics.beginFill("#fff").drawRect(0, 0, 200, 50);
        	// stage.addChild(g);
        // }
        // poolOfPlayersplayer;
        stage.addChild(player.sprite);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.setFPS(fps);
        // createjs.Ticker.addEventListener("tick", stage);
        createjs.Ticker.addEventListener("tick", tick);
    }
    
    function tick(event) {
    	if (key.isPressed('b')) {
    		addPlayer();
    	}
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
    
    function createPlayerSprite() {
        var spriteSheet = new createjs.SpriteSheet({
            framerate: 10,
            "images": [loader.getResult("char")],
            "frames": { "regX": 0, "height": 48, "regY": 0, "width": 48 },
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
        
        var sprite = new createjs.Sprite(spriteSheet);
        sprite.x = width / 2;
        sprite.y = height / 2;
        
        return sprite;
    }
    
    function addPlayer(id, x, y) {
    	poolOfPlayers.id = id;
    	var sprite = createPlayerSprite();
    	sprite.x = x;
    	sprite.y = y;
    	var player = new Player(sprite);
        stage.addChild(player.sprite);
        return player;
    }
    
    function killPlayer() {
    	alert('You died!');
    }
    
    function die() {
    	window.location =  location.protocol + "//" + location.host;
    }
    
    function update(params) {
    	params.forEach(function(p) {
    		var id = p.id;
    		poolOfPlayers.id.x = p.x;
    		poolOfPlayers.id.y = p.y;
    	});
    }

    return {
        init: init,
        addPlayer : addPlayer,
        killPlayer : killPlayer,
        die : die,
        update : update
    };
})();

$(function () {
    'use strict';
    var url = 'http://' + window.location.host;
    // window.socket = io.connect(url);
    //debugger;
    window.socket = io.connect(url);
    console.log('on event is set!');
    window.poolOfPlayers = {};
    Game.init();
    
    socket.on('draw', function (params) {
        Game.draw(params);
    });
    
    socket.on('die', function (params) {
        //console.log(params);
        Game.die();
    });
    
    socket.on('win', function (params) {
        //console.log(params);
        Game.win();
    });
    
    socket.on('new', function(params) {
    	var x = params.x || 0;
    	var y = params.y || height / 2;
    	var player = Game.addPlayer();
    	poolOfPlayers.params.id = {'x' : player.x, 'y' : player.y};
    });
    
    socket.on('death', function(params) {
    	Game.killPlayer();
    });
    
    socket.on('update', function(params) {
    	Game.update(params);
    });
});