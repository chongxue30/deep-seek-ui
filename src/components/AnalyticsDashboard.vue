<template>
  <div class="dashboard-wrapper">
    <!-- 动画背景 -->
    <div class="animated-bg">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
      <div class="geometric-shape shape-1"></div>
      <div class="geometric-shape shape-2"></div>
      <div class="geometric-shape shape-3"></div>
      <div class="geometric-shape shape-4"></div>
    </div>

    <!-- 头部 -->
    <header class="premium-header">
      <div class="logo-area">
        <div class="logo-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <div class="logo-text">
          <h1>课程问答 <span>分析平台</span></h1>
        </div>
      </div>
      <div class="header-tabs">
<!--        <div class="tab active">-->
<!--          <el-icon><DataAnalysis /></el-icon>-->
<!--          <span>数据分析</span>-->
<!--        </div>-->
<!--        <div class="tab">-->
<!--          <el-icon><User /></el-icon>-->
<!--          <span>学生管理</span>-->
<!--        </div>-->
<!--        <div class="tab">-->
<!--          <el-icon><Setting /></el-icon>-->
<!--          <span>系统设置</span>-->
<!--        </div>-->
      </div>
      <div class="header-actions">
        <el-tooltip content="刷新数据" placement="bottom">
          <el-button
              type="primary"
              plain
              size="small"
              class="action-btn refresh-btn"
              @click="refreshData"
              :loading="isLoading"
          >
            <el-icon><Refresh /></el-icon>
            <span>刷新数据</span>
          </el-button>
        </el-tooltip>
<!--        <el-dropdown @command="handleCommand">-->
<!--          <el-button type="info" plain size="small" class="action-btn">-->
<!--            <el-icon><More /></el-icon>-->
<!--          </el-button>-->
<!--          <template #dropdown>-->
<!--            <el-dropdown-menu>-->
<!--              <el-dropdown-item command="exportData">-->
<!--                <el-icon><Download /></el-icon> 导出数据-->
<!--              </el-dropdown-item>-->
<!--              <el-dropdown-item command="settings">-->
<!--                <el-icon><Setting /></el-icon> 设置-->
<!--              </el-dropdown-item>-->
<!--              <el-dropdown-item command="help">-->
<!--                <el-icon><QuestionFilled /></el-icon> 帮助-->
<!--              </el-dropdown-item>-->
<!--            </el-dropdown-menu>-->
<!--          </template>-->
<!--        </el-dropdown>-->
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="dashboard-content" v-loading="isFullscreenLoading">
      <!-- 顶部统计卡片 -->
      <div class="stats-overview">
        <div
            class="stat-card"
            v-for="(stat, index) in statsData"
            :key="index"
            :class="`stat-card-${index+1}`"
            @mouseenter="onStatHover(index)"
            @mouseleave="onStatLeave(index)"
        >
          <div class="stat-icon-wrapper">
            <el-icon><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">
              <count-to
                  :start-val="0"
                  :end-val="stat.value"
                  :duration="2000"
                  :decimals="0"
                  separator=","
                  ref="countTo"
              ></count-to>
            </div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-trend" v-if="stat.trend !== undefined">
              <el-icon v-if="stat.trend > 0"><CaretTop /></el-icon>
              <el-icon v-else-if="stat.trend < 0"><CaretBottom /></el-icon>
              <el-icon v-else><Minus /></el-icon>
              <span :class="stat.trend > 0 ? 'trend-up' : stat.trend < 0 ? 'trend-down' : 'trend-neutral'">
                {{ Math.abs(stat.trend) }}%
              </span>
            </div>
          </div>
          <div class="stat-chart">
            <div class="sparkline" :id="`sparkline-${index}`"></div>
          </div>
        </div>
      </div>

      <!-- 主仪表盘网格 -->
      <div class="dashboard-grid">
        <!-- 左列 -->
        <div class="dashboard-column left-column">
          <!-- 问题类型分布 -->
          <div class="dashboard-panel question-types-panel">
            <div class="panel-header">
              <h3><el-icon><PieChart /></el-icon> 问题类型分布</h3>
              <div class="panel-actions">
                <el-tooltip content="查看详情" placement="top">
                  <el-icon class="action-icon"><FullScreen /></el-icon>
                </el-tooltip>
              </div>
            </div>
            <div class="panel-body">
              <div ref="questionTypeChartRef" class="chart-container"></div>
            </div>
          </div>

          <!-- 复杂度分布 -->
          <div class="dashboard-panel complexity-panel">
            <div class="panel-header">
              <h3><el-icon><DataAnalysis /></el-icon> 问题复杂度分布</h3>
              <div class="panel-actions">
                <el-tooltip content="查看详情" placement="top">
                  <el-icon class="action-icon"><FullScreen /></el-icon>
                </el-tooltip>
              </div>
            </div>
            <div class="panel-body">
              <div ref="complexityChartRef" class="chart-container"></div>
            </div>
          </div>
        </div>

        <!-- 中间列 -->
        <div class="dashboard-column center-column">
          <!-- 每日趋势图 -->
          <div class="dashboard-panel trend-panel">
            <div class="panel-header">
              <h3><el-icon><TrendCharts /></el-icon> 提问趋势分析</h3>
