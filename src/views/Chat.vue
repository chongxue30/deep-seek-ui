<template>
  <el-container class="chat-container" :class="{ 'dark-theme': isDarkMode }">
    <!-- 左侧边栏 -->
    <el-aside width="260px">
      <div class="sidebar">
        <!-- 用户信息 -->
        <div class="user-info">
          <div class="avatar">
            <img v-if="userInfo && userInfo.avatar" :src="userInfo.avatar" alt="用户头像" />
            <el-icon v-else><UserFilled /></el-icon>
          </div>
          <div class="user-details">
            <div class="nickname">{{ userInfo ? userInfo.nickName || userInfo.userName : '用户' }}</div>
          </div>
        </div>
        
        <div class="new-chat">
          <el-button type="primary" @click="createNewChat" :icon="Plus">
            新对话
          </el-button>
          <el-button @click="toggleDarkMode" :icon="isDarkMode ? Sunny : Moon" class="theme-toggle">
            {{ isDarkMode ? '浅色模式' : '暗黑模式' }}
          </el-button>
        </div>

        <!-- 历史对话列表 -->
        <div class="chat-history">
          <div v-for="chat in conversations" 
               :key="chat.id" 
               :class="['chat-item', { active: currentConversation?.id === chat.id }]"
               @click="selectChat(chat)">
            <el-tooltip :content="chat.title" placement="right">
              <span class="chat-title">
                <el-icon><ChatRound /></el-icon>
                {{ chat.name || '新对话' }}
                <span class="chat-time">{{ formatDate(chat.updated_at) }}</span>
              </span>
            </el-tooltip>
            <el-button 
              type="danger" 
              link
              :icon="Delete"
              @click.stop="deleteConversation(chat.id)"
            />
          </div>
        </div>

        <!-- 知识库管理 -->
        <div class="knowledge-base">
          <el-button @click="showKnowledgeModal = true" :icon="FolderAdd">
            知识库管理
          </el-button>
        </div>

        <!-- 退出登录 -->
        <div class="logout">
          <el-button @click="handleLogout" type="danger" plain>
            退出登录
          </el-button>
        </div>
      </div>
    </el-aside>

    <!-- 主聊天区域 -->
    <el-main>
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="message in messages" 
             :key="message.id" 
             :class="['message', message.role]">
          <!-- 用户消息 -->
          <div v-if="message.role === 'user'" class="user-message">
            {{ message.content }}
            <!-- 上传的文件列表 -->
            <div v-if="message.files?.length" class="file-list">
              <div v-for="file in message.files" :key="file.id" class="file-item">
                <el-icon><Document /></el-icon>
                {{ file.name }}
              </div>
            </div>
          </div>
          
          <!-- AI响应 -->
          <div v-else class="ai-message">
            <!-- 思考过程 -->
            <div v-if="message.thinking" v-html="message.thinking"></div>
            
            <div class="message-content" v-html="message.content"></div>
            
            <!-- 音频播放器 -->
            <AudioPlayer 
              v-if="message.audioData"
              :audio-data="message.audioData"
            />

            <!-- 消息操作 -->
            <div class="message-actions">
              <el-button-group>
                <el-button 
                  v-if="message.id === currentMessageId && isLoading" 
                  type="danger" 
                  size="small"
                  @click="stopResponse"
                >
                  停止响应
                </el-button>
                <el-button
                  size="small"
                  @click="playMessageAudio(message)"
                >
                  <el-icon><Headset /></el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
          <div class="message-time">{{ formatTime(message.created_at) }}</div>
        </div>

        <!-- 建议问题列表 -->
        <div class="suggested-questions" v-if="suggestedQuestions.length">
          <p class="suggestions-title">你可能想问:</p>
          <div class="suggestions-list">
            <el-button 
              v-for="question in suggestedQuestions" 
              :key="question"
              size="small"
              @click="handleSuggestedQuestion(question)"
            >
              {{ question }}
            </el-button>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="输入消息..."
          @keyup.enter.ctrl="sendMessage"
        />
        <div class="input-actions">
          <!-- 文件上传按钮 -->
          <el-upload
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileUpload"
          >
            <el-button :icon="Upload">
              上传文件
            </el-button>
          </el-upload>
          
          <!-- 语音输入按钮 -->
          <el-button 
            :icon="Microphone" 
            :class="{ 'recording-btn': isRecording }"
            @click="toggleRecording"
          >
            {{ isRecording ? '结束录音' : '语音输入' }}
          </el-button>
          
          <!-- 已上传文件列表 -->
          <div v-if="uploadedFiles.length > 0" class="uploaded-files">
            <div class="file-count">已上传 {{ uploadedFiles.length }} 个文件</div>
            <el-button size="small" type="danger" @click="uploadedFiles = []">清空</el-button>
          </div>
          
          <el-button type="primary" @click="sendMessage" :loading="isLoading">
            发送
          </el-button>
          
          <!-- 停止生成按钮 -->
          <el-button 
            v-if="currentTaskId" 
            type="warning" 
            @click="stopGeneration"
          >
            停止生成
          </el-button>
        </div>
      </div>
    </el-main>

    <!-- 知识库管理弹窗 -->
    <el-dialog
      v-model="showKnowledgeModal"
      title="知识库管理"
      width="50%"
    >
      <div class="knowledge-list">
        <div v-for="kb in knowledgeBases" 
             :key="kb.id" 
             class="knowledge-item">
          <span>{{ kb.name }}</span>
          <el-upload
            :auto-upload="false"
            :on-change="(file) => handleFileChange(file, kb.id)"
          >
            <el-button type="primary" :icon="Upload">Upload</el-button>
          </el-upload>
        </div>
      </div>
      <template #footer>
        <el-button @click="createKnowledgeBase" :icon="Plus">
          创建知识库
        </el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, onMounted, nextTick, inject } from 'vue'
