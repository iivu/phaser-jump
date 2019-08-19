import Phaser from 'phaser'
import { WIN_WIDTH, WIN_HEIGHT } from './init'


const NORMAL_PLATFORM = ['c1', 'c2', 'c3']

let life = 3
let background = null
let platforms = null
let platformId = 0
//最后一个板子所在位置
let lastPlatformPos = []
let platformCount = 0
let platformDirection = 1
let player = null
let velocityY = 0
let velocityXDirection = 1
//蓄力计时器
let powerTimer = null
//当前板子ID
let currentPlatformId = 0
//当前热气球位置
let currentPlayerPos = []
let scaleTween = null

//热气球和云碰撞回调
function onPlayAndPlatformsCollider(player, platform, ctx) {
  player.setVelocityX(0)
  //如果跳到新的云
  if ((platform.__id !== currentPlatformId) && player.body.touching.down) {
    //记录当前云的id
    currentPlatformId = platform.__id
    //反转跳跃x速度方向
    velocityXDirection *= -1
    //移动背景和所有的云
    movePlatformAndBackground(ctx)
  }
}

//生成云的位置纹理信息
function generatePlatformParams(isFirst = false) {
  return [
    platformDirection === 1 ? 50 : WIN_WIDTH - (228 + 50),
    isFirst ? WIN_HEIGHT - 250 : lastPlatformPos[1] - Math.ceil(Phaser.Math.Between(200, 400)),
    Phaser.Utils.Array.GetRandom(NORMAL_PLATFORM)
  ]
}

function createPlatform(isFirst = false, ctx) {
  const [x, y, key] = generatePlatformParams(isFirst)
  const platform = platforms.create(
    x, y, key
  ).setOrigin(0)
  platform.setSize(228, 60).setOffset(0, 150)
  platform.setImmovable(true)
  platform.body.allowGravity = false
  platform.__id = platformId++
  platformDirection *= -1
  lastPlatformPos = [x, y]
  platformCount += 1
  console.log(x, y, key, platformCount)
}

//重置在屏幕下方的云到新的位置
function resetPlatform() {
  platforms.children.iterate(function (platform) {
    if (platform.y > WIN_HEIGHT - 100) {
      const [x, y, key] = generatePlatformParams()
      platform.setPosition(x, y).setTexture(key)
      platformDirection *= -1
      lastPlatformPos = [x, y]
      platformCount += 1
      console.log(x, y, key, platformCount)
    }
  })
}

//设置热气球当前的位置
function notePlayerCurrentPos(x, y) {
  currentPlayerPos = [x, y]
}

//移动云的背景
function movePlatformAndBackground(ctx) {
  const distance = WIN_HEIGHT - player.y - 250
  player.body.allowGravity = false
  platforms.children.iterate(platform => {
    ctx.tweens.add({
      targets: platform,
      y: platform.y + distance,
      duration: 300,
    })
  })
  ctx.tweens.add({
    targets: player,
    y: player.y + distance,
    duration: 300,
    onComplete: () => {
      //更新最后一个云的位置
      lastPlatformPos[1] = lastPlatformPos[1] + distance
      notePlayerCurrentPos(player.x, player.y - 50)
      resetPlatform()
      player.body.allowGravity = true
    }
  })
}

//蓄力缩放人物
function scaleThePlayer(ctx) {
  if (!scaleTween) {
    scaleTween = ctx.tweens.add({
      targets: player,
      scaleY: .5,
      duration: 2000,
    })
  } else {
    scaleTween.restart()
  }
}

//蓄力速度
function growVelocityY(ctx) {
  powerTimer = ctx.time.addEvent({
    delay: 50, loop: true, callback: function () {
      velocityY -= 50
    }
  })
}

//云动画
function animatePlatform(ctx) {
  platforms.children.iterate((platform, index) => {
    ctx.tweens.add({
      delay: index * 200,
      targets: platform,
      x: platform.x + 15,
      yoyo: true,
      loop: -1,
    })
  })
}

export default {

  key: 'gameScene',

  create: function () {
    background = this.add.image(0, WIN_HEIGHT, 'bg').setOrigin(0, 1)
    platforms = this.physics.add.group()
    for (let i = 0; i < 6; i += 1) {
      createPlatform(i === 0, this)
    }
    player = this.physics.add.sprite(180, WIN_HEIGHT - 350, 'player').setSize(100, 60).setOffset(40, 174)
    currentPlayerPos = [180, WIN_HEIGHT - 350]
    animatePlatform(this)
    this.physics.add.collider(player, platforms, (player, platform) => {
      onPlayAndPlatformsCollider(player, platform, this)
    })
    this.input.on('pointerup', () => {
      //清除蓄力动画
      if (scaleTween.isPlaying()) {
        scaleTween.stop(0)
      } else {
        player.setScale(1)
      }
      //清除蓄力速度
      powerTimer.remove()
      player.body.setVelocity(250 * velocityXDirection, velocityY)
      velocityY = 0
    })
    this.input.on('pointerdown', () => {
      scaleThePlayer(this)
      growVelocityY(this)
    })
  },

  update: function () {
    //出界
    if (player.y > WIN_HEIGHT - 60 || player.y < -100 || player.x > WIN_WIDTH + 100 || player.x < -100) {
      life -= 1
      if (life > 0) {
        player.setVelocity(0, -100)
        player.setPosition(
          currentPlayerPos[0] - (50 * velocityXDirection),
          currentPlayerPos[1]
        )
      } else {
        this.scene.pause()
      }
    }
  },

}

