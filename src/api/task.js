import request from '@/utils/request'

/*** ws群发任务*/
export const getsendmsgtasklist = (params)=> {
  return request({url:'/sendmsg/getsendmsgtasklist',method:'post',data:params})
}
export const addsendmsgtask = (params) =>{
  return request({url:'/sendmsg/addsendmsgtask',method:'post',data:params})
}
export const getsendmsginfolist = (params) =>{
  return request({url:'/sendmsg/getsendmsginfolist',method:'post',data:params})
}
export const getsendmsggroup = (params) =>{
  return request({url:'/sendmsg/getsendmsggroup',method:'post',data:params})
}
export const dobatchstopsendmsgtask = (params) =>{
  return request({url:'/sendmsg/dobatchstopsendmsgtask',method:'post',data:params})
}
export const dobatchclosesendmsgtask = (params) =>{
  return request({url:'/sendmsg/dobatchclosesendmsgtask',method:'post',data:params})
}
export const dobatchdelsendmsgtask = (params) =>{
  return request({url:'/sendmsg/dobatchdelsendmsgtask',method:'post',data:params})
}

export const doouttaskexcel = (params) =>{
  return request({url:'/sendmsg/doouttaskexcel',method:'post',data:params})
}
export const doouttaskrecordexcel = (params) =>{
  return request({url:'/sendmsg/doouttaskrecordexcel',method:'post',data:params})
}

export const getdatasum = (params) =>{
  return request({url:'/sendmsg/getdatasum',method:'post',data:params})
}

//拉群

export const addpullgrouptask = (params) =>{
  return request({url:'/pullgroup/addpullgrouptask',method:'post',data:params})
}
export const getpullgrouptasklist = (params) =>{
  return request({url:'/pullgroup/getpullgrouptasklist',method:'post',data:params})
}
export const getpullgroupinfolist = (params) =>{
  return request({url:'/pullgroup/getpullgroupinfolist',method:'post',data:params})
}
export const getpullgroupgroup = (params) =>{
  return request({url:'/pullgroup/getpullgroupgroup',method:'post',data:params})
}
export const dobatchdelpullgrouptask = (params) =>{
  return request({url:'/pullgroup/dobatchdelpullgrouptask',method:'post',data:params})
}
export const dobatchstoppullgrouptask = (params) =>{
  return request({url:'/pullgroup/dobatchstoppullgrouptask',method:'post',data:params})
}
export const dobatchclosepullgrouptask = (params) =>{
  return request({url:'/pullgroup/dobatchclosepullgrouptask',method:'post',data:params})
}
export const groupsendmsg = (params) =>{
  return request({url:'/pullgroup/groupsendmsg',method:'post',data:params})
}

export const getsysconfig = (params) =>{
  return request({url:'/adminmember/getsysconfig',method:'post',data:params})
}
export const upsysconfig = (params) =>{
  return request({url:'/adminmember/upsysconfig',method:'post',data:params})
}

// 养号
export const getkeeptasklist = (params) =>{
  return request({url:'/keep/getkeeptasklist',method:'post',data:params})
}
export const addkeeptask = (params) =>{
  return request({url:'/keep/addkeeptask',method:'post',data:params})
}
export const getkeepgroup = (params) =>{
  return request({url:'/keep/getkeepgroup',method:'post',data:params})
}
export const dobatchdelkeeptask = (params) =>{
  return request({url:'/keep/dobatchdelkeeptask',method:'post',data:params})
}
export const dobatchclosekeeptask = (params) =>{
  return request({url:'/keep/dobatchclosekeeptask',method:'post',data:params})
}
export const dobatchstopkeeptask = (params) =>{
  return request({url:'/keep/dobatchstopkeeptask',method:'post',data:params})
}
export const getbiggroupgroup = (params) =>{
  return request({url:'/biggroup/getbiggroupgroup',method:'post',data:params})
}
export const addbiggrouptask = (params) =>{
  return request({url:'/biggroup/addbiggrouptask',method:'post',data:params})
}
export const getbiggrouptasklist = (params) =>{
  return request({url:'/biggroup/getbiggrouptasklist',method:'post',data:params})
}
export const dobatchdelbiggrouptask = (params) =>{
  return request({url:'/biggroup/dobatchdelbiggrouptask',method:'post',data:params})
}
export const startbiggrouptask = (params) =>{
  return request({url:'/biggroup/startbiggrouptask',method:'post',data:params})
}
export const getbiggrouppullaccountlist = (params) =>{
  return request({url:'/biggroup/getbiggrouppullaccountlist',method:'post',data:params})
}
export const biggroupsendmsg = (params) =>{
  return request({url:'/biggroup/biggroupsendmsg',method:'post',data:params})
}
export const doupautoad = (params) =>{
  return request({url:'/pullgroup/doupautoad',method:'post',data:params})
}

