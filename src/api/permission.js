import request from '@/utils/request'

/*** 菜单管理*/
export const allmenu=(params)=> {
    return request({url:'/adminmember/allmenu',method:'post',data:params})
}
export const domenu=(params)=> {
    return request({url:'/adminmember/domenu',method:'post',data:params})
}

/*** 账户管理*/
export const adminuser=(params)=> {
    return  request({url:'/adminmember/adminuser',method:'post',data:params})
}
export const doadminuser=(params)=> {
    return request({url:'/adminmember/doadminuser',method:'post',data:params})
}

/*** 角色管理*/
export const rolelist=(params)=> {
    return request({url:'/adminmember/rolelist',method:'post',data:params})
}
export const dorole=(params)=> {
    return request({url:'/adminmember/dorole',method:'post',data:params})
}

/*** 系统配置*/
export const sysconfigList=(params)=> {
    return request({url:'/adminmember/sysconfig',method:'post',data:params})
}
export const dosysconfig=(params)=> {
    return request({url:'/adminmember/dosysconfig',method:'post',data:params})
}

/*** 日志*/
export const adminlog=(params)=> {
    return request({url:'/adminmember/adminlog',method:'post',data:params})
}




