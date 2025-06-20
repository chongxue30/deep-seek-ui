<template>
  <div class="exam-viewer-modal" v-if="visible">
    <!-- 背景遮罩 -->
    <div class="modal-backdrop" @click="handleClose"></div>

    <!-- 模态框内容容器 -->
    <div class="modal-container">
      <!-- 模态框头部 -->
      <div class="modal-header">
        <h3>{{ localExamData.title || '试卷详情' }}</h3>
        <button class="close-button" @click="handleClose">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 模态框内容区域 -->
      <div class="modal-body">
        <!-- 试卷基本信息卡片 -->
        <div class="exam-info-card">
          <div class="info-header">
            <div class="title-section">
              <h2>{{ localExamData.title }}</h2>
              <div class="exam-status" :class="getStatusClass(localExamData.status)">
                {{ getStatusText(localExamData.status) }}
              </div>
            </div>
            <div class="action-buttons">
              <template v-if="!isEditing">
                <button class="action-btn edit-btn" @click="startEditing">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  编辑试卷
                </button>
                <button class="action-btn print-btn" @click="printExam">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  打印试卷
                </button>
              </template>
              <!-- 编辑状态下的按钮 -->
              <template v-else>
                <button class="action-btn save-btn" @click="saveExam" :disabled="saving">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  {{ saving ? '保存中...' : '保存编辑' }}
                </button>
                <button class="action-btn cancel-btn" @click="cancelEditing">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                  退出编辑
                </button>
              </template>
            </div>
          </div>

          <!-- 试卷基本信息网格 -->
          <div class="info-grid" v-if="!isEditing">
            <div class="info-item">
              <div class="label">总分</div>
              <div class="value">{{ localExamData.totalScore || 0 }}分</div>
            </div>
            <div class="info-item">
              <div class="label">考试时长</div>
              <div class="value">{{ localExamData.duration || 0 }}分钟</div>
            </div>
            <div class="info-item">
              <div class="label">开始时间</div>
              <div class="value">{{ formatDateTime(localExamData.startTime) }}</div>
            </div>
            <div class="info-item">
              <div class="label">结束时间</div>
              <div class="value">{{ formatDateTime(localExamData.endTime) }}</div>
            </div>
          </div>

          <!-- 编辑模式表单 -->
          <div class="edit-form" v-else>
            <div class="form-group">
              <label for="exam-title">试卷标题</label>
              <input id="exam-title" v-model="editForm.title" type="text" placeholder="请输入试卷标题">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="exam-total-score">总分</label>
                <input id="exam-total-score" v-model="editForm.totalScore" type="number" min="0">
              </div>

              <div class="form-group">
                <label for="exam-duration">考试时长(分钟)</label>
                <input id="exam-duration" v-model="editForm.duration" type="number" min="0">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="exam-start-time">开始时间</label>
                <input id="exam-start-time" v-model="editForm.startTime" type="datetime-local">
              </div>

              <div class="form-group">
                <label for="exam-end-time">结束时间</label>
                <input id="exam-end-time" v-model="editForm.endTime" type="datetime-local">
              </div>
            </div>

            <div class="form-group">
              <label for="exam-description">试卷说明</label>
              <textarea id="exam-description" v-model="editForm.description" rows="3" placeholder="请输入试卷说明"></textarea>
            </div>

            <div class="form-actions">
              <button class="btn btn-primary" @click="saveExam" :disabled="saving">
                {{ saving ? '保存中...' : '保存' }}
              </button>
              <button class="btn btn-default" @click="cancelEditing">取消</button>
            </div>
          </div>

          <!-- 试卷描述 -->
          <div v-if="localExamData.description" class="exam-description">
            <div class="label">试卷说明</div>
            <div class="desc-content">{{ localExamData.description }}</div>
          </div>
        </div>

        <!-- 题目容器 -->
        <div class="question-container">
          <!-- 题目控制区 -->
          <div class="question-controls">
            <div class="section-title">试卷题目</div>
            <div class="control-buttons">
              <div class="answer-toggle">
                <input type="checkbox" id="show-all-answers" v-model="showAllAnswers">
                <label for="show-all-answers">显示所有答案</label>
              </div>
            </div>
          </div>

          <!-- 加载中状态 -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>正在加载试卷内容...</p>
          </div>

          <!-- 空状态 -->
          <div v-else-if="questions.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p>试卷暂无题目</p>
          </div>

          <!-- 题目列表 -->
          <div v-else class="question-list">
            <!-- 试卷章节分组 -->
            <div v-for="(section, sectionIndex) in groupedQuestions" :key="'section-'+sectionIndex" class="question-section">
              <!-- 章节标题 -->
              <div class="section-header" v-if="section.title">
                {{ section.title }}
                <span class="section-info">{{ section.count }}题，共{{ section.totalScore }}分</span>
              </div>

              <!-- 章节中的题目 -->
              <div v-for="(question, index) in section.questions" :key="question.id || index" class="question-item">
                <!-- 题目头部 -->
                <div class="question-header">
                  <div class="question-number">{{ question.questionNumber || (index + 1) }}.</div>
                  <div class="question-meta">
                    <span class="question-type-badge">{{ getQuestionTypeName(question.questionType) }}</span>
                    <span class="question-score-badge">{{ question.score || 0 }}分</span>
                    <span v-if="question.knowledgePoint" class="knowledge-point">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      {{ question.knowledgePoint }}
                    </span>
                  </div>
                </div>

                <!-- 题目内容 -->
                <div class="question-content">
                  <code class="html-tag" v-if="isHtmlTag(question.questionContent)">{{ question.questionContent }}</code>
                  <div v-else v-html="formatContent(question.questionContent)"></div>
                </div>
                <!-- 选择题选项 -->
                <div class="question-options" v-if="['single', 'multiple'].includes(question.questionType)">
                  <div v-for="(option, key) in parseOptions(question.options)" :key="key" class="option-item">
                    <div class="option-marker">{{ key }}</div>
                    <code class="option-text html-tag" v-if="option && (isHtmlTag(option) || option.trim() === '')">{{ option || '(空)' }}</code>
                    <div class="option-text" v-else v-html="formatContent(option)"></div>
                  </div>
                </div>

                <!-- 答案和解析区域 -->
                <div class="answer-section">
                  <!-- 切换按钮 -->
                  <button v-if="!showAllAnswers"
                          class="toggle-answer-btn"
                          @click="toggleAnswer(question.id || index)">
                    {{ isAnswerVisible(question.id || index) ? '隐藏答案' : '查看答案' }}
                  </button>

                  <!-- 答案内容 -->
                  <div v-if="showAllAnswers || isAnswerVisible(question.id || index)" class="answer-content">
                    <div class="answer-header">参考答案</div>

                    <!-- 填空题答案 -->
                    <template v-if="question.questionType === 'fill'">
                      <div v-for="(answer, ansIndex) in getAnswersForQuestion(question.id)"
                           :key="'ans-'+ansIndex"
                           class="fill-answer">
                        <div class="blank-number">空{{ answer.blankNumber }}:</div>
                        <code class="blank-answer html-tag" v-if="isHtmlTag(answer.answerContent)">{{ answer.answerContent }}</code>
                        <div class="blank-answer" v-else v-html="formatContent(answer.answerContent)"></div>
                        <div v-if="answer.blankScore" class="blank-score">{{ answer.blankScore }}分</div>
                      </div>
                    </template>

                    <!-- 其他题型答案 -->
                    <template v-else>
                      <div v-if="getAnswersForQuestion(question.id).length > 0" class="standard-answer">
                        <code class="html-tag" v-if="isHtmlTag(getAnswersForQuestion(question.id)[0].answerContent)">
                          {{ getAnswersForQuestion(question.id)[0].answerContent }}
                        </code>
                        <div v-else v-html="formatContent(getAnswersForQuestion(question.id)[0].answerContent)"></div>
                      </div>
                      <div v-else class="no-answer">暂无参考答案</div>
                    </template>

                    <!-- 解析 -->
                    <div v-if="question.analysis" class="analysis-section">
                      <div class="analysis-header">解析</div>
                      <code class="analysis-content html-tag" v-if="isHtmlTag(question.analysis)">{{ question.analysis }}</code>
                      <div class="analysis-content" v-else v-html="formatContent(question.analysis)"></div>
                    </div>

                    <!-- 评分标准 -->
                    <div v-if="question.scoringCriteria && ['essay', 'coding'].includes(question.questionType)" class="scoring-section">
                      <div class="scoring-header">评分标准</div>
                      <div class="scoring-content">{{ question.scoringCriteria }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="modal-footer">
        <button class="action-button" @click="handleClose">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExamViewerModal",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    examId: {
      type: [Number, String],
      default: null
    },
    examData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isEditing: false, // 添加这一行
      editForm: {}, // 用于保存编辑中的表单数据
      saving: false, // 保存状态
      loading: false,
      localExamData: {}, // 存储本地使用的考试数据
      questions: [],
      answers: [],
      visibleAnswers: {},
      showAllAnswers: false,
      questionTypes: {
        single: '单选题',
        multiple: '多选题',
        fill: '填空题',
        essay: '简答题',
        coding: '编程题',
        judge: '判断题',
        short: '简答题'
      },
      statusMap: [
        { value: 0, text: '未开始', class: 'status-pending' },
        { value: 1, text: '进行中', class: 'status-ongoing' },
        { value: 2, text: '已结束', class: 'status-ended' }
      ]
    };
  },
  computed: {
    groupedQuestions() {
      if (!this.questions || this.questions.length === 0) return [];

      const sortedQuestions = [...this.questions].sort((a, b) =>
          (a.questionNumber || 0) - (b.questionNumber || 0)
      );

      const result = [];
      let currentType = null;
      let currentSection = null;

      sortedQuestions.forEach(question => {
        if (question.questionType !== currentType) {
          currentType = question.questionType;
          currentSection = {
            title: this.getQuestionTypeName(currentType),
            questions: [],
            count: 0,
            totalScore: 0
          };
          result.push(currentSection);
        }

        currentSection.questions.push(question);
        currentSection.count++;
        currentSection.totalScore += (Number(question.score) || 0);
      });

      return result;
    }
  },
  watch: {
    examData: {
      immediate: true,
      deep: true,
      handler(newVal) {
        console.log("examData changed:", newVal);
        if (newVal && Object.keys(newVal).length > 0) {
          this.localExamData = {...newVal};
          this.loadQuestions();
        }
      }
    },
    visible(newVal) {
      console.log("visible changed:", newVal);
      if (newVal) {
        if (this.examId) {
          this.loadExamData();
        } else if (this.examData && Object.keys(this.examData).length > 0) {
          this.localExamData = {...this.examData};
          this.loadQuestions();
        }
      }
    }
  },
  mounted() {
    console.log("Component mounted");

    if (this.visible) {
      setTimeout(() => {
        if (this.examId) {
          this.loadExamData();
        } else if (this.examData && Object.keys(this.examData).length > 0) {
          this.localExamData = {...this.examData};
          this.loadQuestions();
        }
      }, 0);
    }
  },
  methods: {
    // 开始编辑
    startEditing() {
      // 复制当前数据到编辑表单
      this.editForm = {
        id: this.localExamData.id,
        title: this.localExamData.title,
        totalScore: this.localExamData.totalScore,
        duration: this.localExamData.duration,
        startTime: this.formatDateTimeForInput(this.localExamData.startTime),
        endTime: this.formatDateTimeForInput(this.localExamData.endTime),
        description: this.localExamData.description
      };
      this.isEditing = true;
    },

    // 取消编辑
    cancelEditing() {
      this.isEditing = false;
      this.editForm = {};
    },

    // 保存试卷
    async saveExam() {
      if (!this.editForm.title) {
        alert('试卷标题不能为空');
        return;
      }

      this.saving = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/dev-api/system/paper`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editForm)
        });

        if (!response.ok) {
          throw new Error('更新试卷失败');
        }

        const result = await response.json();
        if (result.code === 200) {
          // 更新本地数据
          Object.assign(this.localExamData, this.editForm);
          this.isEditing = false;
          alert('试卷更新成功');
          // 刷新数据
          this.loadQuestions();
        } else {
          throw new Error(result.msg || '更新试卷失败');
        }
      } catch (error) {
        console.error('保存试卷失败:', error);
        alert('保存试卷失败: ' + error.message);
      } finally {
        this.saving = false;
      }
    },

    // 格式化日期时间为input[type=datetime-local]所需格式
    formatDateTimeForInput(dateStr) {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';

        // 格式化为 YYYY-MM-DDThh:mm 格式
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
      } catch (e) {
        return '';
      }
    },
    async loadExamData() {
      console.log("Loading exam data for ID:", this.examId);
      if (!this.examId) return;

      this.loading = true;
      try {
        // 获取试卷基本信息
        const token = localStorage.getItem('token');
        const paperRes = await fetch(`/dev-api/system/paper/${this.examId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!paperRes.ok) throw new Error('获取试卷信息失败');
        const paperData = await paperRes.json();

        // 确保从API响应中正确提取试卷数据
        if (paperData.code === 200 && paperData.data) {
          this.localExamData = paperData.data;
        } else {
          this.localExamData = paperData;
        }

        console.log("Loaded exam data:", this.localExamData);

        // 加载题目和答案
        await this.loadQuestions();
      } catch (error) {
        console.error('加载试卷数据失败:', error);
        alert('加载试卷数据失败: ' + error.message);
      } finally {
        this.loading = false;
      }
    },

    async loadQuestions() {
      const examId = this.examId ||
          (this.localExamData.id) ||
          (this.localExamData.paperId);

      console.log("Loading questions for exam ID:", examId);

      if (!examId) {
        console.error("无法确定试卷ID");
        return;
      }

      this.loading = true;
      try {
        const token = localStorage.getItem('token');

        // 获取题目列表
        const questionsRes = await fetch(`/dev-api/system/question/list?paperId=${examId}&pageSize=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!questionsRes.ok) throw new Error('获取题目列表失败');
        const questionsData = await questionsRes.json();

        if (questionsData.code === 200 && Array.isArray(questionsData.rows)) {
          this.questions = questionsData.rows;
        } else {
          console.error("题目数据格式异常:", questionsData);
          this.questions = [];
        }

        console.log("Loaded questions:", this.questions.length);

        // 获取答案列表
        const answersRes = await fetch(`/dev-api/system/answer/list?paperId=${examId}&pageSize=1000`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!answersRes.ok) throw new Error('获取答案列表失败');
        const answersData = await answersRes.json();

        if (answersData.code === 200 && Array.isArray(answersData.rows)) {
          this.answers = answersData.rows;
        } else {
          console.error("答案数据格式异常:", answersData);
          this.answers = [];
        }

        console.log("Loaded answers:", this.answers.length);
      } catch (error) {
        console.error('加载题目数据失败:', error);
        alert('加载题目数据失败: ' + error.message);
      } finally {
        this.loading = false;
      }
    },

    // 检查文本是否包含HTML标签
    isHtmlTag(text) {
      if (!text) return false;
      return /<[a-zA-Z][a-zA-Z0-9]*/.test(text);
    },

// 检测是否需要显示为代码形式
    containsHtmlTags(text) {
      if (!text) return false;
      return /<[a-zA-Z][a-zA-Z0-9]*/.test(text);
    },

// 修改格式化内容的方法
    formatContent(content) {
      if (!content) return '';
      // 如果内容包含HTML标签，按原样返回供模板使用
      if (this.containsHtmlTags(content)) {
        return content;
      }
      // 纯文本的处理，替换换行符为<br>标签
      return content.replace(/\n/g, '<br>');
    },

    handleClose() {
      console.log("Closing modal");
      this.$emit('update:visible', false);
      this.$emit('close');
    },

    // 以下是模板中使用的方法，必须明确定义
    getStatusText(status) {
      const statusObj = this.statusMap.find(item => item.value === Number(status));
      return statusObj ? statusObj.text : '未知状态';
    },

    getStatusClass(status) {
      const statusObj = this.statusMap.find(item => item.value === Number(status));
      return statusObj ? statusObj.class : '';
    },

    getQuestionTypeName(type) {
      return this.questionTypes[type] || '未知题型';
    },

    parseOptions(optionsStr) {
      try {
        if (!optionsStr) return {};
        const parsed = JSON.parse(optionsStr);

        // 调试输出，帮助检查选项内容
        console.log("解析的选项:", parsed);

        // 确保每个选项都有值，哪怕是空字符串
        const options = {};
        for (const key in parsed) {
          options[key] = parsed[key] === null || parsed[key] === undefined ? '' : String(parsed[key]);
        }
        return options;
      } catch (e) {
        console.error('解析选项失败:', e, optionsStr);
        return {};
      }
    },

    formatDateTime(dateStr) {
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
    },

    toggleAnswer(questionId) {
      // 不需要使用 $set，直接赋值即可
      this.visibleAnswers[questionId] = !this.visibleAnswers[questionId];
    },

    isAnswerVisible(questionId) {
      return this.visibleAnswers[questionId] || false;
    },

    getAnswersForQuestion(questionId) {
      if (!questionId) return [];
      return this.answers.filter(answer => answer.questionId === questionId);
    },

    printExam() {
      // 创建打印内容
      let printWindow = window.open('', '_blank');
      let withAnswers = false;

      // 询问是否包含答案
      if (confirm('是否在打印内容中包含答案和解析？')) {
        withAnswers = true;
      }

      // CSS样式
      const printStyles = `
    body {
      font-family: SimSun, serif;
      padding: 20px;
      margin: 0;
      color: #333;
    }
    .print-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #000;
    }
    .print-title {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .print-info {
      font-size: 14px;
      margin-bottom: 5px;
    }
    .question-section {
      margin-bottom: 20px;
    }
    .section-title {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .question-item {
      margin-bottom: 15px;
      page-break-inside: avoid;
    }
    .question-header {
      font-weight: bold;
      margin-bottom: 8px;
    }
    .question-content {
      margin-bottom: 8px;
    }
    /* 选项样式 */
    .options-container {
      margin-left: 20px;
      margin-bottom: 15px;
    }
    .option-item {
      display: flex;
      margin-bottom: 8px;
      align-items: flex-start;
    }
    .option-marker {
      min-width: 20px;
      margin-right: 8px;
      font-weight: bold;
    }
    .answer-section {
      margin-top: 10px;
      padding-top: 5px;
      border-top: 1px dashed #ccc;
    }
    .answer-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .analysis-section {
      margin-top: 10px;
    }
    .html-tag {
      font-family: monospace;
      background-color: #f0f0f0;
      padding: 8px;
      border-radius: 4px;
      color: #e83e8c;
      white-space: pre-wrap;
      line-height: 1.5;
    }
    .error {
      color: red;
      font-style: italic;
    }
    .no-print {
      display: none;
    }
    @media print {
      .no-print {
        display: none;
      }
      body {
        font-size: 12pt;
      }
      .page-break {
        page-break-before: always;
      }
    }
  `;

      // 构建HTML文档结构
      const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${this.localExamData.title || '试卷详情'}</title>
        <meta charset="utf-8">
        <style>${printStyles}</style>
      </head>
      <body>
        <div class="no-print" style="position:fixed; top:10px; right:10px; padding:10px; background:#f0f0f0; border-radius:5px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
          <button onclick="window.print()" style="margin-right:10px; padding:5px 10px;">打印</button>
          <button onclick="window.close()" style="padding:5px 10px;">关闭</button>
        </div>
        <div class="print-header">
          <div class="print-title">${this.localExamData.title || '试卷'}</div>
          <div class="print-info">总分: ${this.localExamData.totalScore || 0}分 | 考试时长: ${this.localExamData.duration || 0}分钟</div>
          ${this.localExamData.description ? `<div class="print-info">说明: ${this.localExamData.description}</div>` : ''}
        </div>
        ${this.generateQuestionsHTML(withAnswers)}
      </body>
    </html>
  `;

      // 打开新窗口并写入内容
      printWindow.document.open();
      printWindow.document.write(htmlTemplate);
      printWindow.document.close();

      // 延迟执行打印，等待内容加载
      setTimeout(() => {
        printWindow.focus();
      }, 500);
    },

// generateQuestionsHTML方法修改
    generateQuestionsHTML(withAnswers) {
      let questionsHtml = '';

      // 按分组添加题目
      this.groupedQuestions.forEach((section, sIndex) => {
        questionsHtml += `
      <div class="question-section">
        <div class="section-title">${section.title} (${section.count}题，共${section.totalScore}分)</div>
    `;

        section.questions.forEach((question, qIndex) => {
          // 处理题目内容 - 对HTML标签进行处理
          const questionContent = this.isHtmlTag(question.questionContent)
              ? `<pre class="html-tag">${this.escapeForDisplay(question.questionContent)}</pre>`
              : `<div>${this.formatContentForPrint(question.questionContent || '')}</div>`;

          questionsHtml += `
        <div class="question-item">
          <div class="question-header">
            ${question.questionNumber || (qIndex + 1)}. (${question.score || 0}分)
          </div>
          <div class="question-content">${questionContent}</div>
      `;

          // 选择题选项
          if (['single', 'multiple'].includes(question.questionType)) {
            try {
              const options = this.parseOptions(question.options);
              questionsHtml += `<div class="options-container">`;

              for (const key in options) {
                if (options.hasOwnProperty(key)) {
                  const optionText = options[key] || '';

                  if (!optionText || optionText.trim() === '' || this.isHtmlTag(optionText)) {
                    questionsHtml += `
                <div class="option-item">
                  <div class="option-marker">${key}.</div>
                  <pre class="html-tag">${this.escapeForDisplay(optionText || '(空)')}</pre>
                </div>`;
                  } else {
                    questionsHtml += `
                <div class="option-item">
                  <div class="option-marker">${key}.</div>
                  <div>${this.formatContentForPrint(optionText)}</div>
                </div>`;
                  }
                }
              }

              questionsHtml += `</div>`;
            } catch (error) {
              console.error('生成选项HTML出错:', error);
              questionsHtml += `<div class="error">选项解析错误</div>`;
            }
          }

          // 答案部分也需类似处理...

          questionsHtml += `</div>`;
        });

        questionsHtml += `</div>`;
      });

      return questionsHtml;
    },

// 添加这两个辅助方法
    escapeForDisplay(text) {
      if (!text) return '';
      return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    formatContentForPrint(content) {
      if (!content) return '';
      if (this.containsHtmlTags(content)) {
        return this.escapeForDisplay(content);
      }
      return content.replace(/\n/g, '<br>');
    }
  }
};
</script>


<style scoped>
/* 模态窗口基础样式 */
.exam-viewer-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 模态窗口头部样式 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
}

.close-button:hover {
  background-color: #f0f0f0;
  color: #333;
}

/* 模态窗口内容区域样式 */
.modal-body {
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
}

/* 模态窗口底部样式 */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.action-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #e0e0e0;
}

