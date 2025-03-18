<template>
  <div class="knowledge-base-container">
    <!-- 知识库管理按钮 -->
    <button class="action-button knowledge-manage-btn" @click="showModal">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-plus"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path><line x1="12" x2="12" y1="10" y2="16"></line><line x1="9" x2="15" y1="13" y2="13"></line></svg>
      <span>知识库管理</span>
    </button>

    <!-- 知识库管理弹窗 -->
    <div v-if="showKnowledgeModal" class="modal-backdrop" @click="closeModal"></div>
    <div v-if="showKnowledgeModal" class="modal-container">
      <div class="modal-header">
        <h3>知识库管理</h3>
        <button class="close-button" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="knowledgeBases.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
          <p>暂无知识库，请点击下方按钮创建</p>
        </div>

        <div v-else class="knowledge-list">
          <div v-for="kb in knowledgeBases"
               :key="kb.id"
               class="knowledge-item">
            <div class="knowledge-info">
              <div class="knowledge-name">{{ kb.name }}</div>
              <div class="knowledge-details" v-if="kb.description || kb.document_count !== undefined">
                <span v-if="kb.description" class="description">{{ kb.description }}</span>
                <div class="stats">
                  <span v-if="kb.document_count !== undefined" class="document-count">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                    文档数: {{ kb.document_count }}
                  </span>
                  <span v-if="kb.word_count !== undefined" class="word-count">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
                    词数: {{ kb.word_count }}
                  </span>
                </div>
              </div>
            </div>
            <div class="knowledge-actions">
              <label class="file-upload-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
                上传文件
                <input type="file" class="hidden-input" @change="(e) => handleFileChange(e, kb.id)" />
              </label>
              <button class="delete-btn" @click="confirmDeleteKnowledgeBase(kb.id, kb.name)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button primary" @click="createKnowledgeBase">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          创建知识库
        </button>
      </div>
    </div>

    <!-- 创建知识库弹窗 -->
    <div v-if="showCreateModal" class="modal-backdrop" @click="closeCreateModal"></div>
    <div v-if="showCreateModal" class="modal-container create-modal">
      <div class="modal-header">
        <h3>创建知识库</h3>
        <button class="close-button" @click="closeCreateModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="kb-name">知识库名称</label>
          <input
              type="text"
              id="kb-name"
              v-model="newKnowledgeBase.name"
              placeholder="请输入知识库名称"
              class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="kb-description">知识库描述 (选填)</label>
          <textarea
              id="kb-description"
              v-model="newKnowledgeBase.description"
              placeholder="请输入知识库描述"
              class="form-textarea"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button" @click="closeCreateModal">取消</button>
        <button
            class="action-button primary"
            @click="submitCreateKnowledgeBase"
            :disabled="!newKnowledgeBase.name || isCreating"
        >
          <span v-if="isCreating">创建中...</span>
          <span v-else>确认创建</span>
        </button>
      </div>
    </div>

    <!-- 文件上传进度弹窗 -->
    <div v-if="showUploadProgress" class="modal-backdrop"></div>
    <div v-if="showUploadProgress" class="modal-container upload-modal">
      <div class="modal-header">
        <h3>文件上传</h3>
      </div>

      <div class="modal-body">
        <div class="upload-progress">
          <div class="file-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file">
              <path d="M14.5 2H6a"  stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              </path>
            </svg>
            <span>{{ currentUploadFile?.name || '文件上传中' }}</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
          <div class="progress-text">{{ uploadProgress }}%</div>
        </div>
      </div>
    </div>

    <!-- 确认删除弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-backdrop" @click="cancelDelete"></div>
    <div v-if="showDeleteConfirm" class="modal-container delete-modal">
      <div class="modal-header">
        <h3>确认删除</h3>
        <button class="close-button" @click="cancelDelete">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="delete-warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
          <p>确定要删除知识库 <strong>"{{ kbToDelete.name }}"</strong> 吗？</p>
          <p class="warning-text">此操作不可逆，知识库中的所有文档和分段将被永久删除。</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button" @click="cancelDelete">取消</button>
        <button
            class="action-button danger"
            @click="confirmDelete"
            :disabled="isDeleting"
        >
          <span v-if="isDeleting">删除中...</span>
          <span v-else>确认删除</span>
        </button>
      </div>
    </div>

    <!-- 通知提示 -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      <div class="notification-icon">
        <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
      </div>
      <div class="notification-content">
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted, defineProps } from 'vue'
import { chatAPI } from '@/api/index'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['create-knowledge-base', 'file-change', 'show-knowledge-modal'])

