<template>
  <div class="course-detail-container">
    <!-- <div class="course-header">
      <div class="course-header-left">
        <button class="back-button" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
        </button>
        <h2>{{ courseInfo.className || '课程详情' }}</h2>
      </div>
      <div class="course-header-actions">
        <button class="action-button primary" @click="toggleDashboardView">
          <svg v-if="showDashboard" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-bar-chart-3"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
          {{ showDashboard ? '查看学生列表' : '查看数据分析' }}
        </button>
      </div>
    </div> -->

    <div class="course-info-card">
      <div class="course-info-header">
        <h3>课程信息</h3>
      </div>
      <div class="course-info-body">
        <div class="course-info-item">
          <div class="info-label">课程名称</div>
          <div class="info-value">{{ courseInfo.className || '加载中...' }}</div>
        </div>
        <div class="course-info-item">
          <div class="info-label">创建时间</div>
          <div class="info-value">{{ courseInfo.createTime ? courseInfo.createTime : '加载中...' }}</div>
        </div>
        <div class="course-info-item">
          <div class="info-label">学生数量</div>
          <div class="info-value">{{ courseInfo.studentCount || classStudents.length || 0 }}名学生</div>
        </div>
      </div>
    </div>

    <!-- 管理页面导航 -->
    <div class="admin-nav">
      <button
          class="admin-nav-item"
          :class="{ active: activeTab === 'analytics' }"
          @click="activeTab = 'analytics'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             class="lucide lucide-bar-chart-3">
          <path d="M3 3v18h18"></path>
          <path d="M18 17V9"></path>
          <path d="M13 17V5"></path>
          <path d="M8 17v-3"></path>
        </svg>
        数据分析
      </button>
      <button
          class="admin-nav-item"
          :class="{ active: activeTab === 'students' }"
          @click="activeTab = 'students'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             class="lucide lucide-users">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        学生管理
      </button>
      <button
          class="admin-nav-item"
          :class="{ active: activeTab === 'knowledge' }"
          @click="activeTab = 'knowledge'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
        </svg>
        知识库管理
      </button>
    </div>

    <div class="content-container">
      <!-- 数据分析视图 -->
      <div v-if="activeTab === 'analytics'" class="dashboard-view">
        <div class="dashboard-header">
          <h3>{{ courseInfo.className }} - 课程数据分析</h3>
        </div>
        <div class="analytics-dashboard">
          <AnalyticsDashboard :classId="courseId"/>
        </div>
      </div>

      <!-- 知识库管理视图 -->
      <div v-if="activeTab === 'knowledge'" class="admin-panel">
        <div class="admin-panel-header">
          <h3>知识库列表</h3>
          <button class="action-button primary" @click="showCreateKnowledgeBaseModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 class="lucide lucide-plus">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            创建知识库
          </button>
        </div>

        <div v-if="isLoadingKnowledgeBases" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="knowledgeBases.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-folder">
            <path
                d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
          </svg>
          <p>暂无知识库，请点击上方按钮创建</p>
        </div>

        <div v-else class="knowledge-list">
          <div v-for="kb in knowledgeBases"
               :key="kb.id"
               class="knowledge-item">
            <div class="knowledge-info">
              <div class="knowledge-name">{{ kb.name }}</div>
              <div class="knowledge-details" v-if="kb.description || kb.document_count !== undefined">
                <span v-if="kb.description" class="description">{{ kb.description }}</span>
                <div class="stats">
                    <span v-if="kb.document_count !== undefined" class="document-count">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           class="lucide lucide-file-text"><path
                          d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline
                          points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16"
                                                                                                               x2="8"
                                                                                                               y1="17"
                                                                                                               y2="17"></line><line
                          x1="10" x2="8" y1="9" y2="9"></line></svg>
                      文档数: {{ kb.document_count }}
                    </span>
                  <span v-if="kb.word_count !== undefined" class="word-count">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           class="lucide lucide-text"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path
                          d="M15.1 18H3"></path></svg>
                      词数: {{ kb.word_count }}
                    </span>
                </div>
              </div>
            </div>
            <div class="knowledge-actions">
              <button class="action-button small" @click="showDocumentsModal(kb)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     class="lucide lucide-file-text">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" x2="8" y1="13" y2="13"></line>
                  <line x1="16" x2="8" y1="17" y2="17"></line>
                  <line x1="10" x2="8" y1="9" y2="9"></line>
                </svg>
                查看文档
              </button>
              <button v-if="isTeacher" class="action-button small primary" @click="showAddDocumentModal(kb)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     class="lucide lucide-file-plus">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" x2="12" y1="18" y2="12"></line>
                  <line x1="9" x2="15" y1="15" y2="15"></line>
                </svg>
                添加文档
              </button>
              <button v-if="isTeacher" class="delete-btn" @click="confirmDeleteKnowledgeBase(kb.id, kb.name)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     class="lucide lucide-trash-2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" x2="10" y1="11" y2="17"></line>
                  <line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 学生列表视图 -->
      <div v-if="activeTab === 'students'" class="student-list-view">
        <div class="student-list-header">
          <h3>学生名单</h3>
          <!-- <button class="action-button primary" @click="showAddStudentsModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="16" x2="22" y1="11" y2="11"></line></svg>
            添加学生
          </button> -->
        </div>

        <!-- 添加搜索框 -->