<!--              <div class="panel-actions">-->
<!--                <el-radio-group v-model="trendTimeRange" size="small">-->
<!--                  <el-radio-button label="7">7天</el-radio-button>-->
<!--                  <el-radio-button label="14">14天</el-radio-button>-->
<!--                  <el-radio-button label="30">30天</el-radio-button>-->
<!--                </el-radio-group>-->
<!--              </div>-->
            </div>
            <div class="panel-body">
              <div ref="dailyTrendChartRef" class="chart-container"></div>
            </div>
          </div>

          <!-- 学科分布 -->
          <div class="dashboard-panel subjects-panel">
            <div class="panel-header">
              <h3><el-icon><Collection /></el-icon> 学科分布</h3>
              <div class="panel-actions">
                <el-tooltip content="查看详情" placement="top">
                  <el-icon class="action-icon"><FullScreen /></el-icon>
                </el-tooltip>
              </div>
            </div>
            <div class="panel-body">
              <div ref="subjectChartRef" class="chart-container"></div>
            </div>
          </div>
        </div>

        <!-- 右列 -->
        <div class="dashboard-column right-column">
          <!-- 活跃学生 -->
          <div class="dashboard-panel students-panel">
            <div class="panel-header">
              <h3><el-icon><User /></el-icon> 活跃学生</h3>
              <div class="panel-actions">
                <el-tooltip content="查看全部" placement="top">
                  <el-icon class="action-icon"><More /></el-icon>
                </el-tooltip>
              </div>
            </div>
            <div class="panel-body">
              <div class="student-list">
                <div
                    v-for="(student, index) in activeStudents"
                    :key="student.userName"
                    class="student-item"
                    :class="{ 'top-student': index === 0 }"
                    @click="showStudentProfile(student.userName)"
                >
                  <div class="student-avatar" :style="{ background: getAvatarGradient(index) }">
                    {{ student.userName.charAt(0) }}
                  </div>
                  <div class="student-info">
                    <div class="student-name">{{ student.userName }}</div>
                    <div class="student-subject">{{ student.mainSubject }}</div>
                  </div>
                  <div class="student-stats">
                    <div class="student-questions">
                      <el-icon><ChatDotRound /></el-icon>
                      <span>{{ student.totalQuestions }}</span>
                    </div>
                    <div class="student-score">
                      <el-progress
                          :percentage="student.learningScore"
                          :color="getLearningScoreColor(student.learningScore)"
                          :stroke-width="4"
                          :show-text="false"
                      ></el-progress>
                      <span>{{ student.learningScore }}分</span>
                    </div>
                  </div>
                </div>
                <div v-if="activeStudents.length === 0" class="no-data">
                  <el-icon><User /></el-icon>
                  <span>暂无活跃学生数据</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 热门关键词 -->
          <div class="dashboard-panel keywords-panel">
            <div class="panel-header">
              <h3><el-icon><Collection /></el-icon> 热门关键词</h3>
              <div class="panel-actions">
                <el-tooltip content="查看全部" placement="top">
                  <el-icon class="action-icon"><More /></el-icon>
                </el-tooltip>
              </div>
            </div>
            <div class="panel-body">
              <div class="keywords-cloud">
                <div
                    v-for="(keyword, index) in hotKeywords"
                    :key="keyword.keyword"
                    class="keyword-item"
                    :style="{
                    fontSize: getTagSize(keyword.frequency) + 'px',
                    opacity: 0.7 + (keyword.frequency / 100) * 0.3,
                    animationDelay: `${index * 0.1}s`,
                    background: getKeywordBackground(index, keyword.frequency)
                  }"
                    @mouseenter="onKeywordHover"
                    @mouseleave="onKeywordLeave"
                >
                  {{ keyword.keyword }}
                  <span class="keyword-count">{{ keyword.frequency }}</span>
                </div>
                <div v-if="hotKeywords.length === 0" class="no-data">
                  <el-icon><Collection /></el-icon>
                  <span>暂无关键词数据</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 浮动操作按钮 -->
      <div class="floating-action-btn" @click="showStudentSearch = true">
        <el-icon><Search /></el-icon>
      </div>
    </main>

    <!-- 学生查询对话框 -->
    <el-dialog
        title="学生学情画像查询"
        v-model="showStudentSearch"
        width="80%"
        class="student-search-dialog"
        destroy-on-close
        append-to-body
    >
      <div class="search-form">
        <el-input
            v-model="profileForm.userName"
            placeholder="请输入学生用户名"
            clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button type="primary" @click="searchStudentProfile" :loading="searchingProfile">查询</el-button>
          </template>
        </el-input>
      </div>

      <div v-if="studentProfile.userName" class="student-profile">
        <div class="profile-header">
          <div class="profile-avatar">
            {{ studentProfile.userName.charAt(0) }}
          </div>
          <div class="profile-title">
            <h2>{{ studentProfile.userName }} 的学习画像</h2>
            <div class="profile-status" :class="getStatusClass(studentProfile.learningStatus)">
              {{ studentProfile.learningStatus }}
            </div>
          </div>
        </div>

        <div class="profile-content">
          <div class="profile-stats">
            <div class="profile-stat-card">
              <div class="stat-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ studentProfile.totalQuestions }}</div>
                <div class="stat-label">总提问数</div>
              </div>
            </div>
            <div class="profile-stat-card">
              <div class="stat-icon">
                <el-icon><Collection /></el-icon>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ studentProfile.mainSubject }}</div>
                <div class="stat-label">主要学科</div>
              </div>
            </div>
            <div class="profile-stat-card">
              <div class="stat-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ formatISODate(studentProfile.lastActiveTime) }}</div>
                <div class="stat-label">最后活跃</div>
              </div>
            </div>
          </div>

          <div class="profile-charts">
            <div class="profile-chart-container">
              <h3>问题复杂度分布</h3>
              <div ref="studentComplexityChartRef" class="profile-chart"></div>
            </div>
            <div class="profile-chart-container">
              <h3>学情分析</h3>
              <div class="learning-progress">
                <div class="progress-item" v-for="(item, index) in learningProgressItems" :key="index">
                  <div class="progress-label">
                    <span>{{ item.label }}</span>
