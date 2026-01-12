import request from '@/utils/request'

/*** 数据管理*/
export const getdatapacklist = (params)=> {
  return request({url:'/datapack/getdatapacklist',method:'post',data:params})
}
export const bathdel = (params)=> {
  return request({url:'/datapack/bathdel',method:'post',data:params})
}
export const uploadfile = (params)=> {
  return request({url:'/datapack/uploadfile',method:'post',data:params})
}
export const getschedule = (params)=> {
  return request({url:'/datapack/getschedule',method:'post',data:params})
}
export const dooutputdata = (params)=> {
  return request({url:'/datapack/dooutputdata',method:'post',data:params})
}
export const getresiduenum = (params)=> {
  return request({url:'/datapack/getresiduenum',method:'post',data:params})
}