<!--        <div class="student-search">-->
<!--          <div class="search-input-wrapper">-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"-->
<!--                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="search-icon">-->
<!--              <circle cx="11" cy="11" r="8"></circle>-->
<!--              <line x1="21" x2="16.65" y1="21" y2="16.65"></line>-->
<!--            </svg>-->
<!--            <input-->
<!--                type="text"-->
<!--                v-model="studentSearchKeyword"-->
<!--                placeholder="搜索学生姓名或学号..."-->
<!--                class="search-input"-->
<!--            />-->
<!--            <button-->
<!--                v-if="studentSearchKeyword"-->
<!--                class="clear-search"-->
<!--                @click="studentSearchKeyword = ''"-->
<!--            >-->
<!--              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"-->
<!--                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">-->
<!--                <path d="M18 6 6 18"></path>-->
<!--                <path d="m6 6 12 12"></path>-->
<!--              </svg>-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->

        <div v-if="isLoadingStudents" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载学生名单中...</p>
        </div>

        <div v-else-if="classStudents.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-user-x">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="17" x2="22" y1="8" y2="13"></line>
            <line x1="22" x2="17" y1="8" y2="13"></line>
          </svg>
          <p>课程暂无学生，请点击"添加学生"按钮添加</p>
        </div>

        <div v-else class="student-management">
          <!-- 批量操作工具栏 -->
          <div class="student-toolbar">
            <!-- 搜索框 -->
            <div class="student-search">
              <div class="search-input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
                <input type="text" v-model="studentSearchKeyword" placeholder="搜索学生姓名或学号..." class="search-input" />
                <button v-if="studentSearchKeyword" class="clear-search" @click="studentSearchKeyword = ''">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 全选按钮 -->
            <div class="student-selection">
              <input type="checkbox" id="select-all-students" :checked="selectAllStudents" @change="toggleSelectAllStudents" />
              <label for="select-all-students">全选</label>
            </div>

            <!-- 添加学生按钮 -->
            <div class="student-actions-right">
              <button class="action-button primary" @click="showAddStudentsModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" x2="19" y1="8" y2="14"></line>
                  <line x1="16" x2="22" y1="11" y2="11"></line>
                </svg>
                添加学生
              </button>
            </div>
          </div>

          <!-- 学生卡片网格 -->
          <div class="student-grid">
            <div
                v-for="student in filteredStudents"
                :key="student.studentId"
                class="student-card"
                :class="{ 'selected': selectedStudents.includes(student.studentId) }"
                @click="showStudentProfile(student.studentNo)"
            >
              <div class="student-selection-checkbox">
                <input
                    type="checkbox"
                    :id="`student-${student.studentId}`"
                    :checked="selectedStudents.includes(student.studentId)"
                    @change="toggleStudentSelection(student.studentId)"
                    @click.stop
                />
              </div>

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

              <button class="action-button small danger" @click.stop="removeStudentFromClass(student)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     class="lucide lucide-user-minus">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="16" x2="22" y1="11" y2="11"></line>
                </svg>
                移除
              </button>
            </div>
          </div>

          <div v-if="filteredStudents.length === 0 && classStudents.length > 0" class="empty-search-result">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
            </svg>
            <p>没有找到匹配"{{ studentSearchKeyword }}"的学生</p>
          </div>

          <!-- 分页控件 -->
          <div class="pagination" v-if="studentTotalPages > 1">
            <button
                class="pagination-button"
                :disabled="studentCurrentPage === 1"
                @click="changeStudentPage(studentCurrentPage - 1)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   class="lucide lucide-chevron-left">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              上一页
            </button>

            <div class="pagination-info">
              第 {{ studentCurrentPage }} 页 / 共 {{ studentTotalPages }} 页
            </div>

            <button
                class="pagination-button"
                :disabled="studentCurrentPage === studentTotalPages || studentTotalPages === 0"
                @click="changeStudentPage(studentCurrentPage + 1)"
            >
              下一页
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   class="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 知识库管理相关弹窗 -->
    <!-- 创建知识库弹窗 -->
    <div v-if="showCreateKBModal" class="modal-backdrop" @click="closeCreateKBModal"></div>
    <div v-if="showCreateKBModal" class="modal-container create-modal">
      <div class="modal-header">
        <h3>创建知识库</h3>
        <button class="close-button" @click="closeCreateKBModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-x">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="kb-name">知识库名称</label>
          <input
              type="text"
              id="kb-name"
              v-model="newKnowledgeBase.name"
              placeholder="请输入知识库名称"
              class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="kb-description">知识库描述 (选填)</label>
          <textarea
              id="kb-description"
              v-model="newKnowledgeBase.description"
              placeholder="请输入知识库描述"
              class="form-textarea"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button" @click="closeCreateKBModal">取消</button>
        <button
            class="action-button primary"
            @click="submitCreateKnowledgeBase"
            :disabled="!newKnowledgeBase.name || isCreatingKB"
        >
          <span v-if="isCreatingKB">创建中...</span>
          <span v-else>确认创建</span>
        </button>
      </div>
    </div>

    <!-- 查看文档弹窗 -->
    <div v-if="showDocsModal" class="modal-backdrop" @click="closeDocsModal"></div>
    <div v-if="showDocsModal" class="modal-container docs-modal">
      <div class="modal-header">
        <h3>{{ currentKnowledgeBase?.name }} 的文档</h3>
        <button class="close-button" @click="closeDocsModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-x">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isLoadingDocs" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="documents.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-file-text">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" x2="8" y1="13" y2="13"></line>
            <line x1="16" x2="8" y1="17" y2="17"></line>
            <line x1="10" x2="8" y1="9" y2="9"></line>
          </svg>
          <p>暂无文档，请点击"添加文档"按钮添加</p>
        </div>

        <div v-else>
          <div class="documents-list">
            <div v-for="doc in documents" :key="doc.id" class="document-item">
              <div class="document-info">
                <div class="document-name">{{ doc.name }}</div>
                <div class="document-details">
                  <span class="document-date">{{ formatDate(doc.created_at) }}</span>
                  <span v-if="doc.word_count" class="document-word-count">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           class="lucide lucide-text"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path
                          d="M15.1 18H3"></path></svg>
                      {{ doc.word_count }} 词
                    </span>
                </div>
              </div>
              <div class="document-actions">
                <button class="action-button small" @click="viewDocument(doc)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                       class="lucide lucide-eye">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  查看
                </button>
                <button v-if="isTeacher" class="delete-btn" @click="confirmDeleteDocument(doc.id, doc.name)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                       class="lucide lucide-trash-2">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button v-if="isTeacher" class="action-button primary" @click="showAddDocumentModal(currentKnowledgeBase)">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-file-plus">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" x2="12" y1="18" y2="12"></line>
            <line x1="9" x2="15" y1="15" y2="15"></line>
          </svg>
          添加文档
        </button>
      </div>
    </div>

    <!-- 添加文档弹窗 -->
    <div v-if="showAddDocModal" class="modal-backdrop" @click="closeAddDocModal"></div>
    <div v-if="showAddDocModal" class="modal-container add-doc-modal">
      <div class="modal-header">
        <h3>添加文档到 {{ currentKnowledgeBase?.name }}</h3>
        <button class="close-button" @click="closeAddDocModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-x">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="add-doc-tabs">
          <button
              class="tab-button"
              :class="{ 'active': addDocTab === 'upload' }"
              @click="addDocTab = 'upload'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 class="lucide lucide-upload">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" x2="12" y1="3" y2="15"></line>
            </svg>
            上传文件
          </button>
          <button
              class="tab-button"
              :class="{ 'active': addDocTab === 'text' }"
              @click="addDocTab = 'text'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 class="lucide lucide-text">
              <path d="M17 6.1H3"></path>
              <path d="M21 12.1H3"></path>
              <path d="M15.1 18H3"></path>
            </svg>
            手动输入
          </button>
        </div>

        <!-- 上传文件 -->
        <div v-if="addDocTab === 'upload'" class="upload-tab">
          <div class="file-upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="onFileDrop">
            <input
                type="file"
                ref="fileInput"
                class="hidden-input"
                @change="onFileSelected"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 class="lucide lucide-upload-cloud">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <p>点击或拖拽文件到此处上传</p>
            <p class="upload-hint">支持 TXT、MARKDOWN、MDX、PDF、HTML、XLSX、XLS、DOCX、CSV、MD、HTM 格式，每个文件不超过 15MB</p>
          </div>

          <div v-if="selectedFile" class="selected-file">
            <div class="file-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   class="lucide lucide-file">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <div>
                <div class="file-name">{{ selectedFile.name }}</div>
                <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
              </div>
            </div>
            <button class="remove-file" @click="selectedFile = null">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   class="lucide lucide-x">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 手动输入 -->
        <div v-if="addDocTab === 'text'" class="text-tab">
          <div class="form-group">
            <label for="doc-name">文档名称</label>
            <input
                type="text"
                id="doc-name"
                v-model="newDocument.name"
                placeholder="请输入文档名称"
                class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="doc-content">文档内容</label>
            <textarea
                id="doc-content"
                v-model="newDocument.text"
                placeholder="请输入文档内容"
                class="form-textarea"
                rows="10"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button" @click="closeAddDocModal">取消</button>
        <button
            class="action-button primary"
            @click="submitAddDocument"
            :disabled="isAddingDoc || (addDocTab === 'upload' && !selectedFile) || (addDocTab === 'text' && (!newDocument.name || !newDocument.text))"
        >
          <span v-if="isAddingDoc">添加中...</span>
          <span v-else>确认添加</span>
        </button>
      </div>
    </div>

    <!-- 确认删除弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-backdrop" @click="cancelDelete"></div>
    <div v-if="showDeleteConfirm" class="modal-container delete-modal">
      <div class="modal-header">
        <h3>确认删除</h3>
        <button class="close-button" @click="cancelDelete">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-x">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="delete-warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-alert-triangle">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
          </svg>
          <p>确定要删除{{ deleteType === 'kb' ? '知识库' : '文档' }} <strong>"{{ itemToDelete.name }}"</strong> 吗？</p>
          <p class="warning-text">
            此操作不可逆，{{ deleteType === 'kb' ? '知识库中的所有文档和分段将被永久删除' : '文档将被永久删除' }}。</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button" @click="cancelDelete">取消</button>
        <button
            class="action-button danger"
            @click="confirmDelete"
            :disabled="isDeleting"
        >
          <span v-if="isDeleting">删除中...</span>
          <span v-else>确认删除</span>
        </button>
      </div>
    </div>

    <!-- 查看文档内容弹窗 -->
    <div v-if="showDocContentModal" class="modal-backdrop" @click="closeDocContentModal"></div>
    <div v-if="showDocContentModal" class="modal-container doc-content-modal">
      <div class="modal-header">
        <h3>{{ currentDocument?.name }}</h3>
        <button class="close-button" @click="closeDocContentModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-x">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isLoadingDocContent" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else class="document-content">
          <pre>{{ currentDocument?.text }}</pre>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button" @click="closeDocContentModal">关闭</button>
      </div>
    </div>

    <!-- 添加学生弹窗 -->
    <div v-if="showAddStudentModal" class="modal-backdrop" @click="closeAddStudentModal"></div>
    <div v-if="showAddStudentModal" class="modal-container add-student-modal">
      <div class="modal-header">
        <h3>向 {{ courseInfo.className }} 添加学生</h3>
        <button class="close-button" @click="closeAddStudentModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-x">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="add-student-tabs">
          <button
              class="tab-button"
              :class="{ 'active': addStudentTab === 'class' }"
              @click="addStudentTab = 'class'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 class="lucide lucide-users">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            按班级添加
          </button>
          <button
              class="tab-button"
              :class="{ 'active': addStudentTab === 'manual' }"
              @click="addStudentTab = 'manual'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 class="lucide lucide-user-plus">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" x2="19" y1="8" y2="14"></line>
              <line x1="16" x2="22" y1="11" y2="11"></line>
            </svg>
            手动添加学生
          </button>
        </div>

        <!-- 按班级添加 -->
        <div v-if="addStudentTab === 'class'" class="class-selection-tab">
          <div v-if="isLoadingClassNames" class="loading-container small">
            <div class="loading-spinner"></div>
            <p>加载班级列表中...</p>
          </div>
          <div v-else>
            <div class="form-group">
              <label for="class-select">选择班级</label>
              <select
                  id="class-select"
                  v-model="selectedClassName"
                  class="form-input"
              >
                <option value="">请选择班级</option>
                <option v-for="className in classNameList" :key="className" :value="className">
                  {{ className }}
                </option>
              </select>
            </div>

            <div v-if="selectedClassName" class="preview-container">
              <div class="preview-header">
                <h4>预览: {{ selectedClassName }} 班级学生 ({{ previewStudents.length }}人)</h4>
              </div>

              <div v-if="isLoadingPreviewStudents" class="loading-container small">
                <div class="loading-spinner"></div>
                <p>加载学生列表中...</p>
              </div>

              <div v-else-if="previewStudents.length === 0" class="empty-state small">
                <p>该班级暂无学生</p>
              </div>

              <div v-else class="preview-students">
                <div v-for="student in previewStudents" :key="student.studentId" class="preview-student-item">
                  <div class="student-name">{{ student.studentName }}</div>
                  <div class="student-id">{{ student.studentId }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 手动添加学生 -->
        <div v-if="addStudentTab === 'manual'" class="manual-add-tab">
          <div class="form-group">
            <label for="student-id">学生学号</label>
            <input
                type="text"
                id="student-id"
                v-model="manualStudentId"
                placeholder="请输入学生学号"
                class="form-input"
            />
          </div>

          <div v-if="manualStudentId && manualStudentInfo" class="student-preview">
            <div class="preview-header">
              <h4>学生信息</h4>
            </div>
            <div class="student-info-preview">
              <div class="info-item">
                <span class="label">姓名:</span>
                <span class="value">{{ manualStudentInfo.studentName }}</span>
              </div>
              <div class="info-item">
                <span class="label">学号:</span>
                <span class="value">{{ manualStudentInfo.studentNo }}</span>
              </div>
              <div class="info-item">
                <span class="label">班级:</span>
                <span class="value">{{ manualStudentInfo.className }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="manualStudentId && isSearchingStudent" class="loading-container small">
            <div class="loading-spinner"></div>
            <p>查询学生信息中...</p>
          </div>

          <div v-else-if="manualStudentId && !manualStudentInfo && !isSearchingStudent" class="empty-state small">
            <p>未找到该学号的学生</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button" @click="closeAddStudentModal">取消</button>
        <button
            class="action-button primary"
            @click="confirmAddStudents"
            :disabled="isAddingStudents ||
                  (addStudentTab === 'class' && !selectedClassName) ||
                  (addStudentTab === 'manual' && !manualStudentInfo)"
        >
          <span v-if="isAddingStudents">添加中...</span>
          <span v-else>确认添加</span>
        </button>
      </div>
    </div>

    <!-- 通知提示 -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      <div class="notification-icon">
        <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
             strokeLinejoin="round" class="lucide lucide-check-circle">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
             strokeLinejoin="round" class="lucide lucide-x-circle">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m15 9-6 6"></path>
          <path d="m9 9 6 6"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             class="lucide lucide-info">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </div>
      <div class="notification-content">
        {{ notification.message }}
      </div>
    </div>

    <!-- 学生查询对话框 -->
    <el-dialog
        title=""
        v-model="showStudentSearch"
        width="80%"
        class="student-search-dialog"
        destroy-on-close
        append-to-body
    >
      <!-- <div class="search-form">
        <el-input
            v-model="profileForm.userName"
            placeholder="请输入学生学号"
            clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button type="primary" @click="searchStudentProfile" :loading="searchingProfile">查询</el-button>
          </template>
        </el-input>
      </div> -->

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
                <el-icon>
                  <ChatDotRound/>
                </el-icon>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ studentProfile.totalQuestions }}</div>
                <div class="stat-label">总提问数</div>
              </div>
            </div>
            <div class="profile-stat-card">
              <div class="stat-icon">
                <el-icon>
                  <Collection/>
                </el-icon>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ studentProfile.mainSubject }}</div>
                <div class="stat-label">主要学科</div>
              </div>
            </div>
            <div class="profile-stat-card">
              <div class="stat-icon">
                <el-icon>
                  <Calendar/>
                </el-icon>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ studentProfile.lastActiveTime }}</div>
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
              <h3>学习进度分析</h3>
              <div v-if="learningProgressItems.length > 0" class="learning-progress">
                <div class="progress-item" v-for="(item, index) in learningProgressItems" :key="index">
                  <div class="progress-label">
                    <span>{{ item.label }}</span>
                    <span>{{ item.value }}%</span>
                  </div>
                  <el-progress
                      :percentage="item.value"
                      :color="item.color"
                      :stroke-width="8"
                  ></el-progress>
                </div>
              </div>
              <div v-else class="no-data-message">
                <p>暂无学习进度数据</p>
              </div>
            </div>
          </div>

          <div class="profile-recommendations">
            <h3>学习建议</h3>
            <div v-if="recommendationItems.length > 0" class="recommendation-list">
              <div class="recommendation-item" v-for="(item, index) in recommendationItems" :key="index">
                <div class="recommendation-icon">
                  <el-icon>
                    <component :is="getRecommendationIcon(item.icon)"/>
                  </el-icon>
                </div>
                <div class="recommendation-content">
                  <div class="recommendation-title">{{ item.title }}</div>
                  <div class="recommendation-desc">{{ item.description }}</div>
                </div>
              </div>
            </div>
            <div v-else class="no-data-message">
              <p>暂无学习建议数据</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="profileSearched" class="no-profile-data">
        <el-icon>
          <WarningFilled/>
        </el-icon>
        <h3>未找到学生数据</h3>
        <p>请检查用户名是否正确，或尝试搜索其他学生</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, nextTick, watch} from 'vue'
