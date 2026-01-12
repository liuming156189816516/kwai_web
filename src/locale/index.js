import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en.js'
import zhLocale from './zh.js'
 
Vue.use(VueI18n)
 
const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}
export function getLanguage() {
  const chooseLanguage = Cookies.get('lang')||'zh';
  // const chooseLanguage = 'en';
  return chooseLanguage
}
const i18n = new VueI18n({
  locale: getLanguage(),
  messages
})
 
export default i18n