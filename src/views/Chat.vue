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
        <ChatHistory 
          :current-conversation-id="currentConversation?.id" 
          :user-info="userInfo"
          :conversations="conversations"
          @select-chat="handleSelectChat" 
          @delete-conversation="deleteConversation"
        />

        <!-- 知识库管理 -->
        <KnowledgeBase 
          :user-info="userInfo"
          @create-knowledge-base="handleCreateKnowledgeBase"
          @file-change="handleFileChange"
        />

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
            <div v-if="message.thinking" class="thinking-process">
              <el-collapse>
                <el-collapse-item>
                  <template #title>
                    <el-icon><Loading /></el-icon>
                    AI 思考过程
                  </template>
                  <div class="thinking-content" v-html="formatMarkdown(message.thinking)"></div>
                </el-collapse-item>
              </el-collapse>
            </div>
            
            <!-- AI 回答 -->
            <div class="message-content" v-html="formatMarkdown(message.content)"></div>
            
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
          @keyup.enter="sendMessage"
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


  </el-container>
</template>

<script setup>
import { ref, onMounted, nextTick, inject } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Delete, Upload, ChatRound, FolderAdd,
  CopyDocument, Headset, Microphone, Document, Close,
  Moon, Sunny, UserFilled, Loading
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import 'element-plus/dist/index.css'
import '../styles/thinking-process.scss'
import { chatAPI } from '@/api/index'
import { authAPI } from '@/api/auth'
import AudioPlayer from '@/components/AudioPlayer.vue'
import VoiceRecorder from '@/components/VoiceRecorder.vue'
import ChatHistory from '@/components/ChatHistory.vue'
import KnowledgeBase from '@/components/KnowledgeBase.vue'
import { reactive } from 'vue'

const router = useRouter()

// 初始化 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // 使用默认的转义
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
// 用户ID将从userInfo中获取
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

const formatMarkdown = (text) => {
  if (!text) return '';
  return md.render(text);
}

const scrollToBottom = async () => {
  console.log('Before scroll:', messagesContainer.value.scrollTop, messagesContainer.value.scrollHeight);
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    console.log('After scroll:', messagesContainer.value.scrollTop);
  }
}

const createNewChat = () => {
  currentConversation.value = null
  messages.value = []
}

const handleSelectChat = async (chat) => {
  currentConversation.value = chat
  await getMessages(chat.id)
}

const getMessages = async (conversationId) => {
  if (!conversationId) return
  
  try {
    const res = await chatAPI.getMessages({
      user: userInfo.value.userName,
      conversationId: conversationId
    })
    
    if (res.data) {
      // 将每条记录拆分成用户提问和 AI 回复两条消息
      messages.value = res.data.flatMap(msg => {
        const messageArray = []
        
        // 添加用户提问
        if (msg.query) {
          messageArray.push({
            id: msg.id + '_user',
            content: msg.query,
            role: 'user',
            created_at: msg.created_at,
            files: msg.message_files || []
          })
        }
        
        // 处理 AI 回复
        let thinking = ''
        let answer = ''
        
        if (msg.agent_thoughts && msg.agent_thoughts.length > 0) {
          // 第一个 thought 通常是思考过程
          thinking = msg.agent_thoughts[0].thought
          
          // 最后一个 thought 通常是最终答案
          const lastThought = msg.agent_thoughts[msg.agent_thoughts.length - 1]
          if (lastThought.tool_input && lastThought.tool_input.includes('Final Answer')) {
            try {
              const toolInput = JSON.parse(lastThought.tool_input)
              answer = toolInput['Final Answer']
            } catch (e) {
              answer = lastThought.thought
            }
          } else {
            answer = lastThought.thought
          }
        }
        
        // 如果没有从 agent_thoughts 中获取到答案，则使用 answer 字段
        if (!answer && msg.answer) {
          answer = msg.answer
        }
        
        // 添加 AI 回复
        if (thinking || answer) {
          messageArray.push({
            id: msg.id + '_assistant',
            content: answer,
            role: 'assistant',
            created_at: msg.created_at,
            thinking: thinking,
            files: msg.message_files || []
          })
        }
        
        return messageArray
      })
      
      scrollToBottom()
    }
  } catch (error) {
    console.error('获取会话消息失败:', error)
    ElMessage.error('获取会话消息失败')
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
      user: userInfo.value.userName,
      conversationId: conversationId
    })
    
    if (res.code === 200) {
      ElMessage.success('删除成功')
      if (currentConversation.value?.id === conversationId) {
        createNewChat()
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除会话失败:', error)
      ElMessage.error('删除会话失败')
    }
  }
}