<!--                    <span>{{ item.value }}%</span>-->
                  </div>
                  <el-progress
                      :percentage="item.value"
                      :color="item.color"
                      :stroke-width="8"
                  ></el-progress>
                </div>
              </div>
            </div>
          </div>

          <div class="profile-recommendations">
            <h3>学习建议</h3>
            <div class="recommendation-list">
              <div class="recommendation-item" v-for="(item, index) in recommendationItems" :key="index">
                <div class="recommendation-icon">
                  <el-icon><component :is="getRecommendationIcon(item.icon)" /></el-icon>
                </div>
                <div class="recommendation-content">
                  <div class="recommendation-title">{{ item.title }}</div>
                  <div class="recommendation-desc">{{ item.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="profileSearched" class="no-profile-data">
        <el-icon><WarningFilled /></el-icon>
        <h3>未找到学生数据</h3>
        <p>请检查用户名是否正确，或尝试搜索其他学生</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
// 引入外部样式文件
import '@/assets/styles/dashboard.scss';
import * as echarts from 'echarts';
import { ElMessage, ElNotification} from 'element-plus';
import {
  DataAnalysis, User, Setting, Refresh, More, Download,
  QuestionFilled, CaretTop, CaretBottom, Minus, PieChart, FullScreen,
  TrendCharts, Collection, ChatDotRound, Search, Calendar, WarningFilled
} from '@element-plus/icons-vue';
import {
  getStatistics,
  getQuestionTypes,
  getSubjects,
  getComplexityDistribution,
  getDailyTrend,
  getHotKeywords,
  getActiveStudents,
  getStudentProfile
} from '@/api/analyse/dashboard';

// Props
const props = defineProps({
  classId: {
    type: [String, Number],
    default: null
  }
});

// 状态
const statistics = ref({
  totalQuestions: 0,
  totalStudents: 0,
  totalSubjects: 0,
  todayQuestions: 0
});
const questionTypes = ref([]);
const subjects = ref([]);
const complexityData = ref({
  simple: 0,
  medium: 0,
  complex: 0
});
const dailyTrend = ref([]);
const hotKeywords = ref([]);
const activeStudents = ref([]);
const profileForm = reactive({
  userName: ''
});
const studentProfile = ref({});
const profileSearched = ref(false);
const charts = reactive({
  questionTypeChart: null,
  subjectChart: null,
  complexityChart: null,
  dailyTrendChart: null,
  studentComplexityChart: null,
  sparklines: []
});
const isLoading = ref(false);
const isFullscreenLoading = ref(false);
const showStudentSearch = ref(false);
const searchingProfile = ref(false);
const trendTimeRange = ref('14');
const hoveredStatIndex = ref(null);
const learningProgressItems = ref([]);
const recommendationItems = ref([]);

// DOM引用
const questionTypeChartRef = ref(null);
const complexityChartRef = ref(null);
const dailyTrendChartRef = ref(null);
const subjectChartRef = ref(null);
const studentComplexityChartRef = ref(null);
const countTo = ref(null);

// 颜色方案
const chartColors = [
  '#4361ee', '#3a86ff', '#4cc9f0', '#4895ef',
  '#560bad', '#7209b7', '#b5179e', '#f72585',
  '#f94144', '#f3722c', '#f8961e', '#f9c74f',
  '#90be6d', '#43aa8b', '#4d908e', '#577590'
];

// 趋势数据（模拟）
const trendData = [
  [10, 15, 20, 25, 23, 30, 35],
  [50, 45, 60, 70, 65, 75, 80],
  [12, 12, 12, 12, 13, 13, 12],
  [5, 10, 8, 15, 20, 25, 30]
];

// 计算属性
const statsData = computed(() => [
  {
    label: '总提问数',
    value: statistics.value.totalQuestions || 0,
    icon: 'ChatDotRound',
    trend: 12, // 模拟数据，实际应从API获取
    trendData: trendData[0]
  },
  {
    label: '参与学生',
    value: statistics.value.totalStudents || 0,
    icon: 'User',
    trend: 8,
    trendData: trendData[1]
  },
  {
    label: '学科分类',
    value: statistics.value.totalSubjects || 0,
    icon: 'Collection',
    trend: 0,
    trendData: trendData[2]
  },
  {
    label: '今日提问',
    value: statistics.value.todayQuestions || 0,
    icon: 'DataAnalysis',
    trend: -5,
    trendData: trendData[3]
  }
]);

// 格式化ISO日期字符串
const formatISODate = (isoString) => {
  if (!isoString) return '暂无记录';

  try {
    const date = new Date(isoString);
    // 检查日期是否有效
    if (isNaN(date.getTime())) return isoString;

    // 格式化为 YYYY-MM-DD HH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;

    // 或者使用本地化格式（更友好但格式可能因浏览器设置而异）
    // return date.toLocaleString();
  } catch (e) {
    console.error('日期格式化错误:', e);
    return isoString;
  }
}

// 生命周期钩子
onMounted(() => {
  getDashboardData();

  // 窗口大小变化时重新调整图表大小
  window.addEventListener('resize', resizeCharts);

  // 初始化动画
  initAnimations();

  // 初始化迷你趋势图
  nextTick(() => {
    initSparklines();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts);
  // 销毁图表实例
  Object.keys(charts).forEach(key => {
    if (charts[key]) {
      if (Array.isArray(charts[key])) {
        charts[key].forEach(chart => {
          if (chart) chart.dispose();
        });
      } else {
        charts[key].dispose();
      }
    }
  });
});

// 监听属性变化
watch(() => props.classId, (newVal) => {
  if (newVal) {
    getDashboardData();
  }
});

// 方法
// 初始化动画
function initAnimations() {
  // 触发数字计数动画
  if (countTo.value) {
    if (Array.isArray(countTo.value)) {
      countTo.value.forEach(item => {
        // 检查项目是否存在且有start方法
        if (item && typeof item.start === 'function') {
          item.start();
        }
      });
    } else if (countTo.value && typeof countTo.value.start === 'function') {
      countTo.value.start();
    }
  }
}


// 初始化迷你趋势图
function initSparklines() {
  charts.sparklines = [];

  statsData.value.forEach((stat, index) => {
    const sparklineEl = document.getElementById(`sparkline-${index}`);
    if (sparklineEl) {
      const sparkline = echarts.init(sparklineEl);

      const option = {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        xAxis: {
          type: 'category',
          show: false,
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          show: false,
          min: 'dataMin'
        },
        series: [{
          type: 'line',
          data: stat.trendData,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 2,
          lineStyle: {
            width: 2,
            color: getSparklineColor(index, stat.trend)
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: getSparklineColor(index, stat.trend, 0.2) },
              { offset: 1, color: getSparklineColor(index, stat.trend, 0.02) }
            ])
          },
          smooth: true
        }]
      };

      sparkline.setOption(option);
      charts.sparklines.push(sparkline);
    }
  });
}

