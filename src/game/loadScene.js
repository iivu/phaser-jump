export default {

	key:'loadScene',

	preload: function () {
		this.load.image('bg', require('../images/game_bg1.jpg'))
		this.load.image('player', require('../images/player.png'))
		this.load.image('c1', require('../images/c1.png'))
		this.load.image('c2', require('../images/c2.png'))
		this.load.image('c3', require('../images/c3.png'))
	},

	create: function () {
		this.scene.start('gameScene');
	}

}