// 解码 Unicode 字符串
const decodeUnicode = (str) => {
  try {
    return decodeURIComponent(JSON.parse('"' + str.replace(/\"/g, '\\"') + '"'))
  } catch (e) {
    console.warn('Unicode 解码失败:', e)
    return str
  }
}

// 获取会话列表
const getConversations = async () => {
  try {
    const res = await chatAPI.getConversations({
      user: userInfo.value.userName
    })
    
    console.log('会话列表响应:', res)
    
    if (res && Array.isArray(res.data)) {
      conversations.value = res.data.map(conv => ({
        id: conv.id,
        name: conv.name || '新对话',
        introduction: decodeUnicode(conv.introduction || ''),
        status: conv.status,
        created_at: conv.created_at,
        updated_at: conv.updated_at
      }))
    }
  } catch (error) {
    console.error('获取会话列表失败:', error)
    ElMessage.error('获取会话列表失败')
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return;

  // 添加用户消息
  const messageId = generateId();
  const userMessage = {
    id: messageId,
    content: inputMessage.value,
    role: 'user',
    created_at: new Date(),
    files: uploadedFiles.value.map(file => ({
      id: file.id,
      name: file.name
    }))
  };
  messages.value.push(userMessage);

  // 添加AI回复占位符(用于流式更新)
  const aiMessageId = generateId();
  currentMessageId.value = aiMessageId;
  
  const aiMessage = {
    id: aiMessageId,
    content: '',
    role: 'assistant',
    thinking: '',
    created_at: new Date()
  };
  messages.value.push(aiMessage);
  
  // 清空输入并滚动到底部
  const currentInput = inputMessage.value;
  inputMessage.value = '';
  scrollToBottom();
  isLoading.value = true;
  
  try {
    // 创建POST请求
    const response = await fetch('http://localhost:8080/deepSeek/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: currentInput,
        conversationId: currentConversation.value?.id || '',
        user: userInfo.value.userName,
        responseMode: "streaming"
      })
    });
    
    if (!response.ok) {
      console.error('请求失败:', response.status);
      ElMessage.error('请求失败');
      return;
    }
    
    if (!response.body) {
      console.error('响应体为空');
      return;
    }
    
    console.log('开始处理流式响应...');
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    
    // 处理流式响应
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('数据流读取完毕');
        break;
      }
      
      // 解码收到的数据块
      const chunk = decoder.decode(value, { stream: true });
      console.log('收到数据块:', chunk);
      buffer += chunk;
      
      // 处理完整的SSE事件
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || ''; // 保留可能不完整的最后一部分
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        // 解析事件类型和数据
        const eventMatch = line.match(/event:\s*(\w+)/);
        const dataMatch = line.match(/data:\s*(.*)/);
        
        if (!dataMatch) continue;
        
        const eventType = eventMatch ? eventMatch[1] : 'message';
        let data = dataMatch[1].trim();
        
        console.log(`解析到事件: ${eventType}, 数据: ${data}`);
        
        try {
          // 解析JSON数据
          const parsedData = JSON.parse(data);
          
          // 根据事件类型更新UI
          if (eventType === 'agent_thought' && parsedData.thought) {
            // 更新思考过程
            const index = messages.value.findIndex(msg => msg.id === aiMessageId);
            if (index !== -1) {
              messages.value[index].thinking = parsedData.thought;
              await scrollToBottom();
            }
          } else if (eventType === 'agent_message' && parsedData.answer) {
            // 更新回复内容
            const index = messages.value.findIndex(msg => msg.id === aiMessageId);
            if (index !== -1) {
              messages.value[index].content += parsedData.answer;
              await scrollToBottom();
            }
          } else if (eventType === 'message' && parsedData.answer) {
            // 处理普通消息
            const index = messages.value.findIndex(msg => msg.id === aiMessageId);
            if (index !== -1) {
              messages.value[index].content += parsedData.answer;
              await scrollToBottom();
            }
          }
        } catch (e) {
          console.error('解析数据失败:', e, data);
        }
      }
    }
    
    isLoading.value = false;
    currentMessageId.value = null;
    
    // 如果是新会话,保存会话
    if (!currentConversation.value) {
      getConversations();
    }
  } catch (error) {
    console.error('发送消息失败:', error);
    ElMessage.error('发送消息失败');
    isLoading.value = false;
    currentMessageId.value = null;
    
    // 如果请求失败,移除AI消息
    messages.value = messages.value.filter(msg => msg.id !== aiMessageId);
  }
};




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

