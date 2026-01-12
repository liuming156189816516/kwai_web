import request from '@/utils/request'

/*** 内容管理*/
export const getmaterialgrouplist = (params)=> {
  return request({url:'/material/getmaterialgrouplist',method:'post',data:params})
}
export const domaterialgroup = (params) =>{
  return request({url:'/material/domaterialgroup',method:'post',data:params})
}
export const getmateriallist = (params)=> {
  return request({url:'/material/getmateriallist',method:'post',data:params})
}
export const domaterial = (params)=> {
  return request({url:'/material/domaterial',method:'post',data:params})
}
export const materialFile = (params)=> {
  return request({url:'/material/upload',method:'post',data:params})
}
export const domovegroup = (params)=> {
  return request({url:'/material/domovegroup',method:'post',data:params})
}
export const domoveoutgroup = (params)=> {
  return request({url:'/material/domoveoutgroup',method:'post',data:params})
}

/* 话术 */
export const getspeechgrouplist = (params)=> {
  return request({url:'/speech/getspeechgrouplist',method:'post',data:params})
}
export const dospeechgroup = (params)=> {
  return request({url:'/speech/dospeechgroup',method:'post',data:params})
}

export const getspeechlist = (params)=> {
  return request({url:'/speech/getspeechlist',method:'post',data:params})
}
export const dospeech = (params)=> {
  return request({url:'/speech/dospeech',method:'post',data:params})
}
export const domovereplygroup = (params)=> {
  return request({url:'/speech/domoveoutgroup',method:'post',data:params})
}
export const getspeechinfo = (params)=> {
  return request({url:'/speech/getspeechinfo',method:'post',data:params})
}

// 自定义话术
export const getmyspeechgrouplist = (params)=> {
  return request({url:'/myspeech/getmyspeechgrouplist',method:'post',data:params})
}
export const domyspeechgroup = (params)=> {
  return request({url:'/myspeech/domyspeechgroup',method:'post',data:params})
}
export const getmyspeechlist = (params)=> {
  return request({url:'/myspeech/getmyspeechlist',method:'post',data:params})
}
export const domyspeech = (params)=> {
  return request({url:'/myspeech/domyspeech',method:'post',data:params})
}


