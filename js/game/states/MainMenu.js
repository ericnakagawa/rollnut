Rollnut.MainMenu = function() {
};

Rollnut.MainMenu.prototype = {
	create: function() {
		this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
		// this.background.autoScroll(0, -125);

		this.ground = this.game.add.tileSprite(0, this.game.height - 40, this.game.width, 40, 'ground');
		this.ground.autoScroll(0, -50);

		this.player = this.add.sprite(this.game.width / 2, this.game.height / 2 - 140, 'player');
		this.player.anchor.setTo(0.5);

		this.game.add.tween(this.player).to({y: this.player.y - 16}, 200, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
		// this.game.add.tween(this.player).to({angle: this.player.angle + 180}, 1000, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);

		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		this.splash.anchor.setTo(0.5);

		this.startText = this.game.add.bitmapText(0, 0, 'minecraftia', 'press key or tap to play', 32);
		this.startText.x = this.game.width / 2 - this.startText.textWidth / 2;
		this.startText.y = this.game.height / 2 + this.splash.height / 2 + 50;
	},

	update: function() {
		this.player.angle += 0.5;
		if(this.player.angle % 360 == 0) this.player.angle = 0;
		if(this.game.input.activePointer.justPressed()) {
			this.game.state.start('Game');
		}
	},
};