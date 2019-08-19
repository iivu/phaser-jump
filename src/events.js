import $ from 'jquery'
import init from './game/init'

const $modal = $('.modal')
const $shareModal = $('.share-modal')

export default function bindEvent() {

  $('.x').on('click', () => $modal.hide())

  $('.rules-bar').on('click', () => $('.rules-modal').show())

  $shareModal.on('click', () => $modal.hide())

  $('.action-btn.share').on('click', () => $shareModal.show())

  $('.action-btn.gift').on('click', () => {

  })

  $('.action-btn.rank').on('click', () => {

  })

  $('.action-btn.voice').on('click', () => {

  })

  $('.start-btn').on('click', () => {
    $('.home').hide()
    $('#game-wrap').show()
    $('.game-rules-modal').show()
    init()
  })

  $('.game-rules-modal .know-btn').on('click', () => $modal.hide())

}
