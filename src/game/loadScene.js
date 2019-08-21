export default {

  key: 'loadScene',

  preload: function () {
    this.load.audio('grow_power', require('../images/grow_power.mp3'))
    this.load.audio('jump', require('../images/jump.mp3'))
    this.load.image('bg', require('../images/game_bg.png'))
    this.load.image('player', require('../images/player.png'))
    this.load.image('c1', require('../images/c1.png'))
    this.load.image('c2', require('../images/c2.png'))
    this.load.image('c3', require('../images/c3.png'))
    this.load.image('c4', require('../images/c4.png'))
    this.load.image('c5', require('../images/c5.png'))
    this.load.image('c6', require('../images/c6.png'))
    this.load.image('c7', require('../images/c7.png'))
    this.load.image('c8', require('../images/c8.png'))
    this.load.image('c9', require('../images/c9.png'))
    this.load.image('c10', require('../images/c10.png'))
    this.load.image('c11', require('../images/c11.png'))
    this.load.image('c12', require('../images/c12.png'))
    this.load.image('c13', require('../images/c13.png'))
    this.load.image('c14', require('../images/c14.png'))
    this.load.image('c15', require('../images/c15.png'))
    this.load.image('c16', require('../images/c16.png'))
    this.load.image('c17', require('../images/c17.png'))
    this.load.image('c18', require('../images/c18.png'))
    this.load.image('c19', require('../images/c19.png'))
    this.load.image('c20', require('../images/c20.png'))
    this.load.image('c21', require('../images/c21.png'))
    this.load.image('c22', require('../images/c22.png'))
    this.load.image('c23', require('../images/c23.png'))
    this.load.image('c24', require('../images/c24.png'))
    this.load.image('c25', require('../images/c25.png'))
    this.load.image('c26', require('../images/c26.png'))
    this.load.image('c27', require('../images/c27.png'))
    this.load.image('c28', require('../images/c28.png'))
    this.load.image('c29', require('../images/c29.png'))
    this.load.image('c30', require('../images/c30.png'))
    this.load.image('c31', require('../images/c31.png'))
    this.load.image('c32', require('../images/c32.png'))
    this.load.image('c33', require('../images/c33.png'))
    this.load.image('c34', require('../images/c34.png'))
    this.load.image('c35', require('../images/c35.png'))
    this.load.image('c36', require('../images/c36.png'))
    this.load.image('c37', require('../images/c37.png'))
    this.load.image('plane', require('../images/plane.png'))
  },

  create: function () {
    this.scene.start('gameScene')
  }

}
