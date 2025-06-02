/* eslint-disable */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './styles/dark-theme.scss'
import '@/assets/styles/global.scss' // 导入全局样式
import './utils/requestInterceptor' // 添加此行

console.log('Main.js is executing')

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册路由
app.use(router)
console.log('Router installed')

// 注册 Element Plus
app.use(ElementPlus)

// 直接挂载应用
app.mount('#app')

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
}
