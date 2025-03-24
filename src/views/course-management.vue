<template>
  <div class="course-management-container">
    <!-- 当选择了课程时显示分析仪表盘 -->
    <div v-if="adminActiveTab === 'course' && selectedClass" class="analytics-dashboard-wrapper">
      <div class="dashboard-header">
        <h3>{{ selectedClass.className }} - 课程数据分析</h3>
        <el-button size="small" type="primary" @click="toggleDashboardView">
          <el-icon><component :is="showDashboard ? 'Grid' : 'DataAnalysis'" /></el-icon>
          {{ showDashboard ? '返回学生列表' : '查看数据分析' }}
        </el-button>
      </div>

      <!-- 切换显示仪表盘或学生列表 -->
      <div v-if="showDashboard" class="dashboard-view">
        <AnalyticsDashboard :classId="selectedClass.classId" />
      </div>
      <div v-else class="student-list-view">
        <!-- 原有的学生列表内容 -->
        <div class="student-management-panel">
          <div class="panel-header">
            <div class="panel-title">
              <h4>{{ selectedClass.className }}</h4>
              <div class="panel-subtitle">学生名单</div>
            </div>
            <div class="panel-actions">
              <el-button type="primary" size="small" @click="showAddStudentsModal">
                <el-icon><UserPlus /></el-icon>
                添加学生
              </el-button>
            </div>
          </div>

          <div v-if="isLoadingStudents" class="loading-container small">
            <el-skeleton :rows="5" animated />
          </div>

          <div v-else-if="classStudents.length === 0" class="empty-state small">
            <el-empty description="课程暂无学生，请点击添加学生按钮添加" />
          </div>

          <!-- Student list with multi-select, avatars, and pagination -->
          <div v-else class="student-list">
            <!-- Student list header with select all checkbox and batch actions -->
            <div class="student-list-header">
              <div class="student-selection">
                <el-checkbox
                    :model-value="selectAllStudents"
                    @update:model-value="newValue => $emit('update:selectAllStudents', newValue)"
                    @change="toggleSelectAllStudents"
                    label="全选"
                />
              </div>
              <el-button
                  v-if="selectedStudents.length > 0"
                  type="danger"
                  size="small"
                  @click="batchRemoveStudents"
              >
                <el-icon><UserRemove /></el-icon>
                批量移除 ({{ selectedStudents.length }})
              </el-button>
            </div>

            <!-- Student grid with avatars and checkboxes -->
            <div class="student-grid">
              <div
                  v-for="student in classStudents"
                  :key="student.studentId"
                  class="student-card"
                  :class="{ 'selected': selectedStudents.includes(student.studentId) }"
              >
                <div class="student-selection-checkbox">
                  <el-checkbox
                      :model-value="selectedStudents.includes(student.studentId)"
                      @update:model-value="updateSelectedStudents(student.studentId, $event)"
                      :label="student.studentId"
                  />
                </div>

                <!-- Student avatar with color based on name -->
                <div class="student-avatar" :style="{ backgroundColor: getAvatarColor(student.studentName) }">
                  {{ getInitials(student.studentName) }}
                </div>

                <div class="student-info">
                  <div class="student-name">{{ student.studentName }}</div>
                  <div class="student-details">
                    <span class="student-id">学号: {{ student.studentNo || student.studentId }}</span>
                    <span class="student-class">班级: {{ student.className }}</span>
                  </div>
                </div>

                <el-button type="danger" size="small" @click="removeStudentFromClass(student)">
                  <el-icon><UserRemove /></el-icon>
                  移除
                </el-button>
              </div>
            </div>

            <!-- Pagination controls -->
            <el-pagination
                :current-page="studentCurrentPage"
                @update:current-page="$emit('update:studentCurrentPage', $event)"
                :page-size="10"
                layout="prev, pager, next"
                  :total="studentTotalPages * 10"
                  @current-change="changeStudentPage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="adminActiveTab === 'student'" class="student-management-panel empty-panel">
      <div class="empty-panel-content">
        <el-icon><Document /></el-icon>
        <p>请从左侧选择一个课程查看学生名单</p>
      </div>
    </div>
    <!-- 当未选择课程时显示原有内容 -->
    <div v-else-if="adminActiveTab === 'course' && !selectedClass" class="student-management-panel empty-panel">
      <div class="empty-panel-content">
        <el-icon><Document /></el-icon>
        <p>请从左侧选择一个课程查看学生名单</p>
      </div>
    </div>

    <!-- 其他标签页内容保持不变 -->
    <div v-else-if="adminActiveTab === 'knowledge'" class="admin-panel">
      <div class="admin-panel-header">
        <h3>知识库列表</h3>
        <el-button type="primary" @click="showCreateKnowledgeBaseModal">
          <el-icon><Plus /></el-icon>
          创建知识库
        </el-button>
      </div>

      <div v-if="isLoadingKnowledgeBases" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="knowledgeBases.length === 0" class="empty-state">
        <el-empty description="暂无知识库，请点击上方按钮创建" />
      </div>

      <div v-else class="knowledge-list">
        <!-- 知识库列表内容 -->
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AnalyticsDashboard from '@/components/AnalyticsDashboard.vue';
import {
  UserPlus, UserRemove,
  Document, Plus
} from '@element-plus/icons-vue';

