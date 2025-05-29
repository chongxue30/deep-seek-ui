<template>
  <div class="admin-panel">
    <div class="admin-panel-header">
      <h3>教学设计管理</h3>
      <button class="action-button primary" @click="showGenerateDesignModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        生成教学设计
      </button>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载教学设计...</p>
    </div>

    <div v-else-if="!designList || designList.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      <p>暂无教学设计</p>
      <button class="action-button" @click="showGenerateDesignModal">创建教学设计</button>
    </div>

    <div v-else class="design-list">
      <div v-for="design in designList" :key="design.id" class="design-card">
        <div class="design-card-header">
          <h4 class="design-title">{{ design.title }}</h4>
          <div class="design-status" :class="getStatusClass(design.status)">
            {{ getStatusText(design.status) }}
          </div>
        </div>
        <div class="design-card-info">
          <div class="info-row">
            <span class="label">版本:</span>
            <span class="value">V{{ design.version || '1' }}</span>
          </div>
          <div class="info-row">
            <span class="label">更新时间:</span>
            <span class="value">{{ formatDateTime(design.updateTime) }}</span>
          </div>
        </div>
        <div class="design-card-actions">
          <button class="card-action-btn view-btn" @click="viewDesign(design.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            查看
          </button>
          <button v-if="isTeacher" class="card-action-btn delete-btn" @click="confirmDeleteDesign(design.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 教学设计查看器 -->
    <TeachingDesignViewerModal
        v-model:visible="viewerVisible"
        :design-id="currentDesignId"
        @close="viewerVisible = false"
    />

    <!-- 生成教学设计对话框 -->
    <div v-if="generateModalVisible" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>生成教学设计</h3>
          <button class="close-btn" @click="generateModalVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="design-title">教学设计标题</label>
            <input id="design-title" v-model="newDesign.title" type="text" placeholder="请输入教学设计标题">
          </div>
          <div class="form-group">
            <label for="design-prompt">AI提示词（可选）</label>
            <textarea id="design-prompt" v-model="newDesign.prompt" rows="4" placeholder="请输入AI提示词，用于指导生成更精确的教学设计内容"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="generateModalVisible = false">取消</button>
          <button class="submit-btn" @click="generateDesign" :disabled="isGenerating">
            {{ isGenerating ? '生成中...' : '开始生成' }}
          </button>
        </div>
        <div v-if="isGenerating" class="generation-progress">
          <div class="progress-bar">
            <div class="progress-indicator" :style="{ width: generationProgress + '%' }"></div>
          </div>
          <div class="progress-text">{{ generationStatus }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import TeachingDesignViewerModal from '@/components/TeachingDesignViewerModal.vue';

const props = defineProps({
  courseId: {
    type: [String, Number],
    required: true
  },
  isTeacher: {
    type: Boolean,
    default: false
  },
  courseName: {
    type: String,
    default: ''
  },
  showNotification: {
    type: Function,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const designList = ref([]);
const isLoading = ref(false);
const viewerVisible = ref(false);
const currentDesignId = ref(null);
const generateModalVisible = ref(false);
const isGenerating = ref(false);
const generationProgress = ref(0);
const generationStatus = ref('');
const newDesign = ref({
  title: '',
  prompt: ''
});

const statusMap = [
  { value: 0, text: '草稿', class: 'status-draft' },
  { value: 1, text: '已完成', class: 'status-completed' }
];

// 加载教学设计列表
const loadDesignList = async () => {
  if (!props.courseId) return;

  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/dev-api/system/design/list?courseId=${props.courseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('获取教学设计列表失败');
    }

    const result = await response.json();
    designList.value = result.rows || [];
  } catch (error) {
    console.error('加载教学设计列表失败:', error);
    props.showNotification('加载教学设计列表失败: ' + error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

// 查看教学设计
const viewDesign = (id) => {
  currentDesignId.value = id;
  viewerVisible.value = true;
};

// 显示生成教学设计对话框
const showGenerateDesignModal = () => {
  if (!props.isTeacher) {
    props.showNotification('您没有权限执行此操作', 'error');
    return;
  }

  // 重置表单
  newDesign.value = {
    title: '',
    prompt: ''
  };

  // 重置生成状态
  isGenerating.value = false;
  generationProgress.value = 0;
  generationStatus.value = '';

  generateModalVisible.value = true;
};


// 生成教学设计
// 生成教学设计
const generateDesign = async () => {
  if (!newDesign.value.title) {
    props.showNotification('请输入教学设计标题', 'error');
    return;
  }

  isGenerating.value = true;
  generationProgress.value = 5; // 开始进度
  generationStatus.value = '正在准备生成...';

  // 进度条模拟定时器
  let progressTimer = null;

  // 启动模拟进度定时器
  progressTimer = setInterval(() => {
    // 随机增长3-13%
    const increment = 3 + Math.floor(Math.random() * 10);

    // 确保不超过99%
    if (generationProgress.value < 99) {
      generationProgress.value = Math.min(99, generationProgress.value + increment);
    }

    // 根据进度更新状态文本
    if (generationProgress.value < 30) {
      generationStatus.value = '正在分析课程内容...';
    } else if (generationProgress.value < 60) {
      generationStatus.value = '正在生成教学设计...';
    } else if (generationProgress.value < 90) {
      generationStatus.value = '正在优化教学内容...';
    } else {
      generationStatus.value = '即将完成...';
    }
  }, 2000);

  try {
    const token = localStorage.getItem('token');
    const userInfoStr = localStorage.getItem('userInfo');
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

    // 使用POST请求 + 读取流的方式处理SSE
    const response = await fetch('/dev-api/teaching/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject: props.courseName,
        teacherId: userInfo.userId,
        classId: props.courseId,
        title: newDesign.value.title
      })
    });

    if (!response.ok) {
      throw new Error('生成教学设计请求失败');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // 循环读取流数据
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // 解码收到的数据并添加到缓冲区
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // 处理缓冲区中的完整事件
      const events = buffer.split('\n\n');
      buffer = events.pop() || ''; // 保留最后一个可能不完整的事件

      // 处理每个完整的事件
      for (const event of events) {
        const lines = event.split('\n');
        const eventType = lines.find(line => line.startsWith('event:'))?.substring(6);
        const dataLine = lines.find(line => line.startsWith('data:'));

        if (eventType && dataLine) {
          const data = JSON.parse(dataLine.substring(5));

          if (eventType === 'design_saved') {
            // 设计已保存，清除定时器并设置进度为100%
            clearInterval(progressTimer);
            if (data.status === 'success') {
              generationProgress.value = 100;
              generationStatus.value = '教学设计生成完成!';
              props.showNotification('教学设计已成功生成!', 'success');

              // 关闭弹窗并刷新列表
              setTimeout(() => {
                generateModalVisible.value = false;
                loadDesignList();
              }, 1000);
            } else {
              throw new Error(data.message || '教学设计生成失败');
            }
          }
        }
      }
    }

  } catch (error) {
    // 清除定时器
    if (progressTimer) clearInterval(progressTimer);
    console.error('生成教学设计失败:', error);
    props.showNotification('生成教学设计失败: ' + error.message, 'error');
  } finally {
    // 如果异常中断，清除定时器并设置状态
    if (generationProgress.value < 100) {
      if (progressTimer) clearInterval(progressTimer);
      isGenerating.value = false;
    }
  }
};


// 确认删除教学设计
const confirmDeleteDesign = (id) => {
  if (!props.isTeacher) {
    props.showNotification('您没有权限执行此操作', 'error');
    return;
  }

  if (confirm('确定要删除此教学设计吗？此操作不可恢复。')) {
    deleteDesign(id);
  }
};

// 删除教学设计
const deleteDesign = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/dev-api/system/design/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('删除教学设计失败');
    }

    props.showNotification('教学设计已删除', 'success');
    loadDesignList();
  } catch (error) {
    console.error('删除教学设计失败:', error);
    props.showNotification('删除教学设计失败: ' + error.message, 'error');
  }
};

