
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