import { 
  Plus, Delete, Upload, ChatRound, FolderAdd,
  CopyDocument, Headset, Microphone, Document, Close,
  Moon, Sunny, UserFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import 'element-plus/dist/index.css'
import '../styles/thinking-process.scss'
import { chatAPI } from '@/api/index'
import AudioPlayer from '@/components/AudioPlayer.vue'
import VoiceRecorder from '@/components/VoiceRecorder.vue'

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    return ''
  }
})

const conversations = ref([])
const currentConversation = ref(null)
const messages = ref([])
const inputMessage = ref('')
const selectedKnowledge = ref('')
const knowledgeBases = ref([])
const showKnowledgeModal = ref(false)
const isLoading = ref(false)
const messagesContainer = ref(null)
const user = ref('abc-123') // 这里应该是登录用户的ID
const suggestedQuestions = ref([])
const isRecording = ref(false)
const isDarkMode = inject('isDarkMode')
const toggleDarkMode = inject('toggleDarkMode')
const currentTaskId = ref(null)
const audioContext = ref(null)
const mediaRecorder = ref(null)
const audioChunks = ref([])
const uploadedFiles = ref([])
const currentMessageId = ref(null)
const messageList = ref([])
const userInfo = ref(null) // 用户信息

const uploadHeaders = {
  'Authorization': 'Bearer YOUR_API_KEY'
}

const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

const renderMessage = (content) => {
  if (!content) return '';
  
  // 检查是否是思考过程消息
  if (typeof content === 'object' && content.event === 'agent_thought') {
    return `
      <details style="color:gray;background-color: ${isDarkMode.value ? '#2a2a2a' : '#f8f8f8'};padding: 8px;border-radius: 4px;" open>
        <summary>Thinking...</summary>
        ${md.render(content.thought || '')}
        ${content.observation ? `<p><strong>观察：</strong>${md.render(content.observation)}</p>` : ''}
        ${content.tool ? `<p><strong>工具：</strong>${content.tool}</p>` : ''}
      </details>
    `
  }
  
  // 检查是否是消息内容
  if (typeof content === 'object' && content.event === 'agent_message') {
    return `<div class="answer">${md.render(content.answer || '')}</div>`
  }
  
  // 如果是普通文本 - 处理思考过程和正式回答的分离
  if (typeof content === 'string') {
    // 检查是否包含思考过程（<details>标签）
    if (content.includes('<details') && content.includes('</details>')) {
      // 提取思考过程和正式回答
      const detailsEndIndex = content.lastIndexOf('</details>') + 10;
      const thinkingProcess = content.substring(0, detailsEndIndex);
      const formalAnswer = content.substring(detailsEndIndex);
      
      // 返回格式化后的内容
      return `${thinkingProcess}\n${md.render(formalAnswer)}`;
    }
    return md.render(content);
  }
  
  return ''
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const createNewChat = () => {
  currentConversation.value = null
  messages.value = []
}

const selectChat = async (chat) => {
  currentConversation.value = chat
  messages.value = [] // 清空当前消息
  try {
    const response = await chatAPI.getMessages({
      user: user.value,
      conversation_id: chat.id
    })
    // 转换消息格式
    messages.value = response.data.data.map(msg => ({
      id: msg.id,
      role: msg.answer ? 'assistant' : 'user',
      content: msg.answer || msg.query,
      created_at: msg.created_at
    }))
    scrollToBottom()
  } catch (error) {
    console.error('加载对话记录失败:', error)
    ElMessage.error('加载对话记录失败')
  }
}

const deleteConversation = async (conversationId) => {
  try {
    await ElMessageBox.confirm('确定要删除这个会话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const res = await chatAPI.deleteConversation({
      user: userInfo.value?.userName || 'guest',
      conversationId: conversationId
    })
    
    if (res.code === 200) {
      ElMessage.success('删除成功')
      if (currentConversation.value?.id === conversationId) {
        createNewChat()
      }
      getConversations()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除会话失败:', error)
      ElMessage.error('删除会话失败')
    }
  }
}