import {useRoute} from 'vue-router'
import AnalyticsDashboard from '@/components/AnalyticsDashboard.vue'

import * as echarts from 'echarts';
import {ElMessage} from 'element-plus';
import {
  Collection, ChatDotRound, Calendar, WarningFilled
} from '@element-plus/icons-vue';
import {
  getStudentProfile
} from '@/api/analyse/dashboard';

const route = useRoute()

// 获取课程ID
const courseId = route.params.id

// 状态
const courseInfo = ref({})
const activeTab = ref('analytics') // 'students', 'knowledge', 'analytics'
const classStudents = ref([])
const isLoadingStudents = ref(false)
const studentCurrentPage = ref(1)
const studentTotalPages = ref(1)
const selectedStudents = ref([])
const selectAllStudents = ref(false)

// 知识库相关状态
const knowledgeBases = ref([])
const documents = ref([])
const isLoadingKnowledgeBases = ref(false)
const isLoadingDocs = ref(false)
const isLoadingDocContent = ref(false)
const isCreatingKB = ref(false)
const isAddingDoc = ref(false)
const isDeleting = ref(false)
const currentKnowledgeBase = ref(null)
const currentDocument = ref(null)
const selectedFile = ref(null)
const addDocTab = ref('upload')
const deleteType = ref('kb') // 'kb' 或 'doc'
const itemToDelete = ref({id: '', name: ''})
const fileInput = ref(null)

