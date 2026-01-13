import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
    return request({
        url: '/reportlog/getreportloglist',
        method: 'post',
        data: params
    })
}

// 列表
export const delDataApi = (params) => {
    return request({
        url: '/reportlog/delreportlog',
        method: 'post',
        data: params
    })
}

