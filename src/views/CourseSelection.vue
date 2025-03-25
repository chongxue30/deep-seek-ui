<template>
  <div class="course-selection-container">
    <div class="course-selection-card">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h3>出错了</h3>
        <p>{{ error }}</p>
        <button class="action-button" @click="goToLogin">返回登录</button>
      </div>

      <div v-else>
        <h2>选择课程</h2>
        <p class="description">请选择一个课程以继续进入聊天</p>

        <div v-if="courses.length > 0" class="course-selection">
          <div class="form-group">
            <label for="course-select">课程</label>
            <select
                id="course-select"
                v-model="selectedCourseId"
                class="form-input"
            >
              <option value="">请选择课程</option>
              <option
                  v-for="course in courses"
                  :key="course.classId"
                  :value="course.classId"
              >
                {{ course.className }}
              </option>
            </select>
          </div>

          <button
              class="action-button primary"
              :disabled="!selectedCourseId"
              @click="proceedToChat"
          >
            进入聊天
          </button>
        </div>

        <div v-else class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          <p>您尚未加入任何课程</p>
          <button class="action-button" @click="goToDashboard">
            返回首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(true);
const error = ref(null);
const studentId = ref(null);
const courses = ref([]);
const selectedCourseId = ref('');

// 检查用户是否已登录并获取用户信息
onMounted(async () => {
  try {
    loading.value = true;

    // 从localStorage获取用户信息
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
      // 未登录，重定向到登录页
      router.push('/login');
      return;
    }

    const userInfo = JSON.parse(userInfoStr);

    // 检查用户是否为学生
    const isStudent = userInfo.roles?.some(role => role.roleKey === 'stu');

    if (!isStudent) {
      // 如果不是学生，直接进入聊天页面
      router.push('/chat');
      return;
    }

    // 获取学生ID
    await fetchStudentId(userInfo.userName);

  } catch (err) {
    console.error('认证错误:', err);
    error.value = '认证失败，请重新登录';
  } finally {
    loading.value = false;
  }
});

// 获取学生ID
const fetchStudentId = async (userName) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch('/dev-api/system/student/byUserName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        studentNo: userName
      })
    });

    if (!response.ok) {
      throw new Error('获取学生信息失败');
    }

    const data = await response.json();

    // 修改这部分逻辑：API返回的data.data是一个对象，而不是数组
    if (data.code === 200 && data.data) {
      // 直接使用返回的学生数据
      const studentRecord = data.data;

      // 验证studentNo匹配
      if (studentRecord.studentNo === userName) {
        studentId.value = studentRecord.studentId;
        // 获取到studentId后，获取学生课程
        await fetchStudentCourses(studentRecord.studentId);
      } else {
        error.value = '学生学号不匹配';
      }
    } else {
      error.value = '未找到学生记录';
    }
  } catch (err) {
    console.error('获取学生ID失败:', err);
    error.value = '获取学生信息失败';
  }
};

// 获取学生课程
const fetchStudentCourses = async (studentId) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`/dev-api/system/stu/listClass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        studentId: studentId
      })
    });

    if (!response.ok) {
      throw new Error('获取学生课程失败');
    }

    const data = await response.json();

    if (data.code === 200 && Array.isArray(data.rows)) {
      courses.value = data.rows;

      // 如果只有一个课程，自动选择
      if (data.rows.length === 1) {
        selectedCourseId.value = data.rows[0].classId;
      }
    } else {
      courses.value = [];
    }
  } catch (err) {
    console.error('获取学生课程失败:', err);
    error.value = '获取课程失败';
  }
};

// 进入聊天
const proceedToChat = () => {
  if (selectedCourseId.value) {
    // 将选择的课程ID存储在localStorage中，以便在聊天中使用
    localStorage.setItem('selectedCourseId', selectedCourseId.value);

    // 导航到聊天页面
    router.push('/chat');
  }
};

// 返回登录页
const goToLogin = () => {
  router.push('/login');
};

// 返回首页
const goToDashboard = () => {
  router.push('/');
};
</script>

<style scoped>
.course-selection-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1rem;
}

.course-selection-card {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.description {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.course-selection {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 16px;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  color: #4b5563;
}

.action-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  transform: translateY(-1px);
}

.action-button.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
}

.action-button.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.loading-container, .error-container, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  color: #ef4444;
}

.error-container svg {
  color: #ef4444;
  margin-bottom: 1rem;
}

.empty-state {
  color: #6b7280;
}

.empty-state svg {
  color: #9ca3af;
  margin-bottom: 1rem;
}
</style>
