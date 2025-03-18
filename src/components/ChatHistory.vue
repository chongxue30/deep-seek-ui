<template>
  <div class="chat-history">
    <div v-for="chat in conversations"
         :key="chat.id"
         class="chat-item"
         :class="{ 'active': chat.id === currentConversationId }"
         @click="$emit('select-chat', chat)">
      <div class="chat-info">
        <div class="chat-name">{{ chat.name }}</div>
<!--        <div class="chat-intro" v-if="chat.introduction" v-html="chat.introduction"></div>-->
        <div class="chat-time">{{ formatTime(chat.created_at) }}</div>
      </div>
      <el-button
        type="danger"
        size="small"
        @click.stop="$emit('delete-conversation', chat.id)"
      >
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

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
  return date.toLocaleString()
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
</script>

<style scoped>
.chat-history {
  margin-top: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 300px);
}

.chat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-item:hover {
  background-color: #f5f7fa;
}

.chat-item.active {
  background-color: #ecf5ff;
}

.chat-info {
  flex: 1;
  margin-right: 10px;
  overflow: hidden;
}

.chat-name {
  font-weight: bold;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-intro {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.chat-time {
  font-size: 12px;
  color: #999;
}

.dark-theme .chat-item:hover {
  background-color: #363636;
}

.dark-theme .chat-item.active {
  background-color: #1e1e1e;
}

.dark-theme .chat-intro {
  color: #999;
}

.dark-theme .chat-time {
  color: #666;
}
</style>