// Props
const props = defineProps({
  // 从父组件传递的属性
  adminActiveTab: {
    type: String,
    required: true
  },
  selectedClass: {
    type: Object,
    default: null
  },
  classStudents: {
    type: Array,
    default: () => []
  },
  isLoadingStudents: {
    type: Boolean,
    default: false
  },
  studentCurrentPage: {
    type: Number,
    default: 1
  },
  studentTotalPages: {
    type: Number,
    default: 1
  },
  selectedStudents: {
    type: Array,
    default: () => []
  },
  selectAllStudents: {
    type: Boolean,
    default: false
  },
  knowledgeBases: {
    type: Array,
    default: () => []
  },
  isLoadingKnowledgeBases: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits([
  'show-add-students-modal',
  'toggle-select-all-students',
  'toggle-student-selection',
  'batch-remove-students',
  'remove-student',
  'change-student-page',
  'show-create-kb-modal'
]);

// 状态
const showDashboard = ref(false);

// 方法
// 切换仪表盘和学生列表视图
function toggleDashboardView() {
  showDashboard.value = !showDashboard.value;
}

// 以下方法通过emit传递给父组件处理
function showAddStudentsModal() {
  emit('show-add-students-modal');
}

function toggleSelectAllStudents() {
  emit('toggle-select-all-students');
}

function batchRemoveStudents() {
  emit('batch-remove-students');
}

function removeStudentFromClass(student) {
  emit('remove-student', student);
}

function changeStudentPage(page) {
  emit('change-student-page', page);
}

function showCreateKnowledgeBaseModal() {
  emit('show-create-kb-modal');
}

// 辅助方法
function getAvatarColor(name) {
  if (!name) return '#3b82f6';

  // 生成基于名称的一致颜色
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 转换为十六进制颜色
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#14b8a6', // teal
    '#6366f1'  // indigo
  ];

  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name) {
  if (!name) return '?';
  return name.charAt(0);
}
</script>

<style scoped>
.course-management-container {
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #e6e6e6;
}

.dashboard-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.dashboard-view {
  height: calc(100vh - 200px);
  overflow: auto;
}

.analytics-dashboard-wrapper {
  width: 100%;
  height: 100%;
}

/* 保留原有样式 */
.student-management-panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 100%;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-title h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.panel-subtitle {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.empty-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-panel-content {
  text-align: center;
  color: #666;
}

.empty-panel-content .el-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #ccc;
}

.empty-panel-content p {
  font-size: 16px;
}

.loading-container {
  padding: 20px 0;
}

.loading-container.small {
  padding: 10px 0;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.empty-state.small {
  padding: 20px 0;
}

.student-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.student-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.student-card {
  position: relative;
  background: #f9fafb;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.student-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.student-card.selected {
  background: rgba(59, 130, 246, 0.05);
  border-color: rgba(59, 130, 246, 0.3);
}

.student-selection-checkbox {
  position: absolute;
  top: 10px;
  right: 10px;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.student-info {
  flex: 1;
}

.student-name {
  font-weight: 600;
  margin-bottom: 5px;
}

.student-details {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

