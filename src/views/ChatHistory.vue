
最后，让我们更新ChatHistory.vue组件，使其与我们的新设计风格一致：

```vue project="Chat App" file="ChatHistory.vue" type="vue"
<template>
  <div class="chat-history">
    <transition-group name="chat-item">
      <div v-for="chat in conversations"
           :key="chat.id"
           class="chat-item"
           :class="{ 'active': chat.id === currentConversationId }"
           @click="$emit('select-chat', chat)">
        <div class="chat-info">
          <div class="chat-name">{{ chat.name }}</div>
          <div v-if="chat.introduction" class="chat-intro" v-html="chat.introduction"></div>
          <div class="chat-time">{{ formatTime(chat.created_at) }}</div>
        </div>
        <button
            class="delete-btn"
            @click.stop="$emit('delete-conversation', chat.id)"
            aria-label="Delete conversation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
        </button>
      </div>
    </transition-group>
    <div v-if="conversations.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <p>暂无对话记录</p>
      <p class="empty-hint">点击"新建对话"开始聊天</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

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

const emit = defineEmits(['select-chat', 'delete-conversation'])

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

.chat-intro {
  font-size: 0.75rem;
  color: var(--color-text-secondary, #6B7280);
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.chat-time {
  font-size: 0.7rem;
  color: var(--color-text-tertiary, #9CA3AF);
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background-color: transparent;
  color: var(--color-text-tertiary, #9CA3AF);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
}

.chat-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: rgb(239, 68, 68);
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

:global(.dark) .chat-intro {
  color: var(--color-text-secondary-dark, #D1D5DB);
}

:global(.dark) .chat-time {
  color: var(--color-text-tertiary-dark, #9CA3AF);
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
