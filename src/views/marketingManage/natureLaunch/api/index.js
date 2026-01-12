import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/naturelaunchtask/getnaturelaunchtasklist',
    method: 'post',
    data: params
  })
}

// 新建 编辑 删除
export const addEditDataApi = (params) => {
  return request({
    url: '/naturelaunchtask/donaturelaunchtask',
    method: 'post',
    data: params
  })
}

// 任务详情-列表
export const getDetailListApi = (params) => {
  return request({
    url: '/naturelaunchtask/getnaturelaunchtaskinfolist',
    method: 'post',
    data: params
  })
}

// 投放任务-列表
export const getTaskListApi = (params) => {
  return request({
    url: '/naturelaunchtask/getnaturelaunchtaskstatus',
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