// 获取状态文本
const getStatusText = (status) => {
  const statusObj = statusMap.find(item => item.value === Number(status));
  return statusObj ? statusObj.text : '未知状态';
};

// 获取状态类名
const getStatusClass = (status) => {
  const statusObj = statusMap.find(item => item.value === Number(status));
  return statusObj ? statusObj.class : '';
};

// 格式化日期时间
const formatDateTime = (dateStr) => {
  if (!dateStr) return '未设置';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateStr;
  }
};

// 获取部分名称
const getSectionName = (section) => {
  const sectionNames = {
    overview: '课程概述和设计目标',
    chapters: '课程章节',
    assessment: '考核方案',
    scoring: '评分标准',
    outcome: '预计成果'
  };
  return sectionNames[section] || section;
};

onMounted(() => {
  loadDesignList();
});
</script>

<style scoped>
/* 管理面板基础样式 */
.admin-panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.admin-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.admin-panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 按钮样式 */
.action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  color: #666;
}

.action-button:hover {
  background-color: #f5f5f5;
  border-color: #c0c0c0;
}

.action-button.primary {
  background-color: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.action-button.primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #666;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #1890ff;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.empty-state svg {
  margin-bottom: 16px;
  color: #d9d9d9;
}

.empty-state p {
  margin-bottom: 16px;
  font-size: 16px;
}

/* 设计列表网格 */
.design-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* 设计卡片样式 */
.design-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
}

.design-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.design-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}

.design-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 状态标签 */
.design-status {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-draft {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-completed {
  background-color: #f6ffed;
  color: #52c41a;
}

/* 卡片信息区域 */
.design-card-info {
  flex: 1;
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  margin-bottom: 6px;
  font-size: 14px;
}

.info-row .label {
  color: #8c8c8c;
  margin-right: 8px;
  min-width: 70px;
}

.info-row .value {
  color: #595959;
  flex: 1;
}

/* 卡片操作区域 */
.design-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.card-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.view-btn {
  color: #1890ff;
  background-color: #e6f7ff;
  border-color: transparent;
}

.view-btn:hover {
  background-color: #bae7ff;
}

.delete-btn {
  color: #ff4d4f;
  background-color: #fff1f0;
  border-color: transparent;
}

.delete-btn:hover {
  background-color: #ffccc7;
}

/* 生成对话框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 90%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  color: #999;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #40a9ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
  line-height: 1.5;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn {
  padding: 8px 16px;
  background-color: #1890ff;
  color: #fff;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  background-color: #40a9ff;
}

.submit-btn:disabled {
  background-color: #bae7ff;
  cursor: not-allowed;
}

/* 生成进度条 */
.generation-progress {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.progress-bar {
  height: 6px;
  background-color: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-indicator {
  height: 100%;
  background-color: #1890ff;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #666;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .design-list {
    grid-template-columns: 1fr;
  }

  .modal-container {
    width: 95%;
  }
}

</style>