const getConversations = async () => {
  try {
    const response = await chatAPI.getConversations({
      user: userInfo.value?.userName || 'guest',
      limit: 20
    })
    if (response.code === 200) {
      conversations.value = response.data || []
      
      if (conversations.value.length > 0 && !currentConversation.value) {
        const latestChat = conversations.value[0]
        currentConversation.value = latestChat
        getMessages(latestChat.id)
      }
    }
  } catch (error) {
    console.error('获取会话列表失败:', error)
    ElMessage.error('获取会话列表失败')
  }
}

const getMessages = async (conversationId) => {
  if (!conversationId) return
  
  try {
    const response = await chatAPI.getMessages({
      user: userInfo.value?.userName || 'guest',
      conversationId: conversationId
    })
    if (response.code === 200) {
      messages.value = response.data || []
      scrollToBottom()
    }
  } catch (error) {
    console.error('获取会话消息失败:', error)
    ElMessage.error('获取会话消息失败')
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() && uploadedFiles.value.length === 0) return
  
  isLoading.value = true
  currentMessageId.value = generateId()
  
  const newMessage = {
    id: currentMessageId.value,
    content: inputMessage.value,
    role: 'user',
    files: uploadedFiles.value.length > 0 ? uploadedFiles.value : undefined,
    created_at: new Date().toISOString()
  }
  messages.value.push(newMessage)

  const aiMessage = {
    id: generateId(),
    content: '',
    role: 'assistant',
    thinking: '',
    created_at: new Date().toISOString()
  }
  messages.value.push(aiMessage)
  
  // 清空输入框和上传文件列表
  const currentInput = inputMessage.value
  inputMessage.value = ''
  const currentFiles = [...uploadedFiles.value]
  uploadedFiles.value = []
  
  // 滚动到底部
  await scrollToBottom()
  
  try {
    // 发送消息到后端
    const res = await chatAPI.sendMessage({
      user: userInfo.value?.userName || 'guest',
      query: currentInput,
      responseMode: 'streaming',
      conversationId: currentConversation.value?.id || ''
    })
    
    if (res.code === 200) {
      // 更新AI回复
      const lastMessage = messages.value[messages.value.length - 1]
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content = res.data.answer || ''
        if (res.data.conversation_id && !currentConversation.value) {
          currentConversation.value = { id: res.data.conversation_id }
          getConversations()
        }
      }
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送消息失败')
    // 移除AI消息
    messages.value = messages.value.filter(msg => msg.id !== aiMessage.id)
  } finally {
    isLoading.value = false
    currentMessageId.value = null
    scrollToBottom()
  }
}

// 停止响应
const stopResponse = () => {
  // 实现停止响应的逻辑
  isLoading.value = false
  currentMessageId.value = null
}

// 停止生成
const stopGeneration = () => {
  currentTaskId.value = null
  isLoading.value = false
}

// 处理建议问题
const handleSuggestedQuestion = (question) => {
  inputMessage.value = question
  sendMessage()
}

// 处理文件上传
const handleFileUpload = (file) => {
  uploadedFiles.value.push({
    id: Date.now().toString(),
    name: file.name,
    file: file.raw
  })
}

