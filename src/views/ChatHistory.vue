<template>
  <div class="chat-history">
    <transition-group name="chat-item">
      <div v-for="chat in conversations"
           :key="chat.id"
           class="chat-item"
           :class="{ 'active': chat.id === currentConversationId }"
           @click="$emit('select-chat', chat)">
        <div class="chat-info">
          <div class="chat-name">
            <span v-if="!isEditing[chat.id]">{{ chat.name }}</span>
            <input
                v-else
                type="text"
                v-model="editNames[chat.id]"
                @keyup.enter="saveRename(chat.id)"
                @blur="saveRename(chat.id)"
                @click.stop
                class="rename-input"
                ref="renameInput"
                autofocus
            />
          </div>
          <div class="chat-time">{{ formatTime(chat.created_at) }}</div>
        </div>
        <div class="chat-actions">
          <button
              class="action-btn rename-btn"
              @click.stop="startRename(chat)"
              aria-label="Rename conversation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
          </button>
          <button
              class="action-btn delete-btn"
              @click.stop="$emit('delete-conversation', chat.id)"
              aria-label="Delete conversation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
          </button>
        </div>
      </div>
    </transition-group>
    <div v-if="conversations.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <p>暂无对话记录</p>
      <p class="empty-hint">点击"新建对话"开始聊天</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, nextTick } from 'vue'

const props = defineProps({
  currentConversationId: {
    type: String,
    default: ''
  },
  userInfo: {
    type: Object,
    default: () => null
  },
  conversations: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select-chat', 'delete-conversation', 'rename-conversation'])

// 重命名相关状态
const isEditing = ref({})
const editNames = ref({})
const renameInput = ref(null)

// 开始重命名
const startRename = (chat) => {
  // 设置所有对话为非编辑状态
  Object.keys(isEditing.value).forEach(key => {
    isEditing.value[key] = false
  })

  // 设置当前对话为编辑状态
  isEditing.value[chat.id] = true
  editNames.value[chat.id] = chat.name

  // 下一个渲染周期后聚焦输入框
  nextTick(() => {
    if (renameInput.value && renameInput.value.length) {
      renameInput.value[0].focus()
    }
  })
}

// 保存重命名
const saveRename = (chatId) => {
  if (isEditing.value[chatId]) {
    const newName = editNames.value[chatId]?.trim()
    if (newName) {
      emit('rename-conversation', chatId, newName)
    }
    isEditing.value[chatId] = false
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)

  // 获取当前日期
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // 判断是今天、昨天还是更早
  if (date >= today) {
    return '今天 ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (date >= yesterday) {
    return '昨天 ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}
</script>

<style scoped>
.chat-history {
  margin-top: 0.5rem;
  overflow-y: auto;
  max-height: calc(100vh - 300px);
  padding: 0.5rem;
}

.chat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.chat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chat-item:hover::before {
  opacity: 0.5;
}

.chat-item.active {
  background-color: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.chat-item.active::before {
  opacity: 1;
}

.chat-info {
  flex: 1;
  margin-right: 1rem;
  overflow: hidden;
}

.chat-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text-primary, #111827);
}

.chat-time {
  font-size: 0.7rem;
  color: var(--color-text-tertiary, #9CA3AF);
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-item:hover .chat-actions {
  opacity: 1;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rename-btn {
  color: var(--color-text-tertiary, #9CA3AF);
}

.rename-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.delete-btn {
  color: var(--color-text-tertiary, #9CA3AF);
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: rgb(239, 68, 68);
}

.rename-input {
  width: 100%;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  background-color: white;
  color: #111827;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--color-text-tertiary, #9CA3AF);
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-hint {
  font-size: 0.75rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}

/* 动画效果 */
.chat-item-enter-active,
.chat-item-leave-active {
  transition: all 0.3s ease;
}

.chat-item-enter-from,
.chat-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 删除动画 */
.deleting {
  animation: deleteAnimation 0.3s ease forwards;
}

@keyframes deleteAnimation {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-100%);
    height: 0;
    margin: 0;
    padding: 0;
  }
}

/* 深色模式样式 */
:global(.dark) .chat-item {
  background-color: rgba(17, 24, 39, 0.5);
  border-color: rgba(55, 65, 81, 0.5);
}

:global(.dark) .chat-item:hover {
  background-color: rgba(31, 41, 55, 0.7);
}

:global(.dark) .chat-item.active {
  background-color: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

:global(.dark) .chat-name {
  color: var(--color-text-primary-dark, #F9FAFB);
}

:global(.dark) .chat-time {
  color: var(--color-text-tertiary-dark, #9CA3AF);
}

:global(.dark) .rename-input {
  background-color: #1f2937;
  border-color: #4b5563;
  color: #f9fafb;
}

:global(.dark) .rename-btn:hover {
  background-color: rgba(59, 130, 246, 0.2);
}

:global(.dark) .delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

/* 响应式样式 */
@media (max-width: 768px) {
  .chat-item {
    padding: 0.625rem 0.75rem;
  }

  .chat-intro {
    -webkit-line-clamp: 1;
  }
}
</style>
