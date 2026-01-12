import request from '@/utils/request'

/*** 工单*/
export const getaccountlist = (params)=> {
  return request({url:'/work/getaccountlist',method:'post',data:params})
}
export const docreateworktask = (params)=> {
    return request({url:'/work/docreateworktask',method:'post',data:params})
}
export const getworktasklist = (params)=> {
    return request({url:'/work/getworktasklist',method:'post',data:params})
}
export const doworkshunt = (params)=> {
    return request({url:'/work/doworkshunt',method:'post',data:params})
}
export const createShare = (params)=> {
    return request({url:'/work/createshare',method:'post',data:params})
}
export const getworkrecordlist = (params)=> {
    return request({url:'/work/getworkrecordlist',method:'post',data:params})
}
export const dobatchdelworktask = (params)=> {
    return request({url:'/work/dobatchdelworktask',method:'post',data:params})
}
export const dobatchsetworktask = (params)=> {
    return request({url:'/work/dobatchsetworktask',method:'post',data:params})
}
export const dobatchsetzeroingtime = (params)=> {
    return request({url:'/work/dobatchsetzeroingtime',method:'post',data:params})
}
export const doupworktask = (params)=> {
    return request({url:'/work/doupworktask',method:'post',data:params})
}
export const cancelshare = (params)=> {
    return request({url:'/work/cancelshare',method:'post',data:params})
}
export const setwordshare = (params)=> {
    return request({url:'/work/setwordshare',method:'post',data:params})
}
export const setworkdiversion = (params)=> {
    return request({url:'/work/setworkdiversion',method:'post',data:params})
}
export const getworkconf = (params)=> {
    return request({url:'/work/getworkconf',method:'post',data:params})
}
export const getworkaccountfriendlist = (params)=> {
    return request({url:'/work/getworkaccountfriendlist',method:'post',data:params})
}
export const getworktask = (params)=> {
    return request({url:'/work/getworktask',method:'post',data:params})
}
export const getworkaccountlist = (params)=> {
    return request({url:'/work/getworkaccountlist',method:'post',data:params})
}
export const dodistributeaccount = (params)=> {
    return request({url:'/work/dodistributeaccount',method:'post',data:params})
}
export const getworkcustomerlist = (params)=> {
    return request({url:'/work/getworkcustomerlist',method:'post',data:params})
}
export const dooutworkaccount = (params)=> {
    return request({url:'/work/dooutworkaccount',method:'post',data:params})
}
export const dooutworkfriend = (params)=> {
    return request({url:'/work/dooutworkfriend',method:'post',data:params})
}





