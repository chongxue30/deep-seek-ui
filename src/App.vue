<template>
  <div :class="{ 'dark-theme': isDarkMode }">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, provide, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus' // 如果您使用Element Plus
import { authAPI } from '@/api/auth'

// 暗黑模式状态
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')
const router = useRouter()

// 提供给子组件使用
provide('isDarkMode', isDarkMode)

// 切换暗黑模式的方法
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value)
}

provide('toggleDarkMode', toggleDarkMode)

// 用户活动监控相关
const lastActivityTime = ref(Date.now())
// 从后端配置读取，token过期时间为30分钟
const sessionTimeout = 30 * 60 * 1000 // 30分钟 * 60秒 * 1000毫秒
let activityTimer = null

// 检查活动状态
const checkActivity = () => {
  const token = localStorage.getItem('token')
  if (!token) return

  const now = Date.now()
  const timeSinceLastActivity = now - lastActivityTime.value

  // 如果不活跃时间超过超时时间，则自动登出
  if (timeSinceLastActivity >= sessionTimeout) {
    console.log('用户长时间未操作，自动登出')

    // 调用登出API
    authAPI.logout().catch(err => {
      console.error('登出失败:', err)
    }).finally(() => {
      // 无论API是否成功，都清除本地存储并跳转
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')

      ElMessage({
        message: '由于您长时间未操作，系统已自动登出',
        type: 'warning',
        duration: 5000
      })

      router.push('/login')
    })
  }
}

// 重置活动时间
const resetActivityTime = () => {
  lastActivityTime.value = Date.now()
}

// 设置活动监听
onMounted(() => {
  // 用户交互事件列表
  const events = ['mousedown', 'keypress', 'scroll', 'mousemove', 'click', 'touchstart']

  // 添加事件监听
  events.forEach(event => {
    document.addEventListener(event, resetActivityTime)
  })

  // 定期检查活动状态 - 每分钟检查一次
  activityTimer = setInterval(checkActivity, 60000)
})

// 清除监听
onUnmounted(() => {
  const events = ['mousedown', 'keypress', 'scroll', 'mousemove', 'click', 'touchstart']

  // 移除事件监听
  events.forEach(event => {
    document.removeEventListener(event, resetActivityTime)
  })

  // 清除定时器
  if (activityTimer) {
    clearInterval(activityTimer)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9fafb;
}

#app {
  height: 100%;
  width: 100%;
}

/* 暗黑模式样式 */
.dark-theme {
  background-color: #1a1a1a;
  color: #f0f0f0;
}
</style>
