import axios from 'axios'
import service from './auth' // 导入auth.js中的service实例

// 使用统一的service实例进行API调用
const api = service

export const chatAPI = {
  // 发送对话消息
  sendMessage: (data) => {
    // 检查并删除query末尾的换行符
    if (data.query && data.query.endsWith('\n')) {
      data.query = data.query.slice(0, -1);
    }
    return api.post('/deepSeek/sendMessage', data)
  },

  // 获取会话列表
  getConversations: (data) => {
    return api.post('/deepSeek/getConversations', data)
  },

  // 获取会话历史消息
  getMessages: (data) => {
    return api.post('/deepSeek/getMessages', data)
  },

  // 会话重命名
  renameConversation: (data) => {
    return api.post('/deepSeek/renameConversation', data)
  },

  // 删除会话
  deleteConversation: (data) => {
    return api.post('/deepSeek/deleteConversation', data)
  },

  // 知识库相关API
  dataset: {
    // 获取知识库列表
    list: (params = { page: 1, limit: 10 }) => {
      return api.get('/dataset/list', { params })
    },
    
    // 创建知识库
    create: (data) => {
      return api.post('/dataset/create', data)
    },
    
    // 删除知识库
    delete: (datasetId) => {
      return api.delete(`/dataset/delete/${datasetId}`)
    },

    // 获取知识库状态
    status: (data) => {
      return api.post('/dataset/status', data)
    }
  },

  // 文档相关API
  document: {
    // 通过text创建文档
    create: (data) => {
      return api.post('/document/create', data)
    },

    // 获取知识库中文档列表
    list: (data, params) => {
      return api.post('/document/list', data, { params })
    },

    // 删除知识库中文档
    delete: (data) => {
      return api.post('/document/delete', data)
    },

    // 通过text更新文档text或name
    update: (data) => {
      return api.post('/document/update', data)
    }
  },

  // 文档分段相关API
  segment: {
    // 新建分段
    create: (data) => {
      return api.post('/segment/create', data)
    },

    // 获取分段列表
    list: (data, params) => {
      return api.get('/segment/list', { params, data })
    },

    // 删除分段
    delete: (data) => {
      return api.post('/segment/delete', data)
    }
  }
}