<template>
  <div :class="{ 'dark-theme': isDarkMode }">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, provide, watch } from 'vue'
import { useRoute } from 'vue-router'

// 暗黑模式状态
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

// 提供给子组件使用
provide('isDarkMode', isDarkMode)

// 切换暗黑模式的方法
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value)
}

provide('toggleDarkMode', toggleDarkMode)
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
</style>
