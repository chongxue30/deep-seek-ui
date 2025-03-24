import axios from 'axios'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API || '', // url基础地址
    timeout: 30000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 可以在这里添加token等认证信息
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        return res
    },
    error => {
        console.log('请求错误: ' + error)
        return Promise.reject(error)
    }
)

export default service
