import axios from 'axios'
axios.defaults.timeout = 30000;  // 全局设置 30 秒超时
const BASE_URL = '/api'  // 所有请求都通过代理指向本地服务器
const API_KEY = 'Bearer app-Vr06unpxuIl56BHJ6U0eFTc8'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': API_KEY,
    'Content-Type': 'application/json' // 关键：明确指定 JSON
  },
  timeout: 30000
})

export const chatAPI = {
  // 获取应用基本信息
  getInfo: () => {
    return api.get('/info')
  },

  // 发送对话消息
  sendMessage: (data) => {
    return fetch('http://http://10.131.149.41:8080/deepSeek/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
        'Authorization': `Bearer ${token}`},
      body: data
      })
  },

  // 停止响应
  stopResponse: (taskId: string, user: string) => {
    return api.post(`/chat-messages/${taskId}/stop`, { user })
  },

  // 消息反馈（点赞）
  feedback: (messageId: string, data: {
    rating: 'like' | 'dislike' | null,
    user: string,
    content?: string
  }) => {
    return api.post(`/messages/${messageId}/feedbacks`, data)
  },

  // 获取下一轮建议问题列表
  getSuggestedQuestions: (messageId: string, user: string) => {
    return api.get(`/messages/${messageId}/suggested`, { params: { user } })
  },

  // 获取会话历史消息
  getMessages: (params: {
    conversation_id?: string,
    user: string,
    first_id?: string,
    limit?: number
  }) => {
    return api.get('/messages', { params })
  },

  // 获取历史对话列表
  getConversations: (params: {
    user: string,
    last_id?: string,
    limit?: number,
    sort_by?: string
  }) => {
    return api.get('/conversations', { params })
  },

  // 删除会话
  deleteConversation: (data:{
    conversation_id: string,
    user: string,
  }) => {
    return api.post('/deleteConversation', {data})
  },

  // 会话重命名
  renameConversation: ( params) => {
    return api.post('/renameConversation', {params})
  },

  // 上传文件
  uploadFile: (file: File, user: string) => {
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
  audioToText: (file: File, user: string) => {
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
  textToAudio: (data: {
    message_id?: string,
    text?: string,
    user: string
  }) => {
    return api.post('/text-to-audio', data, {
      responseType: 'blob',
      headers: {
        'Accept': 'audio/wav'
      }
    })
  }
}
