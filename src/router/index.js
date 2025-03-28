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
  },
  {
    // 添加课程选择路由
    path: '/course-selection',
    name: 'CourseSelection',
    component: () => import('../views/CourseSelection.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/course/:id',
    name: 'CourseDetail',
    component: () => import('../views/CourseDetail.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 增强路由守卫，添加学生身份验证和课程选择检查
router.beforeEach((to, from, next) => {
  console.log('路由跳转:', { to, from })

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    console.log('验证状态:', token)

    if (!token) {
      next('/login')
      return
    }

    // 获取用户信息
    const userInfoStr = localStorage.getItem('userInfo')
    if (!userInfoStr) {
      next('/login')
      return
    }

    try {
      const userInfo = JSON.parse(userInfoStr)

      // 检查用户是否为学生
      const isStudent = userInfo.roles?.some(role => role.roleKey === 'stu')
      console.log('用户是否为学生:', isStudent)

      if (isStudent) {
        // 检查是否已选择课程
        const selectedCourseId = localStorage.getItem('selectedCourseId')
        console.log('已选择的课程ID:', selectedCourseId)

        // 如果是学生且没有选择课程，且不是前往课程选择页面，则重定向到课程选择页面
        if (!selectedCourseId && to.path !== '/course-selection') {
          console.log('重定向到课程选择页面')
          next('/course-selection')
          return
        }
      }
    } catch (error) {
      console.error('解析用户信息失败:', error)
      next('/login')
      return
    }

    next()
  } else {
    next()
  }
})

export default router
