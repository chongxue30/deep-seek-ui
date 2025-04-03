<template>
  <div class="chat-history">
    <h3 class="section-title">我的课程</h3>

    <!-- 课程加载中 -->
    <div v-if="isLoadingCourses" class="loading-container-small">
      <div class="loading-spinner-small"></div>
      <p>加载课程中...</p>
    </div>

    <!-- 无课程时的空态 -->
    <div v-else-if="courseList.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
      <p>暂无课程</p>
    </div>

    <!-- 课程与对应会话列表 -->
    <div v-else class="course-conversation-list">
      <div v-for="course in courseList" :key="course.classId" class="course-section">
        <!-- 课程标题 -->
        <div class="course-header"
             :class="{ 'active': selectedCourseId === course.classId }"
             @click="toggleCourse(course.classId)">
          <div class="course-info">
            <div class="expand-icon">
              <svg v-if="expandedCourses[course.classId]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div class="course-name">{{ course.className }}</div>
            <div class="course-count">{{ getConversationCount(course.classId) }}</div>
          </div>
        </div>

        <!-- 课程对应的会话列表 -->
        <div v-if="expandedCourses[course.classId]" class="conversation-list">
          <!-- 会话列表 -->
          <transition-group name="chat-item">
            <div v-for="chat in getConversationsByClassId(course.classId)"
                 :key="chat.id"
                 class="chat-item"
                 :class="{ 'active': chat.id === currentConversationId }"
                 @click="selectChat(chat)">
              <div class="chat-info">
                <div class="chat-name">
                  <span v-if="!isEditing[chat.id]">{{ chat.name }}</span>
                  <input
                      v-else
                      type="text"
                      v-model="editNames[chat.id]"
                      @keyup.enter="saveRename(chat.id)"
                      @blur="saveRename(chat.id)"
                      @click.stop
                      class="rename-input"
                      ref="renameInput"
                      autofocus
                  />
                </div>
                <div class="chat-time">{{ formatTime(chat.created_at) }}</div>
              </div>
              <div class="chat-actions">
                <button
                    class="action-btn rename-btn"
                    @click.stop="startRename(chat)"
                    aria-label="Rename conversation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
                </button>
                <button
                    class="action-btn delete-btn"
                    @click.stop="$emit('delete-conversation', chat.id)"
                    aria-label="Delete conversation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                </button>
              </div>
            </div>
          </transition-group>

          <!-- 当前课程没有会话时的空态 -->
          <div v-if="getConversationsByClassId(course.classId).length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <p>{{ course.className }}暂无对话记录</p>
            <p class="empty-hint">点击"新建对话"开始聊天</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, nextTick, watch } from 'vue'

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

const emit = defineEmits(['select-chat', 'delete-conversation', 'rename-conversation'])

// 重命名相关状态
const isEditing = ref({})
const editNames = ref({})
const renameInput = ref(null)

// 课程列表相关状态
const courseList = ref([])
const isLoadingCourses = ref(false)
const expandedCourses = ref({}) // 追踪哪些课程被展开
const selectedCourseId = ref('') // 当前选中的课程ID