// 获取迷你趋势图颜色
function getSparklineColor(index, trend, alpha = 1) {
  let baseColor;

  if (trend > 0) {
    baseColor = '#4caf50'; // 上升趋势 - 绿色
  } else if (trend < 0) {
    baseColor = '#f44336'; // 下降趋势 - 红色
  } else {
    baseColor = '#2196f3'; // 持平趋势 - 蓝色
  }

  if (alpha === 1) return baseColor;

  // 转换为rgba
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 获取头像渐变色
function getAvatarGradient(index) {
  const gradients = [
    'linear-gradient(135deg, #4361ee, #3a86ff)',
    'linear-gradient(135deg, #7209b7, #b5179e)',
    'linear-gradient(135deg, #f94144, #f3722c)',
    'linear-gradient(135deg, #43aa8b, #90be6d)',
    'linear-gradient(135deg, #f8961e, #f9c74f)'
  ];

  return gradients[index % gradients.length];
}

// 获取关键词背景色
function getKeywordBackground(index, frequency) {
  const colors = [
    ['#4361ee', '#3a86ff'],
    ['#7209b7', '#b5179e'],
    ['#f94144', '#f3722c'],
    ['#43aa8b', '#90be6d'],
    ['#f8961e', '#f9c74f']
  ];

  const colorPair = colors[index % colors.length];
  const intensity = Math.min(frequency / 100, 1) * 0.2 + 0.1;

  return `linear-gradient(135deg, ${colorPair[0]}${Math.round(intensity * 255).toString(16)}, ${colorPair[1]}${Math.round(intensity * 255).toString(16)})`;
}

// 获取推荐图标
function getRecommendationIcon(iconName) {
  switch (iconName) {
    case 'el-icon-reading':
      return 'Reading';
    case 'el-icon-cpu':
      return 'Cpu';
    case 'el-icon-data-line':
      return 'DataLine';
    default:
      return 'Reading';
  }
}

// 统计卡片悬停效果
function onStatHover(index) {
  hoveredStatIndex.value = index;
}

function onStatLeave() {
  hoveredStatIndex.value = null;
}

// 关键词悬停效果
function onKeywordHover(e) {
  e.currentTarget.style.transform = 'scale(1.1)';
  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  e.currentTarget.style.zIndex = '10';
}

function onKeywordLeave(e) {
  e.currentTarget.style.transform = 'scale(1)';
  e.currentTarget.style.boxShadow = '';
  e.currentTarget.style.zIndex = '';
}

// 下拉菜单命令处理
function handleCommand(command) {
  if (command === 'exportData') {
    ElMessage({
      message: '数据导出功能即将上线',
      type: 'info'
    });
  } else if (command === 'settings') {
    ElMessage({
      message: '设置功能即将上线',
      type: 'info'
    });
  } else if (command === 'help') {
    ElMessage({
      message: '帮助文档即将上线',
      type: 'info'
    });
  }
}

// 显示学生画像
function showStudentProfile(userName) {
  showStudentSearch.value = true;
  profileForm.userName = userName;
  nextTick(() => {
    searchStudentProfile();
  });
}

// 获取学习状态样式类
function getStatusClass(status) {
  if (status === '优秀' || status === '积极学习中') {
    return 'status-excellent';
  } else if (status === '良好') {
    return 'status-good';
  } else if (status === '需要关注') {
    return 'status-warning';
  } else {
    return 'status-normal';
  }
}

// 获取仪表盘数据
function getDashboardData() {
  isLoading.value = true;

  // 使用Promise.all并行获取所有数据
  Promise.all([
    getStatistics(props.classId),
    getQuestionTypes(props.classId),
    getSubjects(props.classId),
    getComplexityDistribution(props.classId),
    getDailyTrend(props.classId),
    getHotKeywords(props.classId),
    getActiveStudents(props.classId)
  ]).then(([statsRes, questionTypesRes, subjectsRes, complexityRes, dailyTrendRes, hotKeywordsRes, activeStudentsRes]) => {
    if (statsRes.code === 200) statistics.value = statsRes.data || {
      totalQuestions: 0,
      totalStudents: 0,
      totalSubjects: 0,
      todayQuestions: 0
    };

    if (questionTypesRes.code === 200) {
      questionTypes.value = questionTypesRes.data || [];
      nextTick(() => {
        initQuestionTypeChart();
      });
    }

    if (subjectsRes.code === 200) {
      subjects.value = subjectsRes.data || [];
      nextTick(() => {
        initSubjectChart();
      });
    }

    if (complexityRes.code === 200) {
      complexityData.value = complexityRes.data || { simple: 0, medium: 0, complex: 0 };
      nextTick(() => {
        initComplexityChart();
      });
    }

    if (dailyTrendRes.code === 200) {
      dailyTrend.value = dailyTrendRes.data || [];
      nextTick(() => {
        initDailyTrendChart();
      });
    }

    if (hotKeywordsRes.code === 200) {
      hotKeywords.value = hotKeywordsRes.data || [];
    }

    if (activeStudentsRes.code === 200) {
      activeStudents.value = activeStudentsRes.data || [];
    }

    isLoading.value = false;
    initAnimations();
    nextTick(() => {
      initSparklines();
    });
  }).catch(() => {
    isLoading.value = false;
    ElMessage.error('获取数据失败，请稍后重试');
  });
}

// 刷新所有数据
function refreshData() {
  getDashboardData();
  ElNotification({
    title: '刷新成功',
    message: '数据已更新至最新状态',
    type: 'success',
    position: 'bottom-right'
  });
}

// 查询学生画像
function searchStudentProfile() {
  if (!profileForm.userName) {
    ElMessage.warning('请输入用户名');
    return;
  }

  searchingProfile.value = true;
  getStudentProfile(profileForm.userName).then(res => {
    profileSearched.value = true;
    if (res.code === 200 && res.data && res.data.userName) {
      studentProfile.value = res.data;

      // 使用后端返回的学习进度数据
      if (res.data.learningProgressItems && res.data.learningProgressItems.length > 0) {
        learningProgressItems.value = res.data.learningProgressItems.map(item => ({
          label: item.dimensionName,
          value: item.score,
          color: item.color || getLearningScoreColor(item.score)
        }));
      } else {
        // 使用默认数据作为后备
        learningProgressItems.value = [
          { label: '基础知识', value: 85, color: '#4361ee' },
          { label: '实践能力', value: 72, color: '#f72585' },
          { label: '创新思维', value: 63, color: '#f8961e' },
          { label: '团队协作', value: 90, color: '#43aa8b' }
        ];
      }

      // 使用后端返回的学习建议数据
      if (res.data.recommendationItems && res.data.recommendationItems.length > 0) {
        recommendationItems.value = res.data.recommendationItems;
      } else {
        // 使用默认数据作为后备
        recommendationItems.value = [
          {
            icon: 'el-icon-reading',
            title: '加强基础知识学习',
            description: '建议多阅读相关教材，巩固基础知识点。'
          },
          {
            icon: 'el-icon-cpu',
            title: '增加实践项目经验',
            description: '参与更多实际项目，提升编程实践能力。'
          },
          {
            icon: 'el-icon-data-line',
            title: '关注学习效率',
            description: '建议制定合理的学习计划，提高学习效率。'
          }
        ];
      }

      nextTick(() => {
        initStudentComplexityChart();
      });
    } else {
      studentProfile.value = {};
      learningProgressItems.value = [];
      recommendationItems.value = [];
    }
  }).catch(() => {
    profileSearched.value = true;
    studentProfile.value = {};
    learningProgressItems.value = [];
    recommendationItems.value = [];
  }).finally(() => {
    searchingProfile.value = false;
  });
}

// 初始化问题类型图表
function initQuestionTypeChart() {
  if (charts.questionTypeChart) {
    charts.questionTypeChart.dispose();
  }
  charts.questionTypeChart = echarts.init(questionTypeChartRef.value);

  const data = questionTypes.value.length > 0 ? questionTypes.value : [
    { name: '概念解释', value: 0 },
    { name: '操作指导', value: 0 },
    { name: '原理分析', value: 0 },
    { name: '比较分析', value: 0 },
    { name: '一般提问', value: 0 }
  ];

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#e6e6e6',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle',
      textStyle: {
        color: '#666'
      },
      data: data.map(item => item.name)
    },
    series: [
      {
        name: '问题类型',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: chartColors[index % chartColors.length]
          }
        })),
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function() {
          return Math.random() * 200;
        }
      }
    ]
  };
  charts.questionTypeChart.setOption(option);
}

