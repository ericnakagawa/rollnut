Rollnut.Game = function() {

	this.MAXDISKS = 25;
	this.POINTSMIN = 1;
	this.POINTSMAX = 25;
	this.POINTSMULTIPLIER = 100;

	this.score = 0;
	this.enemyPerX = 6;
	this.enemyPerY = 8;
	this.enemyOffset = true;

	this.fieldWidth = 600;
	this.fieldHeight = 900;

	this.points = [];

	this.diskCount = this.MAXDISKS;

};

Rollnut.Game.prototype = {
	create: function() {
		this.score = 0;
		this.diskCount = this.MAXDISKS;

		this.game.world.setBounds(0,0,200000,600);

		// this.game.world.bound = new Phaser.Rectangle(0,0, this.game.width+300, this.game.height);

		this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

		this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');

		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.gravity.y = 2000;
		this.game.physics.p2.applyDamping = true;
		this.game.physics.p2.defaultRestitution = 1.0;
	    this.game.physics.p2.friction  = 12.5;
	    this.game.physics.p2.surfaceVelocity  = 0.5;

		this.player = this.add.sprite(200, this.game.height / 2 - 140, 'player');
		this.player.anchor.setTo(0.5);

		this.game.physics.p2.enableBody(this.player, true);
		// this.player.smoothed = false;
		// this.player.body.kinematic = true;
	    this.player.body.setCircle(36);
	    this.player.body.mass = 1;
	    // this.player.body.clearShapes();
	    // this.player.body.loadPolygon('physicsData', 'donut');


		this.game.camera.follow(this.player);

	    cursors = game.input.keyboard.createCursorKeys();

		this.ramp = this.add.sprite(200, 450, 'ramp');
		this.game.physics.p2.enableBody(this.ramp, true);
		this.ramp.body.static = true;
		this.ramp.body.clearShapes();
		this.ramp.body.loadPolygon('physicsData', 'ramp');

		// single tap
		this.game.input.onDown.add(function(thing) {
			var pointer = this.game.input.activePointer;

			this.createDisk(pointer.clientX, pointer.clientY);
		}, this);

		// this.game.physics.arcade.enableBody(this.ground);
		// this.ground.body.allowGravity = false;
		// this.ground.body.immovable = true;

		this.disks = this.game.add.group();
		// this.enemies = this.game.add.group();
		// this.baskets = this.game.add.group();

		// this.setupField();
		// this.setupBaskets();

		this.scoreText = this.game.add.bitmapText(10, 10, 'minecraftia', 'Upvotes: 0', 18);
		// this.diskText = this.game.add.bitmapText(10, 10, 'minecraftia', 'Tweets: ' + this.diskCount, 18);

		this.deathSound = this.game.add.audio('death');
		this.coinSound = this.game.add.audio('coin');
		this.gameMusic = this.game.add.audio('gameMusic');

		this.catBegin = this.game.add.audio('catbegin');
		this.catScore = this.game.add.audio('catscore');

		// this.catBegin.play();
		this.gameMusic.play('', 0, true);


		this.diskText = this.game.add.bitmapText(10, 20, 'minecraftia', Math.floor(this.player.x) + " ft", 18);
		this.diskText.x = this.game.width - this.diskText.textWidth - 10;
		this.diskText.y = 100;

		this.diskText2 = this.game.add.bitmapText(10, 20, 'minecraftia', Math.floor(this.player.velocity) + " ft/s", 18);
		this.diskText2.x = this.game.width - this.diskText.textWidth - 10;
		this.diskText2.y = 120;

	},
	update: function() {

		// collision checking
		// this.game.physics.arcade.collide(this.player, this.ramp, this.diskBounce, null, this);
		// this.game.physics.arcade.collide(this.disks, this.borders, this.diskBounce);
		// this.game.physics.arcade.collide(this.disks, this.disks, this.diskBounce);
		// this.game.physics.arcade.collide(this.disks, this.baskets, this.basketHit, null, this);

	    // this.player.body.setZeroVelocity();

		this.diskText.text = Math.floor(this.player.x) + " ft";
		this.diskText.x = this.player.x;

		this.diskText2.text = Math.floor(this.player.body.velocity.x) + " ft/s";
		this.diskText2.x = this.player.x;

	    if (cursors.left.isDown)
	    {
			this.player.body.moveLeft(200);
	    }
	    else if (cursors.right.isDown)
	    {
			this.player.body.moveRight(200);
	    }

	    if (cursors.up.isDown)
	    {
	    	this.player.body.moveUp(200);
	    }
	    else if (cursors.down.isDown)
	    {
	        this.player.body.moveDown(200);
	    }

	    if (!game.camera.atLimit.x)
	    {
	        this.background.tilePosition.x -= (this.player.body.velocity.x * game.time.physicsElapsed);
	    }

	    if (!game.camera.atLimit.y)
	    {
	        this.background.tilePosition.y -= (this.player.body.velocity.y * game.time.physicsElapsed);
	    }

	},
	shutdown: function() {
		this.enemies.destroy();
		this.disks.destroy();
		// this.borders.destroy();
		this.score = 0;
	},
	basketHit: function(disk, ground) {
		var spaceX = this.fieldWidth / this.enemyPerX;

		var offsetX = (this.game.width / 2) - this.fieldWidth / 2;

		whichBasket = Math.ceil((disk.x - offsetX) / spaceX);

		// console.log(whichBasket)
		// update score
		this.score += this.points[whichBasket - 1];
		this.catScore.play();
		disk.kill();

		var dummyDisk = new Disk(this.game, disk.x, disk.y);
		this.game.add.existing(dummyDisk);

		dummyDisk.animations.play('shing', 40, true);

		var scoreTween = this.game.add.tween(dummyDisk).to({x: 170, y: 50}, 300, Phaser.Easing.Linear.NONE, true);
		scoreTween.onComplete.add(function() {
			dummyDisk.destroy();
			this.scoreText.text = "Upvotes: " + this.score;
		}, this);

		if(this.diskCount === 0 && this.disks.countLiving() === 0) {
			// end the game

			this.catBegin.play();
			this.gameMusic.stop();

			this.ground.stopScroll();
			this.background.stopScroll();

			var scoreboard = new Scoreboard(this.game);
			scoreboard.show(this.score);
		}

	},
	
	diskBounce: function(disk, enemy) {
		// console.log(disk.body.velocity);
		if(disk.body.velocity.x <= 0) {
			disk.body.velocity.setTo(disk.body.velocity.x - 30, disk.body.velocity.y);
		}

		if(disk.body.velocity.x >= 0) {
			disk.body.velocity.setTo(disk.body.velocity.x + 30, disk.body.velocity.y);
		}
	},
	createDisk: function(tapX, tapY) {
		if(this.diskCount <= 0) {
			return;
		}
		var xBounds = this.game.width * 100;
		var yBounds = this.game.height * .2;

		var xBoundsLow = 40;// this.game.width / 2 - xBounds / 2;
		var xBoundsHigh = 600; //this.game.width / 2 + xBounds / 2;

		var yBoundsLow = 0;
		var yBoundsHigh = yBounds / 2;

		var x = tapX;
		var y = this.game.rnd.integerInRange(50, 100);

		// console.log(tapX, tapY, x, y, xBounds, yBounds, xBoundsLow, xBoundsHigh, yBoundsLow, yBoundsHigh)

		if(tapX >= xBoundsLow && tapX <= xBoundsHigh) {
			x = tapX;
		} else if(tapX <= xBoundsLow) {
			x = xBoundsLow;
		} else if(tapX >= xBoundsHigh) {
			x = xBoundsHigh;
		}

		if(tapY >= yBoundsLow && tapY <= yBoundsHigh) {
			y = tapY;
		} else if(tapY <= yBoundsLow) {
			y = yBoundsLow;
		} else if(tapY >= yBoundsHigh) {
			y = yBoundsHigh;
		}

		var disk = this.disks.getFirstExists(false);
		if(!disk) {
			disk = new Disk(this.game, 0, 0);
			this.disks.add(disk);
		}
		disk.reset(x, y);
		disk.x = x;
		disk.y = y;
		var velocityX = this.game.rnd.integerInRange(-50,50);
		if(velocityX <= 0) velocityX - 30;
		if(velocityX > 0) velocityX + 30;

		this.game.physics.p2.enable(disk, false);


		this.diskCount--;
		this.diskText.text = 'Tweets: ' + this.diskCount;
		this.diskText.x = this.game.width - this.diskText.textWidth - 10;

		disk.body.velocity.setTo(velocityX, this.game.rnd.integerInRange(10,40));
		disk.body.drag.set(40, 40);
		disk.revive();

	},
	setupBaskets: function() {
		var spaceX = this.fieldWidth / this.enemyPerX;

		var offsetX = 40 + (this.game.width / 2) - this.fieldWidth / 2;
		var offsetY = this.game.height - 75;

		for(var i = this.enemyPerX - 1; i >= 0; i--) {
			this.placeBasket(offsetX + i * spaceX, offsetY + 20);
			this.basketText = this.game.add.bitmapText(offsetX + i * spaceX, offsetY + 30, 'minecraftia', "" + this.points[i], 32);
			this.basketText.x = this.basketText.x - (this.basketText.textWidth / 2)
			if(this.points[i] >= 2500) this.basketText.tint = 0xff6600;

		}


	},
	placeBasket: function(x, y) {
		var basket = this.baskets.getFirstExists(false);
		if(!basket) {
			basket = new Basket(this.game, 0,0);
			this.baskets.add(basket);
		}
		basket.reset(x, y);
		basket.revive();
	},
	setupField: function() {

		var spaceX = this.fieldWidth / this.enemyPerX;
		var spaceY = this.fieldHeight / this.enemyPerY;

		var offsetX = 20 + (this.game.width / 2) - this.fieldWidth / 2;
		var offsetY =  200;

		// console.log(spaceX, spaceY, '---', offsetX, offsetY, '--', this.enemyPerY);

		for (var j = this.enemyPerY - 1; j >= 0; j--) {
			for (var i = this.enemyPerX - 1; i >= 0; i--) {
				// on even rows, offset a bit
				if(j !== 0 && j % 2) {
					tempSpaceX = this.fieldWidth / this.enemyPerX - 1;
					tempOffsetX = 40 + (this.game.width / 2) - this.fieldWidth / 2 + spaceX / 2;
					this.placeEnemy(tempOffsetX + i * tempSpaceX, offsetY + j * spaceY);
				} else {
					this.placeEnemy(offsetX + i * spaceX, offsetY + j * spaceY);
				}
			};
		};
	},
	placeEnemy: function(x, y) {
		var enemy = this.enemies.getFirstExists(false);
		if(!enemy) {
			enemy = new Enemy(this.game, 0,0);
			this.enemies.add(enemy);
		}
		enemy.reset(x, y);
		enemy.anchor.setTo(0.5);
		enemy.revive();
	},
	createEnemy: function() {

		var xBounds = this.game.width * .6;
		var yBounds = this.game.height * .2;

		var xBoundsLow = this.game.width / 2 - xBounds / 2;
		var xBoundsHigh = this.game.width / 2 + xBounds / 2;

		var yBoundsLow = 0;
		var yBoundsHigh = yBounds / 2;

		var x = this.game.rnd.integerInRange(xBounds, this.game.width - xBounds);
		var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

		var enemy = this.enemies.getFirstExists(false);
		if(!enemy) {
			enemy = new Enemy(this.game, 0, 0);
			this.enemies.add(enemy);
		}
		enemy.reset(x, y);
		enemy.revive();
	},
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
