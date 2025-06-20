<template>
  <div class="login-container">
    <div class="stars-container">
      <div v-for="(star, index) in stars" :key="index" class="star" :style="star"></div>
    </div>

    <div class="login-card">
      <div class="login-card-inner">
        <div class="login-header">
          <div class="logo-container">
            <img src="../../public/favicon.png" alt="Logo" class="logo" />
            <div class="logo-glow"></div>
          </div>
          <h1 class="title">AI <span class="lowlight"> · </span><span class="highlight">导师</span></h1>
          <p class="subtitle">AI导师精准伴学，让知识触手可及</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <input
                  id="username"
                  type="text"
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  class="input-field"
                  :class="{ 'input-error': errors.username }"
              />
            </div>
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="loginForm.password"
                  placeholder="请输入密码"
                  class="input-field"
                  :class="{ 'input-error': errors.password }"
              />
              <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                  tabindex="-1"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="captcha" class="form-label">验证码</label>
            <div class="captcha-group">
              <div class="input-wrapper captcha-input-wrapper">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                </span>
                <input
                    id="captcha"
                    type="text"
                    v-model="loginForm.code"
                    placeholder="请输入验证码"
                    class="input-field"
                    :class="{ 'input-error': errors.code }"
                />
              </div>
              <div class="captcha-img" @click="refreshCaptcha">
                <img v-if="captchaImg" :src="captchaImg" alt="验证码" />
                <div v-else class="captcha-loading">
                  <div class="spinner"></div>
                </div>
              </div>
            </div>
            <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
          </div>

          <button
              type="submit"
              class="login-button"
              :class="{ loading }"
              :disabled="loading"
          >
            <span v-if="!loading">登录</span>
            <div v-else class="button-loader">
              <div class="spinner-dot"></div>
              <div class="spinner-dot"></div>
              <div class="spinner-dot"></div>
            </div>
          </button>
        </form>

        <div class="login-footer">
          <p>© {{ new Date().getFullYear() }} 蒙ICP备2024012135号-1</p>
        </div>
      </div>
    </div>

    <!-- Confetti container -->
    <div class="confetti-container left-confetti"></div>
    <div class="confetti-container right-confetti"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/api/auth'
import { ElMessage } from 'element-plus'
import confetti from 'canvas-confetti'

const router = useRouter()
const loading = ref(false)
const captchaImg = ref('')
const captchaUuid = ref('')
const showPassword = ref(false)
const leftConfettiContainer = ref(null)
const rightConfettiContainer = ref(null)
let leftConfettiInstance = null
let rightConfettiInstance = null

const loginForm = reactive({
  username: '',
  password: '',
  code: ''
})

const errors = reactive({
  username: '',
  password: '',
  code: ''
})

// 获取验证码
const getCaptcha = async () => {
  try {
    const res = await authAPI.getCaptcha()
    if (res.code === 200) {
      captchaImg.value = 'data:image/gif;base64,' + res.img
      captchaUuid.value = res.uuid
    }
  } catch (error) {
    console.error('获取验证码失败:', error)
    ElMessage.error({
      message: '获取验证码失败',
      customClass: 'custom-message'
    })
  }
}

// 刷新验证码
const refreshCaptcha = () => {
  captchaImg.value = ''
  getCaptcha()
}

// 验证表单
const validateForm = () => {
  let isValid = true

  // 重置错误信息
  errors.username = ''
  errors.password = ''
  errors.code = ''

  if (!loginForm.username) {
    errors.username = '请输入用户名'
    isValid = false
  }

  if (!loginForm.password) {
    errors.password = '请输入密码'
    isValid = false
  }

  if (!loginForm.code) {
    errors.code = '请输入验证码'
    isValid = false
  }

  return isValid
}

// 初始化礼花
const initConfetti = () => {
  // No initialization needed for the simplified version
}

// 播放礼花动画
const playConfetti = () => {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  const randomInRange = (min, max) => Math.random() * (max - min) + min

  // 左侧礼花 - 向右发射
  const leftInterval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(leftInterval)
    }

    const particleCount = 50 * (timeLeft / duration)

    // 从左侧发射向右
    confetti({
      ...defaults,
      origin: { x: 0, y: 0.5 },
      particleCount,
      angle: randomInRange(0, 60),
      colors: ['#FF3E4D', '#FF9F1C', '#FFCC00', '#FFEA00']
    })
  }, 250)

  // 右侧礼花 - 向左发射
  const rightInterval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(rightInterval)
    }

    const particleCount = 50 * (timeLeft / duration)

    // 从右侧发射向左
    confetti({
      ...defaults,
      origin: { x: 1, y: 0.5 },
      particleCount,
      angle: randomInRange(120, 180),
      colors: ['#00CFFD', '#04E762', '#AA00FF', '#00B4D8']
    })
  }, 250)
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    // 调用登录接口
    const res = await authAPI.login(loginForm.username, loginForm.password, loginForm.code, captchaUuid.value)
    if (res.code === 200) {
      // 存储token
      localStorage.setItem('token', res.token)

      // 获取用户信息
      const userInfo = await authAPI.getInfo()
      if (userInfo.code === 200) {
        // 存储用户信息
        localStorage.setItem('userInfo', JSON.stringify(userInfo.user))
      }

      // 播放礼花动画
      playConfetti()

      // 显示成功消息
      ElMessage.success({
        message: '登录成功，欢迎回来！',
        customClass: 'custom-message'
      })

      // 延迟导航，让用户看到礼花效果
      setTimeout(() => {
        router.push('/chat')
      }, 1500)
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error({
      message: '登录失败，请检查用户名、密码和验证码',
      customClass: 'custom-message'
    })
    // 刷新验证码
    refreshCaptcha()
  } finally {
    loading.value = false
  }
}

