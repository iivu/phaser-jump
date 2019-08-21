import $ from 'jquery'
import init, { game } from './game/init'
import { get } from './globalData'
import { olert, bindMobile, renderRank } from './utils'

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

function giftAndRankControl(type) {
  $('.rank-gift-modal .tab').removeClass('active')
  $('.rank-gift-modal .content').hide()
  $(`.rank-gift-modal .${type}-tab`).addClass('active')
  $(`.rank-gift-modal .${type}`).show()
  $('.rank-gift-modal').show()
}

function initGame() {
  $('.rules-bar').hide()
  $('.voice-bar').show()
  $('.home').hide()
  $('#game-wrap').show()
  $('.game-rules-modal').show()
  $('.mobile-auto-modal').hide()
  init()
}

function checkChance() {
  if (get('chance') > 0) {
    initGame()
  } else {
    $('.no-chance-modal').show()
  }
}

export default function bindEvent() {

  $('.x').on('click', () => $modal.hide())

  $('.rank-gift-modal .close').on('click', () => $('.rank-gift-modal').hide())

  $('.rules-bar').on('click', () => $('.rules-modal').show())

  $shareModal.on('click', () => $shareModal.hide())

  $('.share-btn').on('click', () => $shareModal.show())

  $('.rank-action').on('click', () => {
    renderRank(() => giftAndRankControl('rank'))
  })

  $('.action-btn.gift').on('click', () => {
    giftAndRankControl('gift')
  })

  $('.action-btn.rank').on('click', () => {
    renderRank(() => giftAndRankControl('rank'))
  })

  $('.action-btn.voice').on('click', () => {
    bgmControl()
  })

  $('.start-btn').on('click', () => {
    //initGame()
    if (get('isBindMobile') === 0) {
      $('.mobile-auto-modal').show()
    } else {
      checkChance()
    }
  })

  $('.game-rules-modal .know-btn').on('click', () => $modal.hide())

  $('.voice-bar').on('click', () => {
    bgmControl()
  })

  $('.entry-btn').on('click', () => {
    const tel = $('.auth-tel-input').val()
    if (!tel || !/^1[3456789]\d{9}$/.test(tel)) {
      olert.show({ content: '请填写合法的手机号' })
    } else {
      bindMobile(tel, () => {
        checkChance()
      })
    }
  })

  $('.again-action').on('click', () => {
    if (get('chance') > 0) {
      $modal.hide()
      game.scene.start('gameScene')
    } else {
      $('.no-chance-modal').show()
    }
  })

  $('.rank-gift-modal .rank-tab').on('click', function () {
    if ($(this).hasClass('active')) return
    renderRank(() => giftAndRankControl('rank'))
  })

  $('.rank-gift-modal .gift-tab').on('click', function () {
    if ($(this).hasClass('active')) return
    giftAndRankControl('gift')
  })

}
