<template>
  <div class="error-page">
    <div class="error-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h1>{{ errorCode || '错误' }}</h1>
      <p>{{ errorMessage || '发生了一个错误' }}</p>
      <div class="error-actions">
        <button class="back-button" @click="goBack">返回上一页</button>
        <button class="login-button" @click="goToLogin">去登录</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  errorMessage: String,
  errorCode: String
});

const router = useRouter();

const goBack = () => {
  router.back();
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
}

.error-container {
  text-align: center;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}

.error-icon {
  color: #f56c6c;
  margin-bottom: 1rem;
}

h1 {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  color: #333;
}

p {
  margin: 0 0 2rem 0;
  color: #666;
  font-size: 1.1rem;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.back-button {
  background-color: #909399;
  color: white;
}

.login-button {
  background-color: #409eff;
  color: white;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
