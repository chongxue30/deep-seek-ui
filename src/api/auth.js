import axios from 'axios'

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

// response拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 检查响应是否包含code字段
    if (res && typeof res === 'object') {
      // 如果没有code字段或code等于200，视为成功
      if (!('code' in res) || res.code === 200) {
        return res
      } else {
        // 处理错误情况
        console.error('接口返回错误:', res.msg || '未知错误')
        return Promise.reject(new Error(res.msg || '未知错误'))
      }
    }
    return res
  },
  error => {
    console.error('响应错误:', error)
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