// 状态变量
const showKnowledgeModal = ref(false)
const showCreateModal = ref(false)
const showUploadProgress = ref(false)
const showDeleteConfirm = ref(false)
const knowledgeBases = ref([])
const isLoading = ref(false)
const isCreating = ref(false)
const isDeleting = ref(false)
const uploadProgress = ref(0)
const currentUploadFile = ref(null)
const kbToDelete = ref({ id: '', name: '' })
const notification = ref({
  show: false,
  message: '',
  type: 'info' // 'success', 'error', 'info'
})

// 新知识库表单
const newKnowledgeBase = ref({
  name: '',
  description: ''
})

// 显示弹窗
const showModal = () => {
  emit('show-knowledge-modal')
}

// 关闭弹窗
const closeModal = (e) => {
  if (e && e.target !== e.currentTarget) return
  showKnowledgeModal.value = false
}

// 显示创建知识库弹窗
const createKnowledgeBase = () => {
  showCreateModal.value = true
}

// 关闭创建知识库弹窗
const closeCreateModal = () => {
  showCreateModal.value = false
  newKnowledgeBase.value = {
    name: '',
    description: ''
  }
}

// 显示通知
const showNotification = (message, type = 'info') => {
  notification.value = {
    show: true,
    message,
    type
  }

  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// 获取知识库列表
const getKnowledgeBases = async () => {
  try {
    isLoading.value = true
    const res = await chatAPI.dataset.list()

    if (res.data && Array.isArray(res.data)) {
      knowledgeBases.value = res.data.map(kb => ({
        id: kb.id,
        name: kb.name,
        description: kb.description || '',
        document_count: kb.document_count,
        word_count: kb.word_count
      }))
    }
  } catch (error) {
    console.error('获取知识库列表失败:', error)
    showNotification('获取知识库列表失败', 'error')
  } finally {
    isLoading.value = false
  }
}

// 提交创建知识库
const submitCreateKnowledgeBase = async () => {
  if (!newKnowledgeBase.value.name) return

  try {
    isCreating.value = true
    const res = await chatAPI.dataset.create({
      name: newKnowledgeBase.value.name,
      description: newKnowledgeBase.value.description,
      indexing_technique: 'economy',
      permission: 'all_team_members',
      user: props.userInfo?.userName || 'guest'
    })

    if (res.code === 200) {
      showNotification('创建知识库成功', 'success')
      await getKnowledgeBases()
      emit('create-knowledge-base', newKnowledgeBase.value.name)
      closeCreateModal()
    }
  } catch (error) {
    console.error('创建知识库失败:', error)
    showNotification('创建知识库失败', 'error')
  } finally {
    isCreating.value = false
  }
}

// 处理文件上传
const handleFileChange = async (event, datasetId) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    currentUploadFile.value = file
    showUploadProgress.value = true
    uploadProgress.value = 0

    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.floor(Math.random() * 10) + 1
      }
    }, 300)

    // 发送文件到知识库
    const formData = new FormData()
    formData.append('file', file)
    formData.append('datasetId', datasetId)

    // 这里调用实际的上传API
    emit('file-change', { file, datasetId })

    // 模拟上传完成
    setTimeout(() => {
      clearInterval(progressInterval)
      uploadProgress.value = 100

      setTimeout(() => {
        showUploadProgress.value = false
        showNotification('文件上传成功', 'success')
        getKnowledgeBases() // 刷新知识库列表
      }, 500)
    }, 2000)

  } catch (error) {
    console.error('文件上传失败:', error)
    showNotification('文件上传失败', 'error')
    showUploadProgress.value = false
  }

  // 重置文件输入，允许再次选择同一文件
  event.target.value = ''
}

// 确认删除知识库
const confirmDeleteKnowledgeBase = (id, name) => {
  kbToDelete.value = { id, name }
  showDeleteConfirm.value = true
}

