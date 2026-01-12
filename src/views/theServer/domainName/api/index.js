import request from '@/utils/request'

// 素材-列表
export const getDataApi = (params) => {
  return request({
    url: '/domain/getdomainlist',
    method: 'post',
    data: params
  })
}

// 批量同步域名到期时间
export const postExpireTimeApi = (params) => {
  return request({
    url: '/domain/syncdomainexpiretime',
    method: 'post',
    data: params
  })
}

// 导出
export const exportDataApi = (params) => {
  return request({
    url: '/domain/dooutputdomain',
    method: 'post',
    data: params
  })
}
