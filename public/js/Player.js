var Player = Class.extend({
	init : function(sprite) {
		this.isIdle = true;
		this.sprite = sprite;
		this.x = sprite.x;
		this.y = sprite.y;
		this.direction = 'R';
	},
	left : function(delta) {
		if (this.x <= 0) {
			return;
		}
		this.x -= 150 * delta / 1000;
		if (this.sprite.currentAnimation != "left") {
			this.sprite.gotoAndPlay("left");
		}
	},
	right : function(delta) {
		if (this.x + this.sprite.getBounds().width >= width) {
			return;
		}
		this.x += 150 * delta / 1000;
		if (this.sprite.currentAnimation != "right") {
			this.sprite.gotoAndPlay("right");
		}
	},
	jump : function(delta) {
		
	},
	idle : function() {
		this.sprite.gotoAndPlay('idle' + this.direction);
	}
});