import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
    return request({
        url: '/sendmsg/getsendmsgtasklist',
        method: 'post',
        data: params
    })
}

// 详情-列表
export const getDetailListApi = (params) => {
    return request({
        url: '/sendmsg/getsendmsginfolist',
        method: 'post',
        data: params
    })
}

// 新建
export const addEditDataApi = (params) => {
    return request({
        url: '/sendmsg/addsendmsgtask',
        method: 'post',
        data: params
    })
}

// 批量关闭
export const batchCloseDataApi = (params) => {
    return request({
        url: '/sendmsg/dobatchclosesendmsgtask',
        method: 'post',
        data: params
    })
}

// 批量删除
export const batchDelDataApi = (params) => {
    return request({
        url: '/sendmsg/dobatchdelsendmsgtask',
        method: 'post',
        data: params
    })
}

// 选择账号
export const getUserListApi = (params) => {
    return request({
        url: '/sendmsg/getsendmsggroup',
        method: 'post',
        data: params
    })
}
