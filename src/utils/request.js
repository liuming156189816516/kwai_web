import axios from 'axios'
import i18n from '@/locale'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const baseUrl = process.env.NODE_ENV=="production"?`${process.env.VUE_APP_BASE_PATH}:${process.env.VUE_APP_SERVER_PORT}`:"/api";
axios.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'text/plain'
    config.url = getToken()?baseUrl+config.url+`?token=${getToken()}`:baseUrl+config.url
    if(config.method.toLowerCase() === 'get'){
      config.params = config.data;
    }
    return config
  },error => {
    console.log(error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(response => {
    const resdata = response.data;
    if (resdata.code == 0) {
      return resdata;
    } else {
      Message({
        message: resdata.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (resdata.code === 401 || resdata.code === 50012 || resdata.code === 50014) {
        MessageBox.confirm(i18n.t('sys_l010'), i18n.t('sys_l013'), {
          confirmButtonText: i18n.t('sys_c024'),
          closeOnClickModal: false,
          showCancelButton: false,
          showClose: false,
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return resdata
    }
  },error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default axios
