import axios from 'axios'
axios.defaults.timeout = 30000;  // 全局设置 30 秒超时
const BASE_URL = '/api'  // 所有请求都通过代理指向本地服务器
const API_KEY = 'Bearer app-Vr06unpxuIl56BHJ6U0eFTc8'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': API_KEY
  },
  timeout: 30000
})

export const chatAPI = {
  // 获取应用基本信息
  getInfo: () => {
    return api.get('/info')
  },

  // 发送对话消息并处理流式响应
  sendMessage: async (data) => {
    // 检查并删除query末尾的换行符
    const query = data.query.endsWith('\n') ? data.query.slice(0, -1) : data.query;
    
    const response = await fetch(`${BASE_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY
      },
      body: JSON.stringify({
        query: query,
        conversationId: data.conversationId,
        user: data.user,
        responseMode: 'streaming',
        files: data.files || [],
        inputs: data.inputs || {}
      })
    })
    return response
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
  deleteConversation: (conversationId: string, user: string) => {
    return api.delete(`/conversations/${conversationId}`, {
      data: { user }
    })
  },

  // 会话重命名
  renameConversation: (conversationId: string, data: {
    name?: string,
    auto_generate?: boolean,
    user: string
  }) => {
    return api.post(`/conversations/${conversationId}/name`, data)
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