/* 试卷信息卡片样式 */
.exam-info-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-section h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

/* 试卷状态样式 */
.exam-status {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-ongoing {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-ended {
  background-color: #fff2f0;
  color: #ff4d4f;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background-color: white;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f0f0f0;
}

.print-btn {
  color: #1890ff;
  border-color: #1890ff;
}

.print-btn:hover {
  background-color: #e6f7ff;
}

/* 信息网格样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.value {
  font-size: 15px;
  font-weight: 500;
}

/* 试卷描述样式 */
.exam-description {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #eee;
}

.desc-content {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}

/* 题目容器样式 */
.question-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

/* 题目控制区样式 */
.question-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.answer-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 加载状态样式 */
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
  border-top: 3px solid #3498db;
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
  padding: 40px 0;
  color: #999;
}

/* 题目分组样式 */
.question-section {
  margin-bottom: 30px;
}

.section-header {
  font-size: 16px;
  font-weight: 600;
  padding: 10px 0;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 16px;
  color: #1890ff;
}

.section-info {
  font-size: 14px;
  font-weight: normal;
  color: #666;
  margin-left: 10px;
}

/* 题目样式 */
.question-item {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #eee;
}

.question-header {
  display: flex;
  margin-bottom: 12px;
}

.question-number {
  font-weight: bold;
  font-size: 16px;
  margin-right: 8px;
  min-width: 24px;
}

.question-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.question-type-badge {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.question-score-badge {
  background-color: #fff2e8;
  color: #fa8c16;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.knowledge-point {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #52c41a;
}

.question-content {
  margin-bottom: 16px;
  line-height: 1.6;
}

/* 选项样式 */
.question-options {
  margin-left: 24px;
  margin-bottom: 16px;
}

.option-item {
  display: flex;
  margin-bottom: 8px;
}

.option-marker {
  min-width: 24px;
  height: 24px;
  background-color: #f0f0f0;
  color: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 13px;
}

.option-text {
  flex: 1;
  line-height: 1.6;
}

/* 答案区
/* 答案区域样式 */
.answer-section {
  margin-top: 16px;
}

.toggle-answer-btn {
  background: transparent;
  border: none;
  color: #1890ff;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.toggle-answer-btn:hover {
  text-decoration: underline;
}

.answer-content {
  margin-top: 12px;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
}

.answer-header {
  font-weight: 600;
  margin-bottom: 8px;
  color: #1890ff;
}

/* 填空题答案样式 */
.fill-answer {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.blank-number {
  min-width: 60px;
  font-weight: 500;
}

.blank-answer {
  flex: 1;
}

.blank-score {
  color: #fa8c16;
  margin-left: 12px;
  font-size: 13px;
}

/* 标准答案样式 */
.standard-answer {
  line-height: 1.6;
}

.no-answer {
  color: #999;
  font-style: italic;
}

/* 解析区域样式 */
.analysis-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #ddd;
}

.analysis-header {
  font-weight: 600;
  margin-bottom: 8px;
  color: #52c41a;
}

.analysis-content {
  line-height: 1.6;
}

/* 评分标准样式 */
.scoring-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #ddd;
}

.scoring-header {
  font-weight: 600;
  margin-bottom: 8px;
  color: #722ed1;
}

.scoring-content {
  line-height: 1.6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    flex-direction: column;
  }

  .question-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .fill-answer {
    flex-direction: column;
    align-items: flex-start;
  }

  .blank-number {
    margin-bottom: 4px;
  }
}

