import request from '@/utils/request'

/*** 登录*/
export const login = (params) =>{
  return request({url:'/adminmember/login',method:'post',data:params})
}
export const adminmenu = (params)=> {
  return request({url:'/adminmember/menu',method:'post',data:params})
}
export const getuserinfo = (params)=> {
  return request({url:'/adminmember/getuserinfo',method:'post',data:params})
}
export const loginout = (params)=> {
  return request({url:'/adminmember/loginout',method:'post',data:params})
}
export const checkpassword = (params)=> {
  return request({url:'/work/checkpassword',method:'post',data:params})
}
export const online = (params)=> {
  return request({url:'/adminmember/online',method:'post',data:params})
}




