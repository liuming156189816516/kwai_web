import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/card/getcardaccountlist',
    method: 'post',
    data: params
  })
}

// 新增 编辑
export const editDataApi = (params) => {
  return request({
    url: '/card/docardaccount',
    method: 'post',
    data: params
  })
}

// 登录
export const loginCardApi = (params) => {
  return request({
    url: '/card/logincardaccount',
    method: 'post',
    data: params
  })
}

// 单行-同步卡账户
export const syncCardApi = (params) => {
  return request({
    url: '/card/synccardaccount',
    method: 'post',
    data: params
  })
}

// 单行-批量开卡
export const batchCardApi = (params) => {
  return request({
    url: '/card/batchopencard',
    method: 'post',
    data: params
  })
}

// 单行-同步卡列表
export const syncCardListApi = (params) => {
  return request({
    url: '/card/synccardlist',
    method: 'post',
    data: params
  })
}

// 批量操作-批量开卡
export const batchCardDataApi = (params) => {
  return request({
    url: '/card/oneclickbatchopencard',
    method: 'post',
    data: params
  })
}

// 批量操作-同步卡账户
export const syncCardDataApi = (params) => {
  return request({
    url: '/card/oneclicksynccardaccount',
    method: 'post',
    data: params
  })
}

// 批量操作-同步卡列表
export const syncCardListDataApi = (params) => {
  return request({
    url: '/card/oneclicksynccardlist',
    method: 'post',
    data: params
  })
}
