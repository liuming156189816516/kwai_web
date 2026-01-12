import Vue from 'vue'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './styles/element-variables.scss'
import Element from 'element-ui'
import '@/styles/index.scss' // global css
// import 'umy-ui/lib/theme-chalk/index.css';// 引入样式
import i18n from '@/locale'
import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters
import funHandle from '@/utils/index';
// import locale from 'umy-ui/lib/locale/lang/en'
Vue.prototype.$baseFun = funHandle;
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// Vue.use(UmyUi, { locale })
// Vue.use(UmyUi);
import { UTableColumn,UTable } from 'umy-ui';
Vue.use(UTableColumn);
Vue.use(UTable);
Vue.use(Element,{i18n:(key,value)=>i18n.t(key,value)})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
