import './styles/reset.scss'
import './styles/index.scss'
import bindEvent from './events'
import weixin from './weixin'
import { inputBlurBugFix, checkAuth } from './utils'

import './images/qr_code.png'

checkAuth(() => {
  bindEvent()
  inputBlurBugFix()
  weixin()
})


