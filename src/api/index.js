import axios from 'axios'

axios.defaults.timeout = 30000;  // 全局设置 30 秒超时
const BASE_URL = '/dev-api'  // 所有请求都通过代理指向本地服务器

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json' // 关键：明确指定 JSON
  },
  timeout: 30000
})

// 添加请求拦截器，动态获取token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const chatAPI = {
  // 获取应用基本信息
  getInfo: () => {
    return api.get('/info')
  },

  // 发送对话消息
  // 发送流式消息请求 - 直接返回原始响应对象
  sendStreamMessage: async (params) => {
    const token = localStorage.getItem('token') || '';

    // 使用原生 fetch API 而不是 axios
    return await fetch('/dev-api/deepSeek/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(params)
    });
  },

  // 停止响应
  stopResponse: (taskId, user) => {
    return api.post(`/chat-messages/${taskId}/stop`, { user })
  },

  // 消息反馈（点赞）
  feedback: (messageId, data) => {
    return api.post(`/messages/${messageId}/feedbacks`, data)
  },

  // 获取下一轮建议问题列表
  getSuggestedQuestions: (messageId, user) => {
    return api.get(`/messages/${messageId}/suggested`, { params: { user } })
  },

  // 获取会话历史消息
  getMessages: (params) => {
    return api.get('/messages', { params })
  },

  // 获取历史对话列表
  getConversations: (params) => {
    return api.post('/deepSeek/getConversations', params)
  },

  // 删除会话
  deleteConversation: (data) => {
    return api.post('/deleteConversation', {data})
  },

  // 会话重命名
  renameConversation: ( params) => {
    return api.post('/renameConversation', {params})
  },

  // 上传文件
  uploadFile: (file, user) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user', user)
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 语音转文字
  audioToText: (file, user) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user', user)
    return api.post('/audio-to-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 文字转语音
  textToAudio: (data) => {
    return api.post('/text-to-audio', data, {
      responseType: 'blob',
      headers: {
        'Accept': 'audio/wav'
      }
    })
  }
}