/* 打印样式 */
@media print {
  .exam-viewer-modal {
    position: static;
    display: block;
  }

  .modal-container {
    box-shadow: none;
    width: 100%;
    max-height: none;
  }

  .modal-header,
  .modal-footer,
  .action-buttons,
  .toggle-answer-btn {
    display: none;
  }

  .question-content,
  .option-text,
  .standard-answer,
  .analysis-content {
    page-break-inside: avoid;
  }

  .question-section {
    page-break-before: always;
  }

  .question-section:first-child {
    page-break-before: auto;
  }
}

/* 编辑表单样式 */
.edit-form {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

.btn-primary:hover {
  background-color: #40a9ff;
}

.btn-primary:disabled {
  background-color: #bae7ff;
  border-color: #bae7ff;
  cursor: not-allowed;
}

.btn-default {
  background-color: white;
}

.btn-default:hover {
  background-color: #f0f0f0;
}

.edit-btn {
  color: #52c41a;
  border-color: #52c41a;
}

.edit-btn:hover {
  background-color: #f6ffed;
}

.save-btn {
  color: #1890ff;
  border-color: #1890ff;
}

.save-btn:hover {
  background-color: #e6f7ff;
}

.save-btn:disabled {
  color: #bae7ff;
  border-color: #bae7ff;
  cursor: not-allowed;
  background-color: #f9f9f9;
}

.cancel-btn {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.cancel-btn:hover {
  background-color: #fff1f0;
}

.html-tag {
  display: block;
  font-family: monospace;
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 4px;
  color: #e83e8c;
  white-space: pre-wrap;
  overflow-x: auto;
  line-height: 1.5;
  font-size: 14px;
}
</style>
