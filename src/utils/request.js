import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus' // 如果您使用Element Plus
import router from '@/router'
import { handleTokenExpired } from '@/utils/tokenHandler'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API || '', // url基础地址
    timeout: 30000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 从localStorage获取token并添加到请求头
        const token = localStorage.getItem('token')
        if (token) {
            // 根据RuoYi的配置，token在请求头中使用'Authorization'字段
            config.headers['Authorization'] = 'Bearer ' + token
        }
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
        console.log('===进入响应拦截器===')
        const res = response.data
        console.log('响应数据:', res)

        // 检查接口返回的状态码
        if (res.code && res.code !== 200) {
            console.log('⚠️ 检测到错误码:', res.code)
            // 处理token过期情况 (401)
            if (res.code === 401) {
                console.log('🔴 检测到401状态码')
                // 删除测试用的alert
                return handleTokenExpired()
            }

            // 其他错误情况显示错误信息
            ElMessage({
                message: res.msg || '系统错误',
                type: 'error',
                duration: 5000
            })

            return Promise.reject(res.msg || '系统错误')
        }

        return res
    },
    error => {
        console.log('===进入错误拦截器===')
        console.log('错误对象:', error)
        console.log('请求错误: ' + error)

        // 处理HTTP错误状态码
        if (error.response) {
            const { status } = error.response

            // 401 - 未授权，token过期
            if (status === 401) {
                handleTokenExpired()
                return Promise.reject('登录状态已过期')
            }

            // 403 - 禁止访问
            if (status === 403) {
                ElMessage({
                    message: '没有权限访问该资源',
                    type: 'error',
                    duration: 5000
                })
            }

            // 500 - 服务器错误
            if (status === 500) {
                ElMessage({
                    message: '服务器错误，请联系管理员',
                    type: 'error',
                    duration: 5000
                })
            }
        } else {
            // 网络错误
            ElMessage({
                message: '网络连接异常',
                type: 'error',
                duration: 5000
            })
        }

        return Promise.reject(error)
    }
)

// // 处理token过期
// // 处理token过期
// function handleTokenExpired() {
//     // 避免重复弹窗
//     if (localStorage.getItem('isShowingTokenExpired') === 'true') {
//         return Promise.reject('登录状态已过期')
//     }
//
//     localStorage.setItem('isShowingTokenExpired', 'true')
//
//     // 返回 ElMessageBox 的 Promise
//     return ElMessageBox.confirm(
//         '<div class="expired-dialog">' +
//         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="expired-icon">' +
//         '<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>' +
//         '</svg>' +
//         '<div class="expired-title">登录状态已过期</div>' +
//         '<div class="expired-content">您的登录状态已失效，请重新登录后继续操作</div>' +
//         '</div>',
//         '',
//         {
//             dangerouslyUseHTMLString: true,
//             confirmButtonText: '重新登录',
//             cancelButtonText: '取消',
//             customClass: 'custom-expired-dialog',
//             showClose: false
//         }
//     )
//         .then(() => {
//             // 清除登录信息
//             localStorage.removeItem('token')
//             localStorage.removeItem('userInfo')
//
//             // 跳转到登录页
//             router.push('/login')
//             return Promise.reject('登录状态已过期')
//         })
//         .catch(err => {
//             // 如果是点击取消按钮
//             if (err === 'cancel') {
//                 console.log('用户取消操作')
//             }
//             return Promise.reject('登录状态已过期')
//         })
//         .finally(() => {
//             localStorage.removeItem('isShowingTokenExpired')
//         })
// }


export default service