// 获取课程列表
// 获取课程列表
const fetchCourseList = async () => {
  try {
    isLoadingCourses.value = true

    // 从localStorage获取用户信息
    const userInfoStr = localStorage.getItem('userInfo')
    const localUserInfo = userInfoStr ? JSON.parse(userInfoStr) : null

    // 优先使用 props 中的用户信息，如果没有则使用本地存储的用户信息
    const effectiveUserInfo = props.userInfo || localUserInfo

    console.log("有效用户信息:", effectiveUserInfo)

    // 判断用户类型
    const isTeacher = effectiveUserInfo?.roles?.some(role => role.roleKey === 'tea')
    const isStudent = effectiveUserInfo?.roles?.some(role => role.roleKey === 'stu')

    console.log("是教师:", isTeacher, "是学生:", isStudent)

    const token = localStorage.getItem('token')
    if (!token) {
      console.error('获取课程列表失败: 未找到token')
      isLoadingCourses.value = false
      return
    }

    // 根据角色获取课程
    if (isTeacher) {
      // 教师获取课程
      const userId = effectiveUserInfo?.userId || ''

      const res = await fetch('/dev-api/system/class/listByTeacherId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ teacherId: userId })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.rows && Array.isArray(data.rows)) {
          courseList.value = data.rows
          console.log("成功获取教师课程列表:", courseList.value)
        } else {
          courseList.value = []
        }
      } else {
        throw new Error('获取教师课程列表失败')
      }
    } else if (isStudent) {
      // 学生先获取学生ID，再获取课程
      let studentId = null

      // 1. 先尝试从localStorage获取studentId
      const storedStudentId = localStorage.getItem('studentId')
      if (storedStudentId) {
        studentId = storedStudentId
        console.log("从localStorage获取到学生ID:", studentId)
      } else {
        // 2. 如果没有，则通过API获取学生ID
        console.log("通过API获取学生ID")
        const userName = effectiveUserInfo?.userName

        if (!userName) {
          throw new Error('无法获取学生信息：用户名不存在')
        }

        // 通过用户名获取学生ID
        const studentResponse = await fetch('/dev-api/system/student/byUserName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            studentNo: userName
          })
        })

        if (!studentResponse.ok) {
          throw new Error('获取学生信息失败')
        }

        const studentData = await studentResponse.json()

        if (studentData.code === 200 && studentData.data) {
          // 直接使用返回的学生数据
          const studentRecord = studentData.data

          // 验证studentNo匹配
          if (studentRecord.studentNo === userName) {
            studentId = studentRecord.studentId
            // 保存studentId到localStorage以便后续使用
            localStorage.setItem('studentId', studentId)
            console.log("成功获取并保存学生ID:", studentId)
          } else {
            throw new Error('学生学号不匹配')
          }
        } else {
          throw new Error('未找到学生记录')
        }
      }

      // 使用学生ID获取课程列表
      if (studentId) {
        console.log("使用学生ID获取课程:", studentId)

        const res = await fetch('/dev-api/system/stu/listClass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ studentId: studentId })
        })

        if (res.ok) {
          const data = await res.json()
          if (data.rows && Array.isArray(data.rows)) {
            courseList.value = data.rows
            console.log("成功获取学生课程列表:", courseList.value)
          } else {
            courseList.value = []
          }
        } else {
          throw new Error('获取学生课程列表失败')
        }
      } else {
        throw new Error('无法获取课程：学生ID不存在')
      }
    } else {
      // 角色未知，尝试其他方式
      console.warn("未识别的用户角色，尝试通过用户名获取学生信息")

      // 尝试作为学生处理
      const userName = effectiveUserInfo?.userName
      if (userName) {
        try {
          // 通过用户名获取学生ID
          const studentResponse = await fetch('/dev-api/system/student/byUserName', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              studentNo: userName
            })
          })

          if (studentResponse.ok) {
            const studentData = await studentResponse.json()

            if (studentData.code === 200 && studentData.data) {
              const studentRecord = studentData.data
              const studentId = studentRecord.studentId
              localStorage.setItem('studentId', studentId)

              // 获取课程列表
              const res = await fetch('/dev-api/system/stu/listClass', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ studentId: studentId })
              })

              if (res.ok) {
                const data = await res.json()
                if (data.rows && Array.isArray(data.rows)) {
                  courseList.value = data.rows
                  console.log("成功获取学生课程列表:", courseList.value)
                } else {
                  courseList.value = []
                }
              }
            }
          }
        } catch (error) {
          console.error("尝试作为学生获取课程失败:", error)
        }
      }
    }

    // 初始化课程状态
    if (courseList.value.length > 0) {
      // 初始化所有课程为未展开状态
      courseList.value.forEach(course => {
        expandedCourses.value[course.classId] = false
      })

      // 检查localStorage中是否已有选中的课程ID
      const savedCourseId = localStorage.getItem('selectedCourseId')

      // 如果有已保存的课程ID并且该课程在列表中，使用它
      if (savedCourseId && courseList.value.some(course => course.classId === savedCourseId)) {
        selectedCourseId.value = savedCourseId
        expandedCourses.value[savedCourseId] = true
      }
      // 否则选择并展开第一个课程
      else {
        selectedCourseId.value = courseList.value[0].classId
        expandedCourses.value[courseList.value[0].classId] = true
        localStorage.setItem('selectedCourseId', selectedCourseId.value)
      }
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    courseList.value = []
  } finally {
    isLoadingCourses.value = false
  }
}



