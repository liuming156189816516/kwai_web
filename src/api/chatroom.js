import request from '@/utils/request'

export const getchatcustomerlist = (params) =>{
    return request({url:'/customer/getchatcustomerlist',method:'post',data:params})
}

export const getchataccountcustomerlist = (params) =>{
    return request({url:'/customer/getchataccountcustomerlist',method:'post',data:params})
} 
export const getchatgrouplist = (params) =>{
    return request({url:'/customer/getchatgrouplist',method:'post',data:params})
}  
export const dochatgroup = (params) =>{
    return request({url:'/customer/dochatgroup',method:'post',data:params})
}    
export const getcustomerfriendlist = (params) =>{
    return request({url:'/customer/getcustomerfriendlist',method:'post',data:params})
}  
export const dochatuptop = (params) =>{
    return request({url:'/customer/dochatuptop',method:'post',data:params})
} 
export const dooutfanexcel = (params) =>{
    return request({url:'/customer/dooutfanexcel',method:'post',data:params})
}  
export const doclearfans = (params) =>{
    return request({url:'/customer/doclearfans',method:'post',data:params})
}
export const getcustomermessagelist = (params) =>{
    return request({url:'/customer/getcustomermessagelist',method:'post',data:params})
}
export const dochatcanceluptop = (params) =>{
    return request({url:'/customer/dochatcanceluptop',method:'post',data:params})
}

export const dochatupbook = (params) =>{
    return request({url:'/customer/dochatupbook',method:'post',data:params})
}
export const getchatmovegrouplist = (params) =>{
    return request({url:'/customer/getchatmovegrouplist',method:'post',data:params})
}
export const dochatmovegroup = (params) =>{
    return request({url:'/customer/dochatmovegroup',method:'post',data:params})
}
export const dobatchclearfans = (params) =>{
    return request({url:'/customer/dobatchclearfans',method:'post',data:params})
}
export const sendmsg = (params) =>{
    return request({url:'/customer/sendmsg',method:'post',data:params})
}
export const doreadmessage = (params) =>{
    return request({url:'/customer/doreadmessage',method:'post',data:params})
}
export const getcustomerunreadlist = (params) =>{
    return request({url:'/customer/getcustomerunreadlist',method:'post',data:params})
}

export const getaccountstatus = (params) =>{
    return request({url:'/customer/getaccountstatus',method:'post',data:params})
}
export const translatetext = (params) =>{
    return request({url:'/customer/translatetext',method:'post',data:params})
}
export const globalsetting = (params) =>{
    return request({url:'/customer/globalsetting',method:'post',data:params})
}
export const getglobalsetting = (params) =>{
    return request({url:'/customer/getglobalsetting',method:'post',data:params})
}
export const delmessage = (params) =>{
    return request({url:'/customer/delmessage',method:'post',data:params})
}
export const getfriendinfo = (params) =>{
    return request({url:'/customer/getfriendinfo',method:'post',data:params})
}
export const upfriendinfo = (params) =>{
    return request({url:'/customer/upfriendinfo',method:'post',data:params})
}
export const dochataccountinfo = (params) =>{
    return request({url:'/customer/dochataccountinfo',method:'post',data:params})
}
export const correction = (params) =>{
    return request({url:'/customer/correction',method:'post',data:params})
}
export const quicklysendmsg = (params) =>{
    return request({url:'/customer/quicklysendmsg',method:'post',data:params})
}

export const messagedecrypt = (params) =>{
    return request({url:'/customer/messagedecrypt',method:'post',data:params})
}











