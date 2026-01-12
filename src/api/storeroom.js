import request from '@/utils/request'

export const getaccountinfolist = (params) => {
  return request({ url: '/account/getaccountinfolist', method: 'post', data: params })
}
export const getaccountfilelist = (params) => {
  return request({ url: '/account/getaccountfilelist', method: 'post', data: params })
}
export const getaccountgrouplist = (params) => {
  return request({ url: '/account/getaccountgrouplist', method: 'post', data: params })
}
export const doaccountgroup = (params) => {
  return request({ url: '/account/doaccountgroup', method: 'post', data: params })
}
export const checkaccountfile = (params) => {
  return request({ url: '/account/checkaccountfile', method: 'post', data: params })
}
export const addaccount = (params) => {
  return request({ url: '/account/addaccount', method: 'post', data: params })
}
export const getaccountschedule = (params) => {
  return request({ url: '/account/getaccountschedule', method: 'post', data: params })
}
export const getaccountloglist = (params) => {
  return request({ url: '/account/getaccountloglist', method: 'post', data: params })
}
export const dooutputaccountlog = (params) => {
  return request({ url: '/account/dooutputaccountlog', method: 'post', data: params })
}
export const getwaport = (params) => {
  return request({ url: '/account/getwaport', method: 'post', data: params })
}
export const dobathdelaccountfile = (params) => {
  return request({ url: '/account/dobathdelaccountfile', method: 'post', data: params })
}

export const getdynamicip = (params) => {
  return request({ url: '/ip/getdynamicip', method: 'post', data: params })
}

export const getstaticip = (params) => {
  return request({ url: '/ip/getstaticip', method: 'post', data: params })
}


export const doaccountinfo = (params) => {
  return request({ url: '/account/doaccountinfo', method: 'post', data: params })
}
export const getaccountupinfologlist = (params) => {
  return request({ url: '/account/getaccountupinfologlist', method: 'post', data: params })
}
export const getinheritgrouplist = (params) => {
  return request({ url: '/account/getinheritgrouplist', method: 'post', data: params })
}
export const getinheritaccountlist = (params) => {
  return request({ url: '/account/getinheritaccountlist', method: 'post', data: params })
}
export const doinherit = (params) => {
  return request({ url: '/account/doinherit', method: 'post', data: params })
}
export const sortgroup = (params) => {
  return request({ url: '/account/sortgroup', method: 'post', data: params })
}
// 设置可用状态
export const dousestatus = (params) => {
  return request({ url: '/account/dousestatus', method: 'post', data: params })
}
// 分配/移除席位
export const distributecustomer = (params) => {
  return request({ url: '/account/distributecustomer', method: 'post', data: params })
}

//  批量下线
export const dobatchlogout = (params) => {
  return request({ url: '/account/dobatchlogout', method: 'post', data: params })
}
// 移至其他分组
export const doupgroup = (params) => {
  return request({ url: '/account/doupgroup', method: 'post', data: params })
}
// 释放ip
export const dofreedip = (params) => {
  return request({ url: '/account/dofreedip', method: 'post', data: params })
}
// 批量导出
export const dooutputaccount = (params) => {
  return request({ url: '/account/dooutputaccount', method: 'post', data: params })
}
// 批量删除
export const dobatchdelaccount = (params) => {
  return request({ url: '/account/dobatchdelaccount', method: 'post', data: params })
}
// 编辑备注
export const doupremark = (params) => {
  return request({ url: '/account/doupremark', method: 'post', data: params })
}

// 批量退款
export const dobatchaccountrefundApi = (params) => {
  return request({ url: '/account/dobatchaccountrefund', method: 'post', data: params })
}
// 解绑信用卡
export const unbindcardApi = (params) => {
  return request({ url: '/account/unbindcard', method: 'post', data: params })
}
// 解绑域名
export const unbinddomainApi = (params) => {
  return request({ url: '/account/unbinddomain', method: 'post', data: params })
}

// 绑定信用卡
export const bindcardApi = (params) => {
  return request({ url: '/account/bindcard', method: 'post', data: params })
}

// 批量充值
export const dobatchpayApi = (params) => {
  return request({ url: '/account/dobatchpay', method: 'post', data: params })
}

// 批量检测
export const dobatchaccountdetailApi = (params) => {
  return request({ url: '/account/dobatchaccountdetail', method: 'post', data: params })
}

// IP校正工具
export const doresetip = (params) => {
  return request({ url: '/ip/doresetip', method: 'post', data: params })
}
// 余额校正工具
export const accountbalancecorrectiontoolApi = (params) => {
  return request({ url: '/account/balancecorrectiontool', method: 'post', data: params })
}
// 批量上线
export const dobatchlogin = (params) => {
  return request({ url: '/account/dobatchlogin', method: 'post', data: params })
}

// 批量快速上线
export const dobatchfastlogin = (params) => {
  return request({ url: '/account/dobatchfastlogin', method: 'post', data: params })
}

// 设置可用状态
export const updateaccountavailabilityApi = (params) => {
  return request({ url: '/account/updateaccountavailability', method: 'post', data: params })
}

// 设置不可用状态
export const setaccountunavailableApi = (params) => {
  return request({ url: '/account/setaccountunavailable', method: 'post', data: params })
}


// 分配设备ID
export const setassigndeviceidApi = (params) => {
  return request({ url: '/account/assigndeviceid', method: 'post', data: params })
}