// 初始化学科分布图表
function initSubjectChart() {
  if (charts.subjectChart) {
    charts.subjectChart.dispose();
  }
  charts.subjectChart = echarts.init(subjectChartRef.value);

  const data = subjects.value.length > 0 ? subjects.value : [
    { name: '编程语言', value: 0 },
    { name: '数据结构与算法', value: 0 },
    { name: '数据库', value: 0 },
    { name: 'Web开发', value: 0 },
    { name: '计算机网络', value: 0 }
  ];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#e6e6e6',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e6e6e6'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666'
      }
    },
    series: [
      {
        name: '提问数量',
        type: 'bar',
        data: data.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: chartColors[index % chartColors.length] },
              { offset: 1, color: lightenColor(chartColors[index % chartColors.length], 30) }
            ]),
            borderRadius: [0, 4, 4, 0]
          }
        })),
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.1)',
          borderRadius: [0, 4, 4, 0]
        },
        animationDelay: function(idx) {
          return idx * 100;
        }
      }
    ],
    animationEasing: 'elasticOut'
  };
  charts.subjectChart.setOption(option);
}

// 初始化复杂度分布图表
function initComplexityChart() {
  if (charts.complexityChart) {
    charts.complexityChart.dispose();
  }
  charts.complexityChart = echarts.init(complexityChartRef.value);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#e6e6e6',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      bottom: '5%',
      left: 'center',
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#666'
      },
      data: ['简单', '中等', '复杂']
    },
    series: [
      {
        name: '问题复杂度',
        type: 'pie',
        radius: '65%',
        center: ['50%', '45%'],
        data: [
          {
            value: complexityData.value.simple || 0,
            name: '简单',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#67C23A' },
                { offset: 1, color: '#95EB85' }
              ])
            }
          },
          {
            value: complexityData.value.medium || 0,
            name: '中等',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#E6A23C' },
                { offset: 1, color: '#F8D878' }
              ])
            }
          },
          {
            value: complexityData.value.complex || 0,
            name: '复杂',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#F56C6C' },
                { offset: 1, color: '#FF9B9B' }
              ])
            }
          }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        label: {
          formatter: '{b}: {d}%',
          fontSize: 14,
          color: '#666'
        },
        labelLine: {
          smooth: 0.2,
          lineStyle: {
            color: 'rgba(0,0,0,0.2)'
          }
        },
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function() {
          return Math.random() * 200;
        }
      }
    ]
  };
  charts.complexityChart.setOption(option);
}