// 炒群
export const getmarketgrouptasklist = (params) =>{
  return request({url:'/marketgroup/getmarketgrouptasklist',method:'post',data:params})
}
export const addmarketgrouptask = (params) =>{
  return request({url:'/marketgroup/addmarketgrouptask',method:'post',data:params})
}
export const getmarketgroupgroup = (params) =>{
  return request({url:'/marketgroup/getmarketgroupgroup',method:'post',data:params})
}
export const getmarketgroupinfolist = (params) =>{
  return request({url:'/marketgroup/getmarketgroupinfolist',method:'post',data:params})
}
export const doupmarketautoad = (params) =>{
  return request({url:'/marketgroup/doupmarketautoad',method:'post',data:params})
}
export const dobatchdelmarketgrouptask = (params) =>{
  return request({url:'/marketgroup/dobatchdelmarketgrouptask',method:'post',data:params})
}
export const dobatchclosemarketgrouptask = (params) =>{
  return request({url:'/marketgroup/dobatchclosemarketgrouptask',method:'post',data:params})
}
export const sendmessage = (params) =>{
  return request({url:'/marketgroup/sendmessage',method:'post',data:params})
}
export const getmarketgroupgrouptwo = (params) =>{
  return request({url:'/marketgroup/getmarketgroupgrouptwo',method:'post',data:params})
}
export const addmarketgrouptasktwo = (params) =>{
  return request({url:'/marketgroup/addmarketgrouptasktwo',method:'post',data:params})
}
export const getmarketgrouptasktwolist = (params) =>{
  return request({url:'/marketgroup/getmarketgrouptasktwolist',method:'post',data:params})
}
export const getmarketgroupinfotwolist = (params) =>{
  return request({url:'/marketgroup/getmarketgroupinfotwolist',method:'post',data:params})
}
export const dobatchdelmarketgrouptasktwo = (params) =>{
  return request({url:'/marketgroup/dobatchdelmarketgrouptasktwo',method:'post',data:params})
}
export const doupautoadtwo = (params) =>{
  return request({url:'/marketgroup/doupautoadtwo',method:'post',data:params})
}
export const sendmessagetwo = (params) =>{
  return request({url:'/marketgroup/sendmessagetwo',method:'post',data:params})
}
export const dorestarttask = (params) =>{
  return request({url:'/pullgroup/dorestarttask',method:'post',data:params})
}
export const dooutexcel = (params) =>{
  return request({url:'/marketgroup/dooutexcel',method:'post',data:params})
}
export const addmarketgroupinfotwo = (params) =>{
  return request({url:'/marketgroup/addmarketgroupinfotwo',method:'post',data:params})
}
export const gettaskconfiginfo = (params) =>{
  return request({url:'/marketgroup/gettaskconfiginfo',method:'post',data:params})
}
export const dotaskconfiginfo = (params) =>{
  return request({url:'/marketgroup/dotaskconfiginfo',method:'post',data:params})
}
export const dobatchdelmarketgroupinfo = (params) =>{
  return request({url:'/marketgroup/dobatchdelmarketgroupinfo',method:'post',data:params})
}
export const getautoad = (params) =>{
  return request({url:'/biggroup/getautoad',method:'post',data:params})
}
export const upautoad = (params) =>{
  return request({url:'/biggroup/upautoad',method:'post',data:params})
}
export const getbiggroupmember = (params) =>{
  return request({url:'/biggroup/getbiggroupmember',method:'post',data:params})
}



















