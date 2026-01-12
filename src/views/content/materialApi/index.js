import request from '@/utils/request'

// 素材-列表
export const getDataApi = (params) => {
  return request({
    url: '/material/getmateriallist',
    method: 'post',
    data: params
  })
}
// 素材-操作 增删
export const editDataApi = (params) => {
  return request({
    url: '/material/domaterial',
    method: 'post',
    data: params
  })
}
// 移动分组
export const moveDataApi = (params) => {
  return request({
    url: '/material/domovegroup',
    method: 'post',
    data: params
  })
}

// 素材分组-列表
export const getMaterialListApi = (params) => {
  return request({
    url: '/materialgroup/getmaterialgrouplist',
    method: 'post',
    data: params
  })
}

// 素材分组-操作
export const editMaterialListApi = (params) => {
  return request({
    url: '/materialgroup/domaterialgroup',
    method: 'post',
    data: params
  })
}

// 拖拽编辑
export const editSortGroup = (params) => {
  return request({
    url: '/materialgroup/materialsortgroup',
    method: 'post',
    data: params
  })
}

// 素材-列表
export const getMaterialApi = (params) => {
  return request({
    url: '/material/getmaterialfilelist',
    method: 'post',
    data: params
  })
}

// 导出
export const exportDataApi = (params) => {
  return request({
    url: '/material/dooutputmaterial',
    method: 'post',
    data: params
  })
}