// 初始化每日提问趋势图表
function initDailyTrendChart() {
  if (charts.dailyTrendChart) {
    charts.dailyTrendChart.dispose();
  }
  charts.dailyTrendChart = echarts.init(dailyTrendChartRef.value);

  // 如果没有数据，创建一些默认数据
  let dates = dailyTrend.value.map(item => item.date);
  let counts = dailyTrend.value.map(item => item.count);

  if (dates.length === 0) {
    // 创建最近7天的日期作为默认数据
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      dates.push(`${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`);
      counts.push(0);
    }
  }

  // 根据选择的时间范围过滤数据
  const range = parseInt(trendTimeRange.value);
  if (dates.length > range) {
    dates = dates.slice(-range);
    counts = counts.slice(-range);
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(84, 112, 198, 0.5)',
          width: 1,
          type: 'solid'
        }
      },
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#e6e6e6',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666',
        formatter: function(value) {
          return value.split('-')[1];
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e6e6e6'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    series: [
      {
        name: '提问数量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#4361ee'
        },
        itemStyle: {
          color: '#4361ee',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(67, 97, 238, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(67, 97, 238, 0.05)'
            }
          ])
        },
        data: counts,
        animationDuration: 2000,
        animationEasing: 'cubicOut'
      }
    ]
  };
  charts.dailyTrendChart.setOption(option);
}

