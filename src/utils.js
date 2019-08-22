import $ from 'jquery'
import md5 from './md5'
import { set, get } from './globalData'

function Olert() {
  this.wrap = null
  this.contentWrap = null
  this.olertWrap = null
  this.confirmBtn = null
  this.confirmHandler = null
  this.init()
  this.bind()
}

Olert.prototype = {
  constructor: Olert,

  init: function () {
    let html = `<div class="olert">
                        <p class="content"></p>
                        <div class="confirm-button">确定</div>
                </div>
               
`
    let wrap = document.createElement('div')
    wrap.classList.add('olert-modal')
    wrap.innerHTML = html
    document.body.appendChild(wrap)
    this.wrap = document.querySelector('.olert-modal')
    this.contentWrap = document.querySelector('.olert-modal .content')
    this.olertWrap = document.querySelector('.olert-modal .olert')
    this.confirmBtn = document.querySelector('.olert-modal .confirm-button')
  },

  show: function (options) {
    this.contentWrap.innerText = options.content
    this.olertWrap.classList.add(options.tween || 'scaleIn')
    this.wrap.style.display = 'block'
    this.confirmHandler = options.comfirm
  },

  bind: function () {
    let _this = this
    _this.confirmBtn.addEventListener('click', function () {
      _this.wrap.style.display = 'none'
      _this.confirmHandler && _this.confirmHandler.call()
    })
  },

}

export const olert = new Olert()

//修复ios输入框失去焦点后页面不回弹的问题
export function inputBlurBugFix() {
  let timer = null
  if (/iphone|ipad/i.test(navigator.userAgent)) {
    $('input,select').on('blur', () => {
      timer = setTimeout(() => {
        window.scrollTo(0, 0)
      }, 50)
    }).on('focus', () => {
      clearTimeout(timer)
    })
  }
}

export function checkResIsValid(res) {
  if (res.code === 10103 || res.code === 10108) {
    window.location = `http://h5.hnliantong.cn/mini/authorize/index?callback=${encodeURIComponent(window.location.href)}`
  } else {
    olert.show({ content: res.msg })
  }
}

export function setLoading(type) {
  $('.loading-modal')[type]()
}

export function randomStr(num) {
  const dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < num; i++) {
    const random = Math.floor(Math.random() * dict.length)
    result += dict[random]
  }
  return result
}

export function encodeData(data) {
  function getRandom() {
    return Math.ceil((Math.random() * 5) + 1)
  }

  const paramsNum = getRandom()
  const result = Object.assign({}, data)
  console.log(result)
  for (let i = 0; i < paramsNum; i += 1) {
    result[randomStr(getRandom())] = randomStr(getRandom())
  }
  const sortKeys = Object.keys(result).sort()
  sortKeys.forEach((key, index) => sortKeys[index] = `${key}=${result[key]}`)
  let dataStr = sortKeys.join('&')
  dataStr += `&key=YWDZXe85sifGoFzoTVxvl3VLOVGtoDZV`
  result.sign = md5(dataStr).toUpperCase()
  return result
}

export function checkAuth(cb) {
  $.get({
    url: 'http://jhs.dochuang.cn/game/index/isAuthorize',
    xhrFields: {
      withCredentials: true
    },
    data: encodeData({}),
    success: function (res) {
      if (res.data.isAuth === 0) {
        window.location = `http://jhs.dochuang.cn/game/authorize/index?callback=${encodeURIComponent(window.location.href)}`
      } else {
        set('isBindMobile', res.data.isBindMobile)
        set('totalScore', res.data.score)
        set('chance', res.data.num)
        $('.score-bar').text(res.data.score)
        $('.life-bar').text(res.data.num)
        $('.home').show()
        $('.status-bar-wrap').show()
        cb && cb()
      }
    }
  })
}

export function bindMobile(mobile, cb) {
  setLoading('show')
  $.post({
    url: 'http://jhs.dochuang.cn/game/index/bindMobile',
    xhrFields: {
      withCredentials: true
    },
    data: encodeData({ mobile }),
    success: function (res) {
      setLoading('hide')
      if (res.code === 200) {
        cb && cb()
      } else {
        checkResIsValid(res)
      }
    }
  })
}

export function renderRank(cb) {
  setLoading('show')
  $.get({
    url: 'http://jhs.dochuang.cn/game/index/rank',
    xhrFields: {
      withCredentials: true
    },
    data: encodeData({}),
    success: function (res) {
      setLoading('hide')
      if (res.code === 200) {
        const rankNumMap = { 0: 'first', 1: 'second', 2: 'third' }
        let html = ''
        res.data.lists.forEach((item, index) => {
          html += `
          <div class="rank-item">
            <div class="rank-num ${rankNumMap[index] || 'normal'}">${index + 1}</div>
            <div class="info">
              <img class="avatar" src="${item.avatar}" alt="">
              <span>${item.nickname}</span>
            </div>
            <div class="score">${item.score}</div>
          </div>
         `
        })
        $('.rank-gift-modal .rank').html(html)
        cb && cb()
      } else {
        checkResIsValid(res)
      }
    }
  })
}

export function postScore(score, cb) {
  setLoading('show')
  $.post({
    url: 'http://jhs.dochuang.cn/game/index/playGame',
    xhrFields: {
      withCredentials: true
    },
    data: encodeData({ score }),
    success: function (res) {
      setLoading('hide')
      if (res.code === 200) {
        cb && cb()
      } else {
        checkResIsValid(res)
      }
    }
  })
}

export function onShare() {
  setLoading('show')
  $.get({
    url: 'http://jhs.dochuang.cn/game/index/shareAdd',
    xhrFields: {
      withCredentials: true
    },
    data: encodeData({}),
    success: function (res) {
      setLoading('hide')
      if (res.code === 200) {
        if (res.data.isAddNum === 1) {
          set('chance', get('chance') + 2)
          $('.life-bar').text(get('chance'))
        }
      } else {
        checkResIsValid(res)
      }
    }
  })
}
