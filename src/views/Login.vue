<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="../../public/favicon.png" alt="Logo" class="logo" />
        <h1>Welcome to IMUT Chat</h1>
        <p>登录后继续</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            type="text"
            v-model="loginForm.username"
            placeholder="用户名"
            class="input-field"
          />
        </div>

        <div class="form-group">
          <input
            type="password"
            v-model="loginForm.password"
            placeholder="密码"
            class="input-field"
          />
        </div>

        <div class="form-group captcha-group">
          <input
            type="text"
            v-model="loginForm.code"
            placeholder="验证码"
            class="input-field captcha-input"
          />
          <div class="captcha-img" @click="refreshCaptcha">
            <img v-if="captchaImg" :src="captchaImg" alt="验证码" />
            <div v-else class="captcha-loading">加载中...</div>
          </div>
        </div>

        <button
          type="submit"
          class="login-button"
          :class="{ loading }"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/api/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const captchaImg = ref('')
const captchaUuid = ref('')

const loginForm = reactive({
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
    ElMessage.error('获取验证码失败')
  }
}

// 刷新验证码
const refreshCaptcha = () => {
  getCaptcha()
}

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password || !loginForm.code) {
    ElMessage.warning('请填写完整的登录信息')
    return
  }

  loading.value = true
  try {
    // 调用RuoYi-vue后端登录接口
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
      ElMessage.success('登录成功')
      router.push('/chat')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查用户名、密码和验证码')
    // 刷新验证码
    refreshCaptcha()
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取验证码
onMounted(() => {
  getCaptcha()
})
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f172a;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  background: #1e293b;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .logo {
    width: 64px;
    height: 64px;
    margin-bottom: 24px;
  }

  h1 {
    color: #f8fafc;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  p {
    color: #94a3b8;
    font-size: 16px;
  }
}

.login-form {
  .form-group {
    margin-bottom: 20px;
  }

  .captcha-group {
    display: flex;
    align-items: center;
    gap: 10px;

    .captcha-input {
      flex: 1;
    }

    .captcha-img {
      width: 120px;
      height: 40px;
      background: #334155;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .captcha-loading {
        color: #94a3b8;
        font-size: 14px;
      }
    }
  }

  .input-field {
    width: 100%;
    padding: 12px 16px;
    background: #334155;
    border: 1px solid #475569;
    border-radius: 6px;
    color: #f8fafc;
    font-size: 16px;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: #60a5fa;
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
    }

    &::placeholder {
      color: #64748b;
    }
  }
}

.login-button {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &.loading {
    background: #2563eb;
  }
}
</style>
