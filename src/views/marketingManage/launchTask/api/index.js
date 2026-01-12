import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/marketlaunchtask/getmarketlaunchtasklist',
    method: 'post',
    data: params
  })
}

// 详情-列表
export const getDetailListApi = (params) => {
  return request({
    url: '/marketlaunchtask/getmarketlaunchtaskinfolist',
    method: 'post',
    data: params
  })
}

// 新建
export const addEditDataApi = (params) => {
  return request({
    url: '/marketlaunchtask/domarketlaunchtask',
    method: 'post',
    data: params
  })
}

// 批量关闭
export const batchCloseDataApi = (params) => {
  return request({
    url: '/marketlaunchtask/batchclosemarketlaunchtask',
    method: 'post',
    data: params
  })
}

// 获取 自动炸群
export const getTaskSwitchApi = (params) => {
  return request({
    url: '/marketlaunchtask/gettaskswitch',
    method: 'post',
    data: params
  })
}

// 修改 自动炸群
export const SetTaskSwitchApi = (params) => {
  return request({
    url: '/marketlaunchtask/settaskswitch',
    method: 'post',
    data: params
  })
}

// 详情-列表
export const getDetailObjApi = (params) => {
  return request({
    url: '/marketlaunchtask/getmarketlaunchtaskstatus',
    method: 'post',
    data: params
  })
}

// 账号分组列表
export const getAccountGroupApi = (params) => {
  return request({
    url: '/marketlaunchtask/getgrouplist',
    method: 'post',
    data: params
  })
}

