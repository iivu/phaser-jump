import './styles/reset.scss'
import './styles/index.scss'
import bindEvent from './events'
import weixin from './weixin'
import { inputBlurBugFix, checkAuth } from './utils'

import './images/qr_code.jpeg'
import './images/post.jpeg'

checkAuth(() => {
  bindEvent()
  inputBlurBugFix()
  weixin()
}, true)