// 取消删除
const cancelDelete = () => {
  showDeleteConfirm.value = false
  kbToDelete.value = { id: '', name: '' }
}

// 确认删除
const confirmDelete = async () => {
  if (!kbToDelete.value.id) return

  try {
    isDeleting.value = true
    const res = await chatAPI.dataset.delete(kbToDelete.value.id)

    if (res.code === 200) {
      showNotification(`知识库 "${kbToDelete.value.name}" 已删除`, 'success')
      await getKnowledgeBases()
      showDeleteConfirm.value = false
    }
  } catch (error) {
    console.error('删除知识库失败:', error)
    showNotification('删除知识库失败', 'error')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  getKnowledgeBases()
})
</script>

<style scoped>
.knowledge-base-container {
  width: 100%;
}

.knowledge-manage-btn {
  width: 100%;
  margin-top: 0.5rem;
  justify-content: flex-start;
}

/* 模态框样式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 100;
}

.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 101;
  display: flex;
  flex-direction: column;
  animation: modalFadeIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* 知识库列表样式 */
.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.knowledge-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.knowledge-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.knowledge-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.knowledge-name {
  font-weight: 600;
  font-size: 1rem;
  color: #111827;
}

.knowledge-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.description {
  font-size: 0.875rem;
  color: #6b7280;
}

.stats {
  display: flex;
  gap: 0.75rem;
}

.document-count, .word-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.knowledge-actions {
  display: flex;
  gap: 0.5rem;
}

.file-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #3b82f6;
  color: white;
  border: none;
}

.file-upload-btn:hover {
  background-color: #2563eb;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: #fee2e2;
  color: #ef4444;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: #fecaca;
}

.hidden-input {
  display: none;
}

/* 创建知识库表单样式 */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

/* 上传进度样式 */
.upload-progress {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
}

.progress-bar-container {
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  font-size: 0.875rem;
  color: #6b7280;
}

/* 删除确认样式 */
.delete-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 1rem;
}

.delete-warning svg {
  color: #ef4444;
}

.warning-text {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #6b7280;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #9ca3af;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

/* 通知样式 */
.notification {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease;
  max-width: 24rem;
}

.notification.success {
  border-left: 4px solid #10b981;
}

.notification.error {
  border-left: 4px solid #ef4444;
}

.notification.info {
  border-left: 4px solid #3b82f6;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification.success .notification-icon {
  color: #10b981;
}

.notification.error .notification-icon {
  color: #ef4444;
}

.notification.info .notification-icon {
  color: #3b82f6;
}

.notification-content {
  flex: 1;
  font-size: 0.875rem;
}

/* 动画 */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 深色模式 */
:global(.dark) .modal-container {
  background-color: #1f2937;
  color: #f9fafb;
}

:global(.dark) .modal-header,
:global(.dark) .modal-footer {
  border-color: #374151;
}

:global(.dark) .close-button {
  color: #9ca3af;
}

:global(.dark) .close-button:hover {
  background-color: #374151;
  color: #f9fafb;
}

:global(.dark) .knowledge-item {
  background-color: #111827;
  border-color: #374151;
}

:global(.dark) .knowledge-name {
  color: #f9fafb;
}

:global(.dark) .description {
  color: #9ca3af;
}

:global(.dark) .document-count,
:global(.dark) .word-count {
  background-color: #374151;
  color: #d1d5db;
}

:global(.dark) .form-input,
:global(.dark) .form-textarea {
  background-color: #1f2937;
  border-color: #4b5563;
  color: #f9fafb;
}

:global(.dark) .form-input:focus,
:global(.dark) .form-textarea:focus {
  border-color: #3b82f6;
}

:global(.dark) .form-group label {
  color: #d1d5db;
}

:global(.dark) .progress-bar-container {
  background-color: #374151;
}

:global(.dark) .notification {
  background-color: #1f2937;
  color: #f9fafb;
}

:global(.dark) .empty-state,
:global(.dark) .loading-container {
  color: #9ca3af;
}

/* 响应式样式 */
@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    max-height: 85vh;
  }

  .knowledge-item {
    flex-direction: column;
    gap: 1rem;
  }

  .knowledge-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
