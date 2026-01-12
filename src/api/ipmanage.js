import request from '@/utils/request'

/*** ip管理*/
export const getiplist = (params)=> {
  return request({url:'/ip/getiplist',method:'post',data:params})
}
export const getgrouplist = (params)=> {
  return request({url:'/ip/getgrouplist',method:'post',data:params})
}
export const getcountrylist = (params)=> {
  return request({url:'/ip/getcountrylist',method:'post',data:params})
}
export const doipgroup = (params)=> {
  return request({url:'/ip/doipgroup',method:'post',data:params})
}

export const checkfile = (params)=> {
  return request({url:'/ip/checkfile',method:'post',data:params})
}

export const addip = (params)=> {
  return request({url:'/ip/addip',method:'post',data:params})
}

export const getipv4allot = (params)=> {
  return request({url:'/ip/getipv4allot',method:'post',data:params})
}

export const getipv6allot = (params)=> {
  return request({url:'/ip/getipv6allot',method:'post',data:params})
}

export const getipdynamicallot = (params)=> {
  return request({url:'/ip/getipdynamicallot',method:'post',data:params})
}

export const doexpiretime = (params)=> {
  return request({url:'/ip/doexpiretime',method:'post',data:params})
}

export const doallotnum = (params)=> {
  return request({url:'/ip/doallotnum',method:'post',data:params})
}

export const domoveipgroup = (params)=> {
  return request({url:'/ip/domoveipgroup',method:'post',data:params})
}

export const docheckstatus = (params)=> {
  return request({url:'/ip/docheckstatus',method:'post',data:params})
}

export const dostartdistribution = (params)=> {
  return request({url:'/ip/dostartdistribution',method:'post',data:params})
}

export const dodisableallocation = (params)=> {
  return request({url:'/ip/dodisableallocation',method:'post',data:params})
}

export const dobatchdel = (params)=> {
  return request({url:'/ip/dobatchdel',method:'post',data:params})
}

export const doupcountry = (params)=> {
  return request({url:'/ip/doupcountry',method:'post',data:params})
}

export const dooutputip = (params)=> {
  return request({url:'/ip/dooutputip',method:'post',data:params})
}
export const doipremark = (params)=> {
  return request({url:'/ip/doipremark',method:'post',data:params})
}
export const getuselist = (params)=> {
  return request({url:'/ip/getuselist',method:'post',data:params})
}