// 创建知识库
const createKnowledgeBase = async () => {
  try {
    const name = await ElMessageBox.prompt('请输入知识库名称', '创建知识库', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    
    if (name.value) {
      const res = await chatAPI.dataset.create({
        name: name.value,
        description: '',
        indexing_technique: 'economy',
        permission: 'all_team_members'
      })
      
      if (res.code === 200) {
        ElMessage.success('创建成功')
        getKnowledgeBases()
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('创建知识库失败:', error)
      ElMessage.error('创建知识库失败')
    }
  }
}

// 获取知识库列表
const getKnowledgeBases = async () => {
  try {
    const res = await chatAPI.dataset.list()
    if (res.code === 200) {
      knowledgeBases.value = res.data || []
    }
  } catch (error) {
    console.error('获取知识库列表失败:', error)
  }
}

// 处理知识库文件上传
const handleFileChange = async (file, datasetId) => {
  try {
    const formData = new FormData()
    formData.append('file', file.raw)
    formData.append('datasetId', datasetId)
    
    // 上传文件到知识库
    // 这里需要实现文件上传到知识库的逻辑
    ElMessage.success('文件上传成功')
  } catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('文件上传失败')
  }
}

// 播放消息音频
const playMessageAudio = (message) => {
  // 实现播放音频的逻辑
  console.log('播放音频:', message)
}

// 切换录音状态
const toggleRecording = () => {
  isRecording.value = !isRecording.value
  // 实现录音功能的逻辑
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

// 组件挂载时执行
onMounted(async () => {
  // 获取用户信息
  await getUserInfo()
  
  // 获取会话列表
  await getConversations()
  
  // 获取知识库列表
  await getKnowledgeBases()
})
</script>

<style scoped lang="scss">
.chat-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1e293b;
  color: #f8fafc;
  
  .user-info {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #334155;
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .user-details {
      .nickname {
        font-weight: 500;
        font-size: 16px;
      }
    }
  }
  
  .new-chat {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    
    .chat-item {
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      &:hover {
        background: #334155;
      }
      
      &.active {
        background: #3b82f6;
      }
      
      .chat-title {
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 180px;
        
        .chat-time {
          font-size: 12px;
          opacity: 0.7;
        }
      }
    }
  }
  
  .knowledge-base, .logout {
    padding: 16px;
    border-top: 1px solid #334155;
  }
}

.el-main {
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
  .message {
    margin-bottom: 24px;
    position: relative;
    
    &.user {
      display: flex;
      justify-content: flex-end;
      
      .user-message {
        background: #3b82f6;
        color: white;
        border-radius: 12px 12px 0 12px;
        padding: 12px 16px;
        max-width: 80%;
        word-break: break-word;
      }
    }
    
    &.assistant {
      .ai-message {
        background: #f1f5f9;
        border-radius: 12px 12px 12px 0;
        padding: 12px 16px;
        max-width: 80%;
        word-break: break-word;
        
        .message-content {
          margin-top: 8px;
        }
        
        .message-actions {
          margin-top: 8px;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
    
    .message-time {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 4px;
    }
    
    .file-list {
      margin-top: 8px;
      
      .file-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
      }
    }
  }
  
  .suggested-questions {
    margin-top: 16px;
    
    .suggestions-title {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 8px;
    }
    
    .suggestions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #e2e8f0;
  
  .input-actions {
    display: flex;
    align-items: center;
    margin-top: 12px;
    gap: 8px;
    
    .uploaded-files {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      
      .file-count {
        font-size: 14px;
        color: #64748b;
      }
    }
  }
}

.knowledge-list {
  .knowledge-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid #e2e8f0;
  }
}

.recording-btn {
  background-color: #ef4444 !important;
  color: white !important;
}
.dark-theme {
  .sidebar {
    background-color: #0f172a;
    color: #f8fafc;
    
    .chat-item {
      &:hover {
        background: #1e293b;
      }
    }
  }
  
  .el-main {
    background-color: #1e293b;
    color: #f8fafc;
  }
  
  .chat-messages {
    .message {
      &.assistant {
        .ai-message {
          background: #334155;
          color: #f8fafc;
        }
      }
      
      .message-time {
        color: #94a3b8;
      }
    }
  }
  
  .chat-input {
    border-top-color: #334155;
    
    .el-textarea__inner {
      background-color: #334155;
      color: #f8fafc;
      border-color: #475569;
    }
  }
}
</style>