import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/card/getcardlist',
    method: 'post',
    data: params
  })
}

// 详情
export const detailDataApi = (params) => {
  return request({
    url: '/card/getcarddetail',
    method: 'post',
    data: params
  })
}

// 信用卡余额 同步
export const getCardBalanceApi = (params) => {
  return request({
    url: '/card/getcardbalance',
    method: 'post',
    data: params
  })
}

// 充值
export const rechargeCardApi = (params) => {
  return request({
    url: '/card/rechargecard',
    method: 'post',
    data: params
  })
}

// 提取
export const reduceCardApi = (params) => {
  return request({
    url: '/card/reducecard',
    method: 'post',
    data: params
  })
}

