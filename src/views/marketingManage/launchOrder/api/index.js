import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/marketlaunchtask/getmarketlaunchorderlist',
    method: 'post',
    data: params
  })
}

