import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Chat from '@/views/Chat.vue'
import { ElMessage } from 'element-plus'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: { requiresAuth: true }
  },
  {
    path: '/course/:id',
    name: 'CourseDetail',
    component: () => import('../views/CourseDetail.vue'),
    meta: { requiresAuth: true }
  },
  // 添加一个错误页面路由
  {
    path: '/error',
    name: 'Error',
    component: () => import('../views/Error.vue'),
    props: route => ({
      errorMessage: route.query.message,
      errorCode: route.query.code
    })
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 全局变量，用于标记是否已显示了权限错误通知
let hasShownAuthError = false;

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  // 如果是前往登录页或错误页，直接放行
  if (to.path === '/login' || to.path === '/error') {
    hasShownAuthError = false; // 重置错误标记
    next()
    return
  }

  // 需要认证但没有token的情况
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 不直接重定向到登录页，而是显示错误信息
    if (!hasShownAuthError) {
      ElMessage.error('您需要登录才能访问此页面')
      hasShownAuthError = true;
    }
    // 可以选择重定向到错误页面，而不是登录页
    next('/error?message=请先登录&code=401')
  } else {
    hasShownAuthError = false; // 重置错误标记
    next()
  }
})

export default router
