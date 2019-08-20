import $ from 'jquery'
import init, { game } from './game/init'
import { get } from './globalData'

const $modal = $('.modal')
const $shareModal = $('.share-modal')

function bgmControl() {
  const $voiceBar = $('.voice-bar')
  if ($voiceBar.hasClass('active')) {
    $voiceBar.removeClass('active')
    $('.bgm')[0].pause()
  } else {
    $voiceBar.addClass('active')
    $('.bgm')[0].play()
  }
}

export default function bindEvent() {

  $('.x').on('click', () => $modal.hide())

  $('.rules-bar').on('click', () => $('.rules-modal').show())

  $shareModal.on('click', () => $shareModal.hide())

  $('.share-btn').on('click', () => $shareModal.show())

  $('.action-btn.gift').on('click', () => {

  })

  $('.action-btn.rank').on('click', () => {

  })

  $('.action-btn.voice').on('click', () => {
    bgmControl()
  })

  $('.start-btn').on('click', () => {
    $('.rules-bar').hide()
    $('.voice-bar').show()
    $('.home').hide()
    $('#game-wrap').show()
    $('.game-rules-modal').show()
    init()
  })

  $('.game-rules-modal .know-btn').on('click', () => $modal.hide())

  $('.voice-bar').on('click', () => {
    bgmControl()
  })

  $('.entry-btn').on('click', () => {
    const tel = $('.auth-tel-input').val()
    console.log(tel)
  })

  $('.again-action').on('click', () => {
    $modal.hide()
    game.scene.start('gameScene')
    if (get('chance')) {
      $modal.hide()
      game.scene.start('gameScene')
    }
  })

}