// 弹窗状态
const showCreateKBModal = ref(false)
const showAddDocModal = ref(false)
const showDocsModal = ref(false)
const showDocContentModal = ref(false)
const showDeleteConfirm = ref(false)
const showAddStudentModal = ref(false)

//画像
const profileSearched = ref(false);
const studentProfile = ref({});
const showStudentSearch = ref(false);
const searchingProfile = ref(false);
const learningProgressItems = ref([]);
const recommendationItems = ref([]);
const profileForm = reactive({
  userName: ''
});
const charts = reactive({
  questionTypeChart: null,
  subjectChart: null,
  complexityChart: null,
  dailyTrendChart: null,
  studentComplexityChart: null,
  sparklines: []
});
const studentComplexityChartRef = ref(null);

// 添加学生相关状态
const addStudentTab = ref('class')
const isLoadingClassNames = ref(false)
const classNameList = ref([])
const selectedClassName = ref('')
const previewStudents = ref([])
const isLoadingPreviewStudents = ref(false)
const isAddingStudents = ref(false)
const manualStudentId = ref('')
const manualStudentInfo = ref(null)
const isSearchingStudent = ref(false)

// 新知识库表单
const newKnowledgeBase = ref({
  name: '',
  description: ''
})

// 新文档表单
const newDocument = ref({
  name: '',
  text: ''
})

