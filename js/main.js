// var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'game');

game.state.add('Boot', Rollnut.Boot);
game.state.add('Preloader', Rollnut.Preload)
game.state.add('MainMenu', Rollnut.MainMenu)
game.state.add('Game', Rollnut.Game)

game.state.start('Boot');
