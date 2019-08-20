import Phaser from 'phaser'
import gameScene from './gameScene'
import loadScene from './loadScene'
import overScene from './overScene'

export const WIN_WIDTH = window.innerWidth

export const WIN_HEIGHT = window.innerHeight

export let game = null

const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: WIN_WIDTH,
  height: WIN_HEIGHT,
  parent: 'game-wrap',
  scene: [loadScene, gameScene, overScene],
  backgroundColor: '#fff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500 },
      debug: false
    }
  },
}

function init() {

  game = new Phaser.Game(GAME_CONFIG)

}

export default init