// 处理知识库创建
const handleCreateKnowledgeBase = async (name) => {
  try {
    const res = await chatAPI.dataset.create({
      name: name,
      description: '',
      indexing_technique: 'economy',
      permission: 'all_team_members'
    })
    
    if (res.code === 200) {
      ElMessage.success('创建成功')
      getKnowledgeBases()
    }
  } catch (error) {
    console.error('创建知识库失败:', error)
    ElMessage.error('创建知识库失败')
  }
}

// 获取知识库列表
const getKnowledgeBases = async (page = 1, limit = 10) => {
  try {
    const res = await chatAPI.dataset.list({ page, limit })
    if (res.code === 200) {
      // 处理新的响应数据结构
      if (res.data && Array.isArray(res.data.data)) {
        knowledgeBases.value = res.data.data.map(kb => ({
          id: kb.id,
          name: kb.name,
          description: kb.description,
          status: kb.status,
          created_at: kb.created_at
        }))
      } else if (Array.isArray(res.data)) {
        knowledgeBases.value = res.data.map(kb => ({
          id: kb.id,
          name: kb.name,
          description: kb.description || '',
          status: kb.status,
          created_at: kb.created_at
        }))
      } else {
        knowledgeBases.value = []
      }
    }
  } catch (error) {
    console.error('获取知识库列表失败:', error)
    ElMessage.error('获取知识库列表失败')
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

// 获取用户信息
const getUserInfo = async () => {
  try {
    // 从localStorage获取用户信息
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      userInfo.value = JSON.parse(userInfoStr)
    } else {
      // 如果localStorage中没有，则从API获取
      const res = await authAPI.getInfo()
      if (res.code === 200 && res.user) {
        userInfo.value = res.user // 直接使用 res.user
        localStorage.setItem('userInfo', JSON.stringify(res.user))
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await authAPI.logout()
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    ElMessage.error('退出登录失败')
  }
}

// 组件挂载时执行
onMounted(async () => {
  // 获取用户信息
  await getUserInfo()
  
  // 获取会话列表
  await getConversations()
  
  // 获取知识库列表
  await getKnowledgeBases()
  
  // 默认新对话状态
  currentConversation.value = null
  messages.value = []
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

.thinking-process {
  margin: 8px 0;
}

.thinking-process :deep(.el-collapse) {
  border: none;
}

.thinking-process :deep(.el-collapse-item__header) {
  background-color: #f8f8f8;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.thinking-process :deep(.el-collapse-item__content) {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 0 0 4px 4px;
}

.thinking-content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

.dark-theme {
  .thinking-process :deep(.el-collapse-item__header) {
    background-color: #2a2a2a;
    color: #999;
  }
  
  .thinking-process :deep(.el-collapse-item__content) {
    background-color: #1a1a1a;
  }
  
  .thinking-content {
    color: #999;
  }
}

.message-content {
  margin-top: 8px;
  color: #333;
  line-height: 1.6;
}

.dark-theme .message-content {
  color: #e0e0e0;
}

/* 添加代码高亮样式 */
.message-content pre {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  overflow: auto;
}

.message-content code {
  font-family: Monaco, Consolas, "Courier New", monospace;
}

.dark-theme .message-content pre {
  background-color: #1e1e1e;
}
</style>