// 修改切换课程的方法
const toggleCourse = (courseId) => {
  // 检查当前点击的课程是否已展开
  const isCurrentlyExpanded = expandedCourses.value[courseId]

  // 先关闭所有课程
  Object.keys(expandedCourses.value).forEach(id => {
    expandedCourses.value[id] = false
  })

  // 如果点击的课程是收起状态，则展开它
  // 如果已展开，点击后保持关闭状态（实现切换功能）
  if (!isCurrentlyExpanded) {
    expandedCourses.value[courseId] = true
  }

  // 更新选中状态
  if (selectedCourseId.value !== courseId) {
    selectedCourseId.value = courseId
    localStorage.setItem('selectedCourseId', courseId)

    // 如果当前选中的会话不属于新选中的课程，则清除当前会话选择
    const currentChat = props.conversations.find(chat => chat.id === props.currentConversationId)
    if (currentChat && String(currentChat.class_id) !== String(courseId)) {
      // 查找当前选中课程下的第一个会话（如果有）
      const firstChatInCourse = getConversationsByClassId(courseId)[0]
      if (firstChatInCourse) {
        // 自动选择新课程下的第一个会话
        emit('select-chat', firstChatInCourse)
      } else {
        // 如果新课程下没有会话，可以考虑通知父组件清除当前选择
        // 这需要父组件支持这个操作
        // emit('clear-current-conversation')
      }
    }
  }
}

// 获取指定课程下的会话数量 - 修正类型比较并添加调试日志
const getConversationCount = (courseId) => {
  if (!props.conversations || !Array.isArray(props.conversations)) return 0


  // 确保类型一致进行比较
  const count = props.conversations.filter(chat =>
      String(chat.class_id) === String(courseId)
  ).length

  return count
}


// 获取特定课程ID下的所有会话 - 修改比较逻辑
const getConversationsByClassId = (classId) => {
  if (!props.conversations || !Array.isArray(props.conversations)) {
    return []
  }


  // 确保类型一致且使用严格比较
  const filtered = props.conversations.filter(chat => {

    return String(chat.class_id) === String(classId)
  })
  return filtered
}


// 初始化课程状态的改进
const initCourseState = () => {
  if (courseList.value.length > 0) {

    // 初始化所有课程为未展开状态
    courseList.value.forEach(course => {
      expandedCourses.value[course.classId] = false
    })

    // 检查localStorage中是否已有选中的课程ID
    const savedCourseId = localStorage.getItem('selectedCourseId')

    // 确保类型一致比较
    let foundSavedCourse = false
    if (savedCourseId) {
      foundSavedCourse = courseList.value.some(course =>
          String(course.classId) === String(savedCourseId))
    }

    // 如果有已保存的课程ID并且该课程在列表中，使用它
    if (savedCourseId && foundSavedCourse) {
      selectedCourseId.value = savedCourseId
      expandedCourses.value[savedCourseId] = true
    }
    // 否则选择并展开第一个课程
    else {
      selectedCourseId.value = courseList.value[0].classId
      expandedCourses.value[courseList.value[0].classId] = true
      localStorage.setItem('selectedCourseId', selectedCourseId.value)
    }
    // 输出当前展开状态
    console.log("课程展开状态:", expandedCourses.value)
  }
}

// 开始重命名
const startRename = (chat) => {
  // 设置所有对话为非编辑状态
  Object.keys(isEditing.value).forEach(key => {
    isEditing.value[key] = false
  })

  // 设置当前对话为编辑状态
  isEditing.value[chat.id] = true
  editNames.value[chat.id] = chat.name

  // 下一个渲染周期后聚焦输入框
  nextTick(() => {
    if (renameInput.value && renameInput.value.length) {
      renameInput.value[0].focus()
    }
  })
}