// 初始化学生复杂度分布图表
function initStudentComplexityChart() {
  if (charts.studentComplexityChart) {
    charts.studentComplexityChart.dispose();
  }
  charts.studentComplexityChart = echarts.init(studentComplexityChartRef.value);
  const complexityData = studentProfile.value.complexityDistribution || { simple: 0, medium: 0, complex: 0 };
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#e6e6e6',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      bottom: '0%',
      left: 'center',
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#666'
      },
      data: ['简单', '中等', '复杂']
    },
    series: [
      {
        name: '问题复杂度',
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: complexityData.simple || 0,
            name: '简单',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#67C23A' },
                { offset: 1, color: '#95EB85' }
              ])
            }
          },
          {
            value: complexityData.medium || 0,
            name: '中等',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#E6A23C' },
                { offset: 1, color: '#F8D878' }
              ])
            }
          },
          {
            value: complexityData.complex || 0,
            name: '复杂',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#F56C6C' },
                { offset: 1, color: '#FF9B9B' }
              ])
            }
          }
        ],
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function() {
          return Math.random() * 200;
        }
      }
    ]
  };
  charts.studentComplexityChart.setOption(option);
}

// 调整图表大小
function resizeCharts() {
  Object.keys(charts).forEach(key => {
    if (charts[key]) {
      if (Array.isArray(charts[key])) {
        charts[key].forEach(chart => {
          if (chart) chart.resize();
        });
      } else {
        charts[key].resize();
      }
    }
  });
}

// 获取标签大小
function getTagSize(frequency) {
  const min = 14;
  const max = 24;
  // 假设最大频次为100，按比例计算大小
  return min + Math.min((frequency / 100) * (max - min), max - min);
}

// 获取学习评分颜色
function getLearningScoreColor(score) {
  if (score >= 80) {
    return '#67C23A';
  } else if (score >= 60) {
    return '#E6A23C';
  } else {
    return '#F56C6C';
  }
}

// 辅助函数：颜色变亮
function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}
</script>
