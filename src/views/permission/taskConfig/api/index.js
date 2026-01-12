import request from '@/utils/request'

// 列表
export const getTaskConfigListApi = (params) => {
  return request({
    url: '/taskconfig/gettaskconfiglist',
    method: 'post',
    data: params
  })
}



// 新增 编辑 删除
export const addAndEditTaskConfigApi = (params) => {
  return request({
    url: '/taskconfig/dotaskconfig',
    method: 'post',
    data: params
  })
}

