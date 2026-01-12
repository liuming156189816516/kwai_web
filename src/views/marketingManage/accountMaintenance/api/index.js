import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/accountfarmertask/getaccountfarmertasklist',
    method: 'post',
    data: params
  })
}

// 新建
export const addEditDataApi = (params) => {
  return request({
    url: '/accountfarmertask/doaccountfarmertask',
    method: 'post',
    data: params
  })
}

// 批量关闭
export const batchCloseDataApi = (params) => {
  return request({
    url: '/accountfarmertask/batchcloseaccountfarmertask',
    method: 'post',
    data: params
  })
}

// 详情-列表
export const getDetailListApi = (params) => {
  return request({
    url: '/accountfarmertask/getaccountfarmertaskinfolist',
    method: 'post',
    data: params
  })
}

// 账号分组列表
export const getAccountGroupApi = (params) => {
  return request({
    url: '/account/getaccountgrouplist',
    method: 'post',
    data: params
  })
}