// 保存重命名
const saveRename = (chatId) => {
  if (isEditing.value[chatId]) {
    const newName = editNames.value[chatId]?.trim()
    if (newName) {
      emit('rename-conversation', chatId, newName)
    }
    isEditing.value[chatId] = false
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)

  // 获取当前日期
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // 判断是今天、昨天还是更早
  if (date >= today) {
    return '今天 ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (date >= yesterday) {
    return '昨天 ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

// 添加新方法来处理会话选择
const selectChat = (chat) => {
  // 确保选中的会话属于当前课程
  if (String(chat.class_id) === String(selectedCourseId.value)) {
    emit('select-chat', chat)
  } else {
    console.warn('尝试选择非当前课程的会话，已阻止', {
      chatId: chat.id,
      chatClassId: chat.class_id,
      selectedCourseId: selectedCourseId.value
    })
  }
}


// 监听会话列表变化 - 确保新会话设置课程ID
watch(
    () => props.conversations,
    (newConversations, oldConversations) => {
      if (!newConversations || newConversations.length === 0) return;

      // 如果是首次加载会话或会话数量有变化
      if (!oldConversations || oldConversations.length !== newConversations.length) {

        // 计算新增的会话
        const newlyAdded = oldConversations ?
            newConversations.filter(chat => !oldConversations.some(old => old.id === chat.id)) :
            newConversations;

        if (newlyAdded.length > 0) {

          // 为所有新会话设置当前选中的课程ID
          newlyAdded.forEach(chat => {
            if (!chat.class_id && selectedCourseId.value) {
              chat.class_id = selectedCourseId.value;
              console.log(`为新会话 "${chat.id}" 设置课程ID: ${selectedCourseId.value}`);
            }
          });
        }
      }
    },
    { deep: true }
)


// 修改初始化函数，只在class_id不存在时才分配
const initializeConversationsWithCourseId = () => {
  if (!props.conversations || !Array.isArray(props.conversations) || props.conversations.length === 0) {
    return;
  }
  // 根据课程列表分配会话
  if (courseList.value.length > 0) {
    const defaultCourseId = selectedCourseId.value || courseList.value[0].classId;
    let modified = false;
    // 只为没有class_id的会话分配默认课程ID
    props.conversations.forEach(chat => {
      // 记录原始状态
      const originalClassId = chat.class_id;

      // 只在class_id不存在时才设置
      if (!chat.class_id) {
        chat.class_id = defaultCourseId;
        modified = true;
      } else {
        console.log(`会话 "${chat.id}" 的课程ID未更改: ${originalClassId}`);
      }
    });

    if (modified) {
      console.log("部分会话课程关联已更新");
    } else {
      console.log("所有会话已有课程关联，无需修改");
    }
  }
}


// 组件挂载时获取课程列表
onMounted(async () => {
  await fetchCourseList();
  initCourseState();

  // 初始化会话的课程关联
  initializeConversationsWithCourseId();

  console.log("组件挂载完成，当前会话列表:", props.conversations);
})
</script>

<style scoped>
.chat-history {
  margin-top: 0.5rem;
  overflow-y: auto;
  max-height: calc(100vh - 300px);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
}

/* 课程列表样式 */
.courses-container {
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  padding-bottom: 0.5rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:global(.dark) .section-title {
  color: #9ca3af;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.course-header {
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: rgba(243, 244, 246, 0.7);
  border: 1px solid transparent;
}

.course-header:hover {
  background-color: rgba(229, 231, 235, 0.7);
}

.course-header.active {
  background-color: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
}

.course-info {
  display: flex;
  align-items: center;
}

.expand-icon {
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #4b5563;
  transition: transform 0.2s ease;
}

.course-name {
  flex: 1;
  font-weight: 600;
  font-size: 0.9rem;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-count {
  background-color: rgba(209, 213, 219, 0.5);
  color: #4b5563;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  min-width: 24px;
  text-align: center;
}

/* 会话组样式 */
.conversation-groups {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.conversation-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.conversation-group-header {
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0 0.5rem;
  margin-bottom: 0.25rem;
}

.chat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.chat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chat-item:hover::before {
  opacity: 0.5;
}

.chat-item.active {
  background-color: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.chat-item.active::before {
  opacity: 1;
}

.chat-info {
  flex: 1;
  margin-right: 1rem;
  overflow: hidden;
}

.chat-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 0.7rem;
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-item:hover .chat-actions {
  opacity: 1;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}


.rename-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}


.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: rgb(239, 68, 68);
}

.rename-input {
  width: 100%;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  background-color: white;
  color: #111827;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
  margin-top: 0.5rem;
}

.empty-state svg {
  margin-bottom: 0.75rem;
  opacity: 0.5;
}

.empty-hint {
  font-size: 0.75rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}

.empty-state-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-size: 0.8rem;
}

.empty-state-small svg {
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.loading-container-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-size: 0.8rem;
}

.loading-spinner-small {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 动画效果 */
.chat-item-enter-active,
.chat-item-leave-active {
  transition: all 0.3s ease;
}

.chat-item-enter-from,
.chat-item-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 删除动画 */
.deleting {
  animation: deleteAnimation 0.3s ease forwards;
}

@keyframes deleteAnimation {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-100%);
    height: 0;
    margin: 0;
    padding: 0;
  }
}



.course-conversation-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.course-header {
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: rgba(243, 244, 246, 0.7);
  border: 1px solid transparent;
}

.course-header:hover {
  background-color: rgba(229, 231, 235, 0.7);
}

.course-header.active {
  background-color: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
}

.course-info {
  display: flex;
  align-items: center;
}

.expand-icon {
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #4b5563;
  transition: transform 0.2s ease;
}

.course-name {
  flex: 1;
  font-weight: 600;
  font-size: 0.9rem;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-count {
  background-color: rgba(209, 213, 219, 0.5);
  color: #4b5563;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  min-width: 24px;
  text-align: center;
}

.conversation-list {
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