// 通知状态
const notification = ref({
  show: false,
  message: '',
  type: 'info' // 'success', 'error', 'info'
})

// 获取课程信息
const getCourseInfo = async () => {
  try {
    isLoadingStudents.value = true
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/system/class/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('获取课程信息失败')
    }

    const data = await res.json()
    if (data.data) {
      courseInfo.value = data.data
    }
  } catch (error) {
    console.error('获取课程信息失败:', error)
    showNotification('获取课程信息失败', 'error')
  } finally {
    isLoadingStudents.value = false
  }
}

const studentSearchKeyword = ref('');

// 过滤后的学生列表
const filteredStudents = computed(() => {
  if (!studentSearchKeyword.value) {
    return classStudents.value;
  }

  const keyword = studentSearchKeyword.value.toLowerCase();
  return classStudents.value.filter(student =>
      student.studentName?.toLowerCase().includes(keyword) ||
      student.studentNo?.toString().toLowerCase().includes(keyword) ||
      student.studentId?.toString().toLowerCase().includes(keyword)
  );
});

// 获取课程学生
const getClassStudents = async () => {
  try {
    isLoadingStudents.value = true
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/system/class/students/${courseId}?pageNum=${studentCurrentPage.value}&pageSize=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('获取课程学生名单失败')
    }

    const data = await res.json()
    if (data.data && Array.isArray(data.data.rows)) {
      classStudents.value = data.data.rows
      studentTotalPages.value = Math.ceil(data.data.total / 10) || 1
    } else if (data.data && Array.isArray(data.data)) {
      classStudents.value = data.data
      studentTotalPages.value = 1
    } else {
      classStudents.value = []
      studentTotalPages.value = 1
    }
  } catch (error) {
    console.error('获取课程学生名单失败:', error)
    showNotification('获取课程学生名单失败', 'error')
  } finally {
    isLoadingStudents.value = false
  }
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

// 显示添加学生弹窗
const showAddStudentsModal = () => {
  showAddStudentModal.value = true
  addStudentTab.value = 'class'
  selectedClassName.value = ''
  previewStudents.value = []
  manualStudentId.value = ''
  manualStudentInfo.value = null

  // 获取班级列表
  getClassNames()
}

// 关闭添加学生弹窗
const closeAddStudentModal = () => {
  showAddStudentModal.value = false
}

// 获取班级名称列表
const getClassNames = async () => {
  try {
    isLoadingClassNames.value = true
    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/system/student/classnames', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('获取班级列表失败')
    }

    const data = await res.json()
    if (data.data && Array.isArray(data.data)) {
      classNameList.value = data.data
    } else {
      classNameList.value = []
    }
  } catch (error) {
    console.error('获取班级列表失败:', error)
    showNotification('获取班级列表失败', 'error')
  } finally {
    isLoadingClassNames.value = false
  }
}

// 获取预览学生列表
const getPreviewStudents = async (className) => {
  if (!className) return

  try {
    isLoadingPreviewStudents.value = true
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/system/student/byclass/${encodeURIComponent(className)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('获取班级学生列表失败')
    }

    const data = await res.json()
    if (data.data && Array.isArray(data.data)) {
      previewStudents.value = data.data
    } else {
      previewStudents.value = []
    }
  } catch (error) {
    console.error('获取班级学生列表失败:', error)
    showNotification('获取班级学生列表失败', 'error')
  } finally {
    isLoadingPreviewStudents.value = false
  }
}

// 监听班级选择变化，加载预览学生列表
watch(selectedClassName, async (newVal) => {
  if (!newVal) {
    previewStudents.value = []
    return
  }

  await getPreviewStudents(newVal)
})

// 根据学号查询学生
let studentSearchTimeout = null
const searchStudentById = async (studentId) => {
  try {
    isSearchingStudent.value = true
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/system/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('查询学生信息失败')
    }

    const data = await res.json()
    if (data.code === 200 && data.data) {
      manualStudentInfo.value = data.data
    } else {
      manualStudentInfo.value = null
    }
  } catch (error) {
    console.error('查询学生信息失败:', error)
    manualStudentInfo.value = null
  } finally {
    isSearchingStudent.value = false
  }
}

