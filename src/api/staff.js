import request from '@/utils/request'

/*** 客服坐席*/
export const getadmingrouplist = (params)=> {
  return request({url:'/customer/getadmingrouplist',method:'post',data:params})
}
export const doadmingroup = (params)=> {
    return request({url:'/customer/doadmingroup',method:'post',data:params})
}
export const getcustomeruserlist = (params)=> {
    return request({url:'/customer/getcustomeruserlist',method:'post',data:params})
}
export const addcustomeruser = (params)=> {
    return request({url:'/customer/addcustomeruser',method:'post',data:params})
}
export const dobathdelcustomer = (params)=> {
    return request({url:'/customer/dobathdelcustomer',method:'post',data:params})
}
export const domovecustomergroup = (params)=> {
    return request({url:'/customer/domovecustomergroup',method:'post',data:params})
}
export const doupcustomer = (params)=> {
    return request({url:'/customer/doupcustomer',method:'post',data:params})
}
export const getcustomeruserdata = (params)=> {
    return request({url:'/customer/getcustomeruserdata',method:'post',data:params})
}
export const doresettime = (params)=> {
    return request({url:'/customer/doresettime',method:'post',data:params})
}