const stars = ref([])

// 生成随机星星样式

const getRandomStarStyle = () => {
  return {
    width: `${Math.random() * 3 + 1}px`,
    height: `${Math.random() * 3 + 1}px`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 3 + 2}s`,
    animationDelay: `${Math.random() * 5}s`
  }
}

onMounted(() => {
  getCaptcha()
  initConfetti()

  stars.value = Array.from({ length: 50 }, () => getRandomStarStyle())

  // 添加键盘事件监听器
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // 移除键盘事件监听器
  document.removeEventListener('keydown', handleKeyDown)
})

// 处理键盘事件
const handleKeyDown = (e) => {
  // 按下回车键时提交表单
  if (e.key === 'Enter') {
    handleLogin()
  }
}
</script>

<style scoped lang="scss">
// 变量定义
$primary-color: #4F46E5;
$primary-hover: #4338CA;
$primary-glow: rgba(169, 167, 204, 0.5);
$background-dark: #0F172A;
$card-bg: rgba(135, 148, 172, 0.8);
$card-border: rgba(255, 255, 255, 0.1);
$input-bg: rgba(51, 65, 85, 0.8);
$input-border: rgba(71, 85, 105, 0.5);
$input-focus-border: #60A5FA;
$text-light: #F8FAFC;
$text-muted: #f6f8fa;  // 将文本颜色改为灰色
$icon-color: #F8FAFC;  // 修改为白色，使其在深色背景上可见
$error-color: #EF4444;
$success-color: #10B981;

// 全局样式
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse {
  0% { opacity: 0.6; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(0.95); }
}

@keyframes twinkle {
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

// 容器样式
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

// 星星背景
.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.star {
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  animation: twinkle infinite;
}

// 登录卡片
.login-card {
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
  perspective: 1000px;
}

.login-card-inner {
  background: $card-bg;
  backdrop-filter: blur(10px);
  border: 1px solid $card-border;
  border-radius: 16px;
  padding: 40px;
  box-shadow:
      0 10px 25px rgba(0, 0, 0, 0.2),
      0 0 40px rgba(79, 70, 229, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    box-shadow:
        0 15px 35px rgba(0, 0, 0, 0.3),
        0 0 60px rgba(79, 70, 229, 0.2),
        inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    //transform: translateY(-5px);
  }
}

// 登录头部
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  animation: float 6s ease-in-out infinite;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

.logo-glow {
  position: absolute;
  top: 0%;
  //left: 50%;
  //transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, $primary-glow 0%, rgba(79, 70, 229, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  animation: pulse 3s ease-in-out infinite;
}

.title {
  color: $text-light;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
  text-shadow: 0 0 10px rgba(79, 70, 229, 0.5);

  .lowlight{
    background: linear-gradient(90deg, #1e14a5 0%, #ededf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  .highlight {
    background: linear-gradient(90deg, #1e14a5 0%, #4F46E5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
}

.subtitle {
  color: $text-muted;
  font-size: 16px;
  font-weight: 400;
}

// 表单样式
.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  color: $text-light;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

// 修改input-icon样式
.input-icon {
  position: absolute;
  left: 16px;
  color: $icon-color;  // 现在使用白色图标
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-field {
  width: 100%;
  padding: 14px 16px 14px 44px;
  background: $input-bg;
  border: 1px solid $input-border;
  border-radius: 8px;
  color: $text-light;
  font-size: 16px;
  transition: all 0.3s;
  backdrop-filter: blur(5px);

  &:focus {
    outline: none;
    border-color: $input-focus-border;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
  }

  &::placeholder {
    color: rgba(148, 163, 184, 0.7);
  }

  &.input-error {
    border-color: $error-color;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }
}

.toggle-password {
  position: absolute;
  right: 16px;
  background: transparent;
  border: none;
  color: $text-muted;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    color: $text-light;
  }

  &:focus {
    outline: none;
  }
}

.error-message {
  display: block;
  color: $error-color;
  font-size: 12px;
  margin-top: 6px;
}

// 验证码样式
.captcha-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.captcha-input-wrapper {
  flex: 1;
}

.captcha-img {
  width: 120px;
  height: 44px;
  background: $input-bg;
  border: 1px solid $input-border;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    border-color: $input-focus-border;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.captcha-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-top-color: $input-focus-border;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

// 登录按钮
.login-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, $primary-color 0%, #6366F1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
    );
    transition: all 0.6s;
  }

  &:hover {
    background: linear-gradient(90deg, $primary-hover 0%, #5661F5 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(79, 70, 229, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;

    &::before {
      display: none;
    }
  }
}

// 按钮加载动画
.button-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.spinner-dot {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  display: inline-block;
  animation: dot-bounce 1.4s infinite ease-in-out both;

  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }
}

// 页脚
.login-footer {
  text-align: center;
  margin-top: 30px;

  p {
    color: $text-muted;
    font-size: 14px;
  }
}

// 礼花容器
.confetti-container {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.left-confetti {
  left: 0;
}

.right-confetti {
  right: 0;
}

// 响应式样式
@media (max-width: 576px) {
  .login-card-inner {
    padding: 30px 20px;
  }

  .title {
    font-size: 28px;
  }

  .logo-container {
    width: 70px;
    height: 70px;
  }

  .captcha-group {
    flex-direction: column;
    gap: 10px;
  }

  .captcha-img {
    width: 100%;
  }
}

// 自定义消息样式
:global(.custom-message) {
  backdrop-filter: blur(10px);
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 12px 16px;

  :global(.el-message__content) {
    color: $text-light;
  }
}
</style>