// 监听手动输入学号变化，查询学生信息
watch(manualStudentId, (newVal) => {
  if (!newVal || newVal.length < 3) {
    manualStudentInfo.value = null
    return
  }

  // 使用防抖，避免频繁请求
  clearTimeout(studentSearchTimeout)
  studentSearchTimeout = setTimeout(() => {
    searchStudentById(newVal)
  }, 500)
})

// 确认添加学生
const confirmAddStudents = async () => {
  try {
    isAddingStudents.value = true
    const token = localStorage.getItem('token')
    let studentIds = []

    if (addStudentTab.value === 'class') {
      // 按班级添加学生
      if (!selectedClassName.value || previewStudents.value.length === 0) {
        showNotification('请选择有效的班级', 'error')
        return
      }

      studentIds = previewStudents.value.map(student => student.studentId)
    } else {
      // 手动添加单个学生
      if (!manualStudentInfo.value) {
        showNotification('请输入有效的学生学号', 'error')
        return
      }

      studentIds = [manualStudentInfo.value.studentId]
    }

    const res = await fetch('/dev-api/system/class/students/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        classId: courseId,
        studentIds: studentIds
      })
    })

    if (!res.ok) {
      throw new Error('添加学生失败')
    }

    const data = await res.json()
    if (data.code === 200) {
      showNotification('添加学生成功', 'success')
      closeAddStudentModal()
      // 刷新学生列表
      await getClassStudents()
      closeAddStudentModal()
      // 刷新学生列表
      await getClassStudents()
    } else {
      throw new Error(data.msg || '添加学生失败')
    }
  } catch (error) {
    console.error('添加学生失败:', error)
    showNotification(`添加学生失败: ${error.message}`, 'error')
  } finally {
    isAddingStudents.value = false
  }
}

// 切换学生选择状态
const toggleStudentSelection = (studentId) => {
  const index = selectedStudents.value.indexOf(studentId)
  if (index === -1) {
    selectedStudents.value.push(studentId)
  } else {
    selectedStudents.value.splice(index, 1)
  }
}

// 切换全选状态
const toggleSelectAllStudents = () => {
  if (selectAllStudents.value) {
    selectedStudents.value = []
  } else {
    selectedStudents.value = classStudents.value.map(student => student.studentId)
  }
  selectAllStudents.value = !selectAllStudents.value
}

// 批量移除学生
const batchRemoveStudents = async () => {
  if (selectedStudents.value.length === 0) {
    showNotification('请先选择要移除的学生', 'error')
    return
  }

  const confirmMessage = `确定要将选中的 ${selectedStudents.value.length} 名学生从课程中移除吗？`
  if (!confirm(confirmMessage)) {
    return
  }

  try {
    const isRemovingStudents = ref(false)
    isRemovingStudents.value = true

    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/system/class/students/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        classId: courseId,
        studentIds: selectedStudents.value
      })
    })

    if (!res.ok) {
      throw new Error('批量移除学生失败')
    }

    const data = await res.json()
    if (data.code === 200) {
      showNotification('批量移除学生成功', 'success')
      // 重置选择
      selectedStudents.value = []
      selectAllStudents.value = false
      // 刷新学生列表
      await getClassStudents()
    } else {
      throw new Error(data.msg || '批量移除学生失败')
    }
  } catch (error) {
    console.error('批量移除学生失败:', error)
    showNotification(`批量移除学生失败: ${error.message}`, 'error')
  }
}

// 移除单个学生
const removeStudentFromClass = async (student) => {
  const confirmMessage = `确定要将学生 ${student.studentName} 从课程中移除吗？`
  if (!confirm(confirmMessage)) {
    return
  }

  try {
    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/system/class/students/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        classId: courseId,
        studentIds: [student.studentId]
      })
    })

    if (!res.ok) {
      throw new Error('移除学生失败')
    }

    const data = await res.json()
    if (data.code === 200) {
      showNotification('移除学生成功', 'success')
      // 刷新学生列表
      await getClassStudents()
    } else {
      throw new Error(data.msg || '移除学生失败')
    }
  } catch (error) {
    console.error('移除学生失败:', error)
    showNotification(`移除学生失败: ${error.message}`, 'error')
  }
}

// 切换页码
const changeStudentPage = (page) => {
  studentCurrentPage.value = page
  getClassStudents()
}

// 辅助方法生成头像颜色
const getAvatarColor = (name) => {
  if (!name) return '#3b82f6'

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

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
  ]

  return colors[Math.abs(hash) % colors.length]
}

// 获取名字首字母
const getInitials = (name) => {
  if (!name) return '?'
  return name.charAt(0)
}

// 知识库相关方法
// 获取知识库列表
const getKnowledgeBases = async () => {
  try {
    isLoadingKnowledgeBases.value = true
    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/dataset/list?page=1&limit=100', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('获取知识库列表失败')
    }

    const data = await res.json()
    if (data.data && Array.isArray(data.data)) {
      knowledgeBases.value = data.data.map(kb => ({
        id: kb.id,
        name: kb.name,
        description: kb.description || '',
        document_count: kb.document_count,
        word_count: kb.word_count
      }))
    }
  } catch (error) {
    console.error('获取知识库列表失败:', error)
    showNotification('获取知识库列表失败', 'error')
  } finally {
    isLoadingKnowledgeBases.value = false
  }
}

// 显示创建知识库弹窗
const showCreateKnowledgeBaseModal = () => {
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }
  showCreateKBModal.value = true
}

// 关闭创建知识库弹窗
const closeCreateKBModal = () => {
  showCreateKBModal.value = false
  newKnowledgeBase.value = {
    name: '',
    description: ''
  }
}

