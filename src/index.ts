import './style/index.scss'
import { executeRecaptcha } from './captcha'
import { handleSubmit } from './form'

if (module['hot']) {
  module['hot'].dispose(() => {})
}

executeRecaptcha('homepage_enter')

window['handleSubmit'] = handleSubmit
