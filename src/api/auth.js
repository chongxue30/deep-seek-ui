import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus' // 如果使用Element Plus
import router from '@/router'
import { handleTokenExpired } from '@/utils/tokenHandler'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // 使用环境变量中定义的基础路径
    timeout: 10000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
    config => {
        // 如果存在token，则每个请求都携带token
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
    },
    error => {
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

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


// response拦截器
service.interceptors.response.use(
    response => {
        console.log('===进入响应拦截器===')
        const res = response.data
        console.log('响应数据:', res)
        // 检查响应是否包含code字段
        if (res && typeof res === 'object') {
            console.log('⚠️ 检测到错误码:', res.code)
            // 如果没有code字段或code等于200，视为成功
            if (!('code' in res) || res.code === 200) {
                return res
            } else if (res.code === 401) {
                console.log('🔴 检测到401状态码')
                // 删除测试用的alert
                return handleTokenExpired()
            } else {
                // 处理其他错误情况
                ElMessage({
                    message: res.msg || '未知错误',
                    type: 'error',
                    duration: 5000
                })
                return Promise.reject(new Error(res.msg || '未知错误'))
            }
        }
        return res
    },
    error => {
        console.error('响应错误:', error)

        // 处理响应错误
        if (error.response) {
            const { status } = error.response

            // 401 - 未授权，token过期
            console.log('⚠️ 检测到:', status)
            if (status === 401) {
                return handleTokenExpired() // 直接返回，不要再Promise.reject
            }

            // 其他错误显示提示
            ElMessage({
                message: error.response.data?.msg || '请求失败',
                type: 'error',
                duration: 5000
            })
        } else {
            ElMessage({
                message: '网络连接异常',
                type: 'error',
                duration: 5000
            })
        }

        return Promise.reject(error)
    }
)

export const authAPI = {
    // 获取验证码
    getCaptcha: () => {
        // 确保使用环境变量中定义的基础API路径
        // 在Vue3项目中，确保请求路径正确，无论是本地还是远程访问
        const url = '/captchaImage'
        console.log('验证码请求URL:', process.env.VUE_APP_BASE_API + url)
        return service.get(url)
    },

    //修改密码
    updatePassword: (data) => {
        return service.put('/system/user/profile/updatePwd', data, {
            headers: {
                'Content-Type': 'application/json'  // 确保发送的是 JSON 数据
            }
        });
    },

    // 登录方法
    login: (username, password, code, uuid) => {
        return service.post('/login', {
            username,
            password,
            code,
            uuid
        })
    },

    // 获取用户信息
    getInfo: () => {
        return service.get('/getInfo')
    },

    // 退出登录
    logout: () => {
        return service.post('/logout')
    }
}

// 导出service实例，供其他API模块使用
export default service