// 提交创建知识库
const submitCreateKnowledgeBase = async () => {
  if (!newKnowledgeBase.value.name) return

  try {
    isCreatingKB.value = true
    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/dataset/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newKnowledgeBase.value.name,
        description: newKnowledgeBase.value.description,
        indexing_technique: 'economy',
        permission: 'all_team_members'
      })
    })

    if (res.ok) {
      showNotification('创建知识库成功', 'success')
      await getKnowledgeBases()
      closeCreateKBModal()
    } else {
      throw new Error('创建知识库失败')
    }
  } catch (error) {
    console.error('创建知识库失败:', error)
    showNotification('创建知识库失败', 'error')
  } finally {
    isCreatingKB.value = false
  }
}

// 获取文档列表
const getDocuments = async (datasetId) => {
  try {
    isLoadingDocs.value = true
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/document/list?page=1&limit=100`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({datasetId})
    })

    if (res.ok) {
      const data = await res.json()
      if (data.data && Array.isArray(data.data.items)) {
        documents.value = data.data.items
      } else if (data.data && Array.isArray(data.data)) {
        documents.value = data.data
      } else {
        documents.value = []
      }
    } else {
      throw new Error('获取文档列表失败')
    }
  } catch (error) {
    console.error('获取文档列表失败:', error)
    showNotification('获取文档列表失败', 'error')
    documents.value = []
  } finally {
    isLoadingDocs.value = false
  }
}

// 显示文档列表弹窗
const showDocumentsModal = async (kb) => {
  currentKnowledgeBase.value = kb
  showDocsModal.value = true
  await getDocuments(kb.id)
}

// 关闭文档列表弹窗
const closeDocsModal = () => {
  showDocsModal.value = false
}

// 显示添加文档弹窗
const showAddDocumentModal = (kb) => {
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }
  currentKnowledgeBase.value = kb
  addDocTab.value = 'upload'
  selectedFile.value = null
  newDocument.value = {
    name: '',
    text: ''
  }
  showAddDocModal.value = true
}

// 关闭添加文档弹窗
const closeAddDocModal = () => {
  showAddDocModal.value = false
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click()
}

// 文件拖放处理
const onFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    // 检查文件大小
    if (file.size > 15 * 1024 * 1024) {
      showNotification('文件大小不能超过 15MB', 'error')
      return
    }

    // 检查文件类型
    const allowedExtensions = [
      '.txt', '.markdown', '.mdx', '.pdf', '.html',
      '.xlsx', '.xls', '.docx', '.csv', '.md', '.htm'
    ]

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

    if (!allowedExtensions.includes(fileExtension)) {
      showNotification('不支持的文件类型', 'error')
      return
    }

    selectedFile.value = file
  }
}

// 文件选择处理
const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 检查文件大小
    if (file.size > 15 * 1024 * 1024) {
      showNotification('文件大小不能超过 15MB', 'error')
      return
    }

    // 检查文件类型
    const allowedExtensions = [
      '.txt', '.markdown', '.mdx', '.pdf', '.html',
      '.xlsx', '.xls', '.docx', '.csv', '.md', '.htm'
    ]

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

    if (!allowedExtensions.includes(fileExtension)) {
      showNotification('不支持的文件类型', 'error')
      return
    }

    selectedFile.value = file
  }
}

// 提交添加文档
const submitAddDocument = async () => {
  if (addDocTab.value === 'upload' && !selectedFile.value) return
  if (addDocTab.value === 'text' && (!newDocument.value.name || !newDocument.value.text)) return

  try {
    isAddingDoc.value = true
    const token = localStorage.getItem('token')

    if (addDocTab.value === 'upload') {
      // 创建FormData对象
      const formData = new FormData()
      formData.append('file', selectedFile.value)
      formData.append('datasetId', currentKnowledgeBase.value.id)

      // 添加固定的JSON数据
      const processData = JSON.stringify({
        indexing_technique: "economy",
        process_rule: {
          mode: "automatic",
          rules: {}
        }
      })
      formData.append('data', processData)

      // 发送请求到后端API
      const response = await fetch('/dev-api/document/createByFile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`上传失败: ${response.status}`)
      }

      showNotification('文件上传成功', 'success')
      await getDocuments(currentKnowledgeBase.value.id)
      closeAddDocModal()
    } else {
      // 手动输入文本创建文档
      const res = await fetch('/dev-api/document/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          datasetId: currentKnowledgeBase.value.id,
          name: newDocument.value.name,
          text: newDocument.value.text,
          indexingTechnique: 'economy',
          processRule: {mode: 'automatic'}
        })
      })

      if (res.ok) {
        showNotification('文档创建成功', 'success')
        await getDocuments(currentKnowledgeBase.value.id)
        closeAddDocModal()
      } else {
        throw new Error('文档创建失败')
      }
    }
  } catch (error) {
    console.error('添加文档失败:', error)
    showNotification('添加文档失败', 'error')
  } finally {
    isAddingDoc.value = false
  }
}

// 查看文档内容
const viewDocument = async (doc) => {
  currentDocument.value = doc
  showDocContentModal.value = true

  // 如果文档没有text字段，需要获取文档内容
  if (!doc.text) {
    try {
      isLoadingDocContent.value = true
      const token = localStorage.getItem('token')

      const res = await fetch(`/dev-api/document/${doc.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        if (data.data) {
          currentDocument.value = {
            ...doc,
            text: data.data.text || '无法获取文档内容'
          }
        }
      } else {
        throw new Error('获取文档内容失败')
      }
    } catch (error) {
      console.error('获取文档内容失败:', error)
      showNotification('获取文档内容失败', 'error')
      currentDocument.value = {
        ...doc,
        text: '获取文档内容失败'
      }
    } finally {
      isLoadingDocContent.value = false
    }
  }
}

// 关闭文档内容弹窗
const closeDocContentModal = () => {
  showDocContentModal.value = false
}

// 确认删除知识库
const confirmDeleteKnowledgeBase = (id, name) => {
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }
  deleteType.value = 'kb'
  itemToDelete.value = {id, name}
  showDeleteConfirm.value = true
}

// 确认删除文档
const confirmDeleteDocument = (id, name) => {
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }
  deleteType.value = 'doc'
  itemToDelete.value = {id, name}
  showDeleteConfirm.value = true
}

