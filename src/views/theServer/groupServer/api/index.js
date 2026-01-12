import request from '@/utils/request'

// 素材-列表
export const getDataApi = (params) => {
  return request({
    url: '/serverstation/getserverstationlist',
    method: 'post',
    data: params
  })
}

// 素材-新增 编辑 删除
export const editDataApi = (params) => {
  return request({
    url: '/serverstation/doserverstation',
    method: 'post',
    data: params
  })
}

// 素材-新增 编辑 删除
export const syncDoMainApi = (params) => {
  return request({
    url: '/serverstation/syncdomain',
    method: 'post',
    data: params
  })
}
