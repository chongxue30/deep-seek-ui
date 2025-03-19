import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
    component: () => import('../views/Chat.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加一些调试日志
router.beforeEach((to, from, next) => {
  console.log('路由跳转:', { to, from })
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    console.log('验证状态:', token)
    if (!token) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 