// 取消删除
const cancelDelete = () => {
  showDeleteConfirm.value = false
  itemToDelete.value = {id: '', name: ''}
}

// 确认删除
const confirmDelete = async () => {
  if (!itemToDelete.value.id) return

  try {
    isDeleting.value = true
    const token = localStorage.getItem('token')

    if (deleteType.value === 'kb') {
      // 删除知识库
      const res = await fetch(`/dev-api/dataset/delete/${itemToDelete.value.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        showNotification(`知识库 "${itemToDelete.value.name}" 已删除`, 'success')
        await getKnowledgeBases()
      } else {
        throw new Error('删除知识库失败')
      }
    } else {
      // 删除文档
      const res = await fetch('/dev-api/document/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          datasetId: currentKnowledgeBase.value.id,
          documentId: itemToDelete.value.id
        })
      })

      if (res.ok) {
        showNotification(`文档 "${itemToDelete.value.name}" 已删除`, 'success')
        await getDocuments(currentKnowledgeBase.value.id)
      } else {
        throw new Error('删除文档失败')
      }
    }

    showDeleteConfirm.value = false
  } catch (error) {
    console.error('删除失败:', error)
    showNotification('删除失败', 'error')
  } finally {
    isDeleting.value = false
  }
}

// 显示通知
const showNotification = (message, type = 'info') => {
  notification.value = {
    show: true,
    message,
    type
  }

  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }
}

// 判断用户是否为教师
const isTeacher = computed(() => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    return userInfo.roles?.some(role => role.roleKey === 'tea')
  }
  return false
})

// 显示学生画像
function showStudentProfile(studentId) {
  showStudentSearch.value = true;
  profileForm.userName = studentId;
  nextTick(() => {
    searchStudentProfile();
  });
}

// 查询学生画像
function searchStudentProfile() {
  if (!profileForm.userName) {
    ElMessage.warning('请输入学生学号');
    return;
  }

  searchingProfile.value = true;
  getStudentProfile(profileForm.userName).then(res => {
    profileSearched.value = true;

    if (res.code === 200 && res.data) {
      // 添加userName到studentProfile
      studentProfile.value = {
        ...res.data,
        userName: profileForm.userName || res.data.userName || '未知学生',
        // 确保这些字段始终存在，即使为空也不用默认值替代
        totalQuestions: res.data.totalQuestions !== undefined ? res.data.totalQuestions : '无数据',
        mainSubject: res.data.mainSubject || '暂无数据',
        lastActiveTime: res.data.lastActiveTime || '暂无记录',
        learningStatus: res.data.learningStatus || '未知状态'
      };

      // 学习进度数据 - 不使用默认后备数据
      if (res.data.learningProgressItems && res.data.learningProgressItems.length > 0) {
        learningProgressItems.value = res.data.learningProgressItems.map(item => ({
          label: item.dimensionName,
          value: item.score,
          color: item.color || getLearningScoreColor(item.score)
        }));
      } else {
        // 显示无数据状态
        learningProgressItems.value = [];
      }

      // 学习建议数据 - 不使用默认后备数据
      if (res.data.recommendationItems && res.data.recommendationItems.length > 0) {
        recommendationItems.value = res.data.recommendationItems;
      } else {
        // 显示无数据状态
        recommendationItems.value = [];
      }

      nextTick(() => {
        initStudentComplexityChart();
      });
    } else {
      // 重置为空对象但添加userName
      studentProfile.value = {
        userName: profileForm.userName,
        totalQuestions: '无数据',
        mainSubject: '暂无数据',
        lastActiveTime: '暂无记录',
        learningStatus: '未知状态'
      };
      learningProgressItems.value = [];
      recommendationItems.value = [];
    }
  }).catch(() => {
    profileSearched.value = true;
    // 重置为空对象但添加userName
    studentProfile.value = {
      userName: profileForm.userName,
      totalQuestions: '无数据',
      mainSubject: '暂无数据',
      lastActiveTime: '暂无记录',
      learningStatus: '未知状态'
    };
    learningProgressItems.value = [];
    recommendationItems.value = [];
  }).finally(() => {
    searchingProfile.value = false;
  });
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

// 初始化学生复杂度分布图表
function initStudentComplexityChart() {
  if (charts.studentComplexityChart) {
    charts.studentComplexityChart.dispose();
  }

  if (!studentComplexityChartRef.value) {
    console.warn('找不到图表DOM引用');
    return;
  }

  charts.studentComplexityChart = echarts.init(studentComplexityChartRef.value);
  const complexityData = studentProfile.value.complexityDistribution || {simple: 0, medium: 0, complex: 0};

  // 检查是否所有复杂度数据都为0，表示无数据
  const hasComplexityData = complexityData.simple > 0 || complexityData.medium > 0 || complexityData.complex > 0;

  if (!hasComplexityData) {
    // 显示无数据状态
    charts.studentComplexityChart.setOption({
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'middle',
        textStyle: {
          color: '#999',
          fontSize: 16
        }
      }
    });
    return;
  }

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
                {offset: 0, color: '#67C23A'},
                {offset: 1, color: '#95EB85'}
              ])
            }
          },
          {
            value: complexityData.medium || 0,
            name: '中等',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: '#E6A23C'},
                {offset: 1, color: '#F8D878'}
              ])
            }
          },
          {
            value: complexityData.complex || 0,
            name: '复杂',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: '#F56C6C'},
                {offset: 1, color: '#FF9B9B'}
              ])
            }
          }
        ],
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function () {
          return Math.random() * 200;
        }
      }
    ]
  };

  charts.studentComplexityChart.setOption(option);
}


// 监听activeTab变化，加载相应数据
watch(activeTab, (newVal) => {
  if (newVal === 'students') {
    getClassStudents()
  } else if (newVal === 'knowledge') {
    getKnowledgeBases()
  }
})

onMounted(() => {
  getCourseInfo()
  getClassStudents()
})
</script>

<style src="./CourseDetail.css" scoped></style>
