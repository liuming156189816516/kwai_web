import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/accountcheckertask/getaccountcheckertasklist',
    method: 'post',
    data: params
  })
}

// 新建
export const addEditDataApi = (params) => {
  return request({
    url: '/accountcheckertask/doaccountcheckertask',
    method: 'post',
    data: params
  })
}

// 批量关闭
export const batchCloseDataApi = (params) => {
  return request({
    url: '/accountcheckertask/batchcloseaccountcheckertask',
    method: 'post',
    data: params
  })
}

// 详情-列表
export const getDetailListApi = (params) => {
  return request({
    url: '/accountcheckertask/getaccountcheckertaskinfolist',
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
