import Phaser from 'phaser'
import $ from 'jquery'
import { WIN_WIDTH, WIN_HEIGHT } from './init'
import { get, set } from '../globalData'
import { postScore } from '../utils'

const NORMAL_PLATFORM = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']
const SPECIAL_PLATFORM = {
  7: 'c8',
  14: 'c9',
  21: 'c10',
  28: 'c11',
  29: 'c12',
  36: 'c13',
  43: 'c14',
  50: 'c15',
  57: 'c16',
  58: 'c17',
  59: 'c18',
  60: 'c19',
  61: 'c20',
  68: 'c21',
  75: 'c22',
  82: 'c23',
  89: 'c24',
  96: 'c25',
  103: 'c26',
  110: 'c27',
  117: 'c28',
  124: 'c29',
  131: 'c30',
  138: 'c31',
  145: 'c32',
  146: 'c33',
  153: 'c34',
  160: 'c35',
  167: 'c36',
  174: 'c37',
}

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
let nextScore = 1
let score = 0
let isJumping = false
let growPowerAudio = null
let jumpAudio = null
let isPostScore = false
let plane = null
let planeDirection = 1

//热气球和云碰撞回调
function onPlayAndPlatformsCollider(player, platform, ctx) {
  player.setVelocityX(0)
  //如果跳到新的云
  if (player.body.touching.down) isJumping = false
  if ((platform.__id !== currentPlatformId) && player.body.touching.down) {
    if(platformCount % 7 === 0) tweenPlane(ctx)
    //记录当前云的id
    currentPlatformId = platform.__id
    //反转跳跃x速度方向
    velocityXDirection *= -1
    //记录分数
    noteScore()
    //移动背景和所有的云
    movePlatformAndBackground(ctx)
  }
}

//生成云的位置纹理信息
function generatePlatformParams(isFirst = false) {
  const key = SPECIAL_PLATFORM[(platformCount + 1)] || Phaser.Utils.Array.GetRandom(NORMAL_PLATFORM)
  return [
    platformDirection === 1 ? 50 : WIN_WIDTH - (228 + 50),
    isFirst ? WIN_HEIGHT - 250 : lastPlatformPos[1] - Math.ceil(Phaser.Math.Between(200, 400)),
    key,
  ]
}

function createPlatform(isFirst = false, ctx) {
  const [x, y, key] = generatePlatformParams(isFirst)
  const platform = platforms.create(
    x, y, key
  ).setOrigin(0)
  platform.setSize(180, 60).setOffset(20, 150)
  platform.setImmovable(true)
  platform.body.allowGravity = false
  platform.__id = platformId++
  platformDirection *= -1
  lastPlatformPos = [x, y]
  platformCount += 1
}

//重置在屏幕下方的云到新的位置
function resetPlatform() {
  platforms.children.iterate(function (platform) {
    if (platform.y > WIN_HEIGHT - 100) {
      const [x, y, key] = generatePlatformParams()
      platform.setTexture(key).setPosition(x, y)
      platformDirection *= -1
      lastPlatformPos = [x, y]
      platformCount += 1
    }
  })
}

//设置热气球当前的位置
function notePlayerCurrentPos(x, y) {
  currentPlayerPos = [x, y]
}

//移动云和背景
function movePlatformAndBackground(ctx) {
  const distance = WIN_HEIGHT - player.y - 250
  player.body.allowGravity = false
  platforms.children.iterate(platform => {
    ctx.tweens.add({
      ease: 'Quart.easeOut',
      targets: platform,
      y: platform.y + distance,
      duration: 300,
    })
  })
  ctx.tweens.add({
    ease: 'Quart.easeOut',
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
  if (background.y < 2800) {
    ctx.tweens.add({
      targets: background,
      y: background.y + 15,
      duration: 300,
    })
  }
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
      if (velocityY < -1350) velocityY = -1350
    }
  })
}

//云动画
function animatePlatform(ctx) {
  platforms.children.iterate((platform, index) => {
    ctx.tweens.add({
      delay: index * 200,
      targets: platform,
      x: platform.x + 10,
      yoyo: true,
      loop: -1,
    })
  })
}

//记录分数
function noteScore() {
  const totalScore = get('totalScore')
  score += nextScore
  $('.score-bar').text(parseInt(totalScore + nextScore, 10))
  set('totalScore', totalScore + nextScore)
  nextScore += 1
}

//减少游戏机会
function reduceGameChance() {
  const chance = get('chance')
  $('.life-bar').text(parseInt(chance - 1, 10))
  set('chance', chance - 1)
}

//重置游戏数据
function resetGameData() {
  background = null
  platforms = null
  platformId = 0
  lastPlatformPos = []
  platformCount = 0
  platformDirection = 1
  player = null
  velocityY = 0
  velocityXDirection = 1
  powerTimer = null
  currentPlatformId = 0
  currentPlayerPos = []
  scaleTween = null
  nextScore = 1
  score = 0
  isJumping = false
  growPowerAudio = null
  jumpAudio = null
  isPostScore = false
}

function showResult() {
  $('.result-modal .current-score').text(`您获得${score}积分`)
  $('.result-modal .total-score').text(`您当前总积分：${get('totalScore')}`)
  $('.result-modal').show()
}

function tweenPlane(ctx) {
  const randomY = Phaser.Math.Between(300, 500)
  plane.setPosition(
    planeDirection < 0 ? -300 : WIN_HEIGHT + 300,
    randomY,
  )
  ctx.tweens.add({
    targets: plane,
    x: planeDirection < 0 ? WIN_HEIGHT + 300 : -300,
    y: plane.y + 300,
    duration: 3000,
    onComplete: () => {
      planeDirection *= -1
      plane.setFlipX(planeDirection < 0)
    }
  })
}

export default {

  key: 'gameScene',

  create: function () {
    background = this.add.image(0, WIN_HEIGHT, 'bg').setOrigin(0, 1)
    plane = this.add.image(WIN_WIDTH + 400, 600, 'plane')
    platforms = this.physics.add.group()
    for (let i = 0; i < 6; i += 1) {
      createPlatform(i === 0, this)
    }
    player = this.physics.add.sprite(180, WIN_HEIGHT - 350, 'player').setSize(100, 60).setOffset(40, 174)
    growPowerAudio = this.sound.add('grow_power')
    jumpAudio = this.sound.add('jump')
    currentPlayerPos = [180, WIN_HEIGHT - 350]
    animatePlatform(this)
    this.physics.add.collider(player, platforms, (player, platform) => {
      onPlayAndPlatformsCollider(player, platform, this)
    })
    this.input.on('pointerup', () => {
      if (isJumping) return
      isJumping = true
      growPowerAudio.stop()
      jumpAudio.play()
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
      if (isJumping) return
      jumpAudio.stop()
      growPowerAudio.play({ loop: true })
      scaleThePlayer(this)
      growVelocityY(this)
    })
  },

  update: function () {
    //出界
    if (player.y > WIN_HEIGHT - 60 || player.y < -100 || player.x > WIN_WIDTH + 100 || player.x < -100) {
      this.scene.pause()
      this.input.removeAllListeners()
      if (!isPostScore) {
        isPostScore = true
        postScore(score, () => {
          reduceGameChance()
          setTimeout(() => {
            showResult()
            resetGameData()
            this.scene.start('overScene')
          }, 500)
        })
      }
    }
  },

}
