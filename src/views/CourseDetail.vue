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
      <button
          class="admin-nav-item"
          :class="{ active: activeTab === 'homework' }"
          @click="activeTab = 'homework'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        作业练习
      </button>
      <button
          class="admin-nav-item"
          :class="{ active: activeTab === 'teaching' }"
          @click="activeTab = 'teaching'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        教学设计
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
          <h3>知识库管理</h3>
          <button class="action-button primary" @click="openCreateFolderModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 class="lucide lucide-folder-plus">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
              <path d="M12 10v6"></path>
              <path d="M9 13h6"></path>
            </svg>
            新建文件夹
          </button>
        </div>

        <div v-if="isLoadingFolders" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="folders.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-folder">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
          </svg>
          <p>暂无文件夹，请点击上方按钮创建</p>
        </div>

        <div v-else class="folder-list">
          <div v-for="folder in folders" :key="folder.zskId" class="folder-item">
            <div class="folder-info" @click="showFolderFiles(folder)">
              <div class="folder-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     class="lucide lucide-folder">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                </svg>
              </div>
              <div class="folder-name" :data-fullname="folder.zskName">{{ folder.zskName }}</div>
              <div class="file-details">
                <span class="file-date">{{ folder.createTime }}</span>
              </div>
            </div>
            <div class="folder-actions">
              <button class="action-button small" @click="openRenameModal(folder)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     class="lucide lucide-edit">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  <path d="m15 5 4 4"></path>
                </svg>
                重命名
              </button>
              <button class="action-button small" @click="showAddDocumentModal(folder)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     class="lucide lucide-file-plus">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" x2="12" y1="18" y2="12"></line>
                  <line x1="9" x2="15" y1="15" y2="15"></line>
                </svg>
                上传文档
              </button>
              <button v-if="isTeacher" class="delete-btn" @click="confirmDeleteFolder(folder)">
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

      <div v-if="showRenameModal" class="modal-backdrop" @click="closeRenameModal"></div>
      <div v-if="showRenameModal" class="modal-container rename-modal">
        <div class="modal-header">
          <h3>重命名{{ renameType === 'folder' ? '文件夹' : '文件' }}</h3>
          <button class="close-button" @click="closeRenameModal">
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
            <label for="rename-input">新名称</label>
            <input
                type="text"
                id="rename-input"
                v-model="newName"
                placeholder="请输入新名称"
                class="form-input"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="action-button" @click="closeRenameModal">取消</button>
          <button
              class="action-button primary"
              @click="confirmRename"
              :disabled="!newName || isRenaming"
          >
            <span v-if="isRenaming">重命名中...</span>
            <span v-else>确认重命名</span>
          </button>
        </div>
      </div>

      <!-- 文件列表弹窗 -->
      <div v-if="showFilesModal" class="modal-backdrop" @click="closeFilesModal"></div>
      <div v-if="showFilesModal" class="modal-container files-modal">
        <div class="modal-header">
          <h3>{{ currentFolder?.zskName }} 的文件</h3>
          <button class="close-button" @click="closeFilesModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 class="lucide lucide-x">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="isLoadingFiles" class="loading-container">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>

          <div v-else-if="files.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 class="lucide lucide-file-text">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" x2="8" y1="13" y2="13"></line>
              <line x1="16" x2="8" y1="17" y2="17"></line>
              <line x1="10" x2="8" y1="9" y2="9"></line>
            </svg>
            <p>暂无文件，请点击"上传文档"按钮添加</p>
          </div>

          <div v-else class="files-list">
            <div v-for="file in files" :key="file.zskId" class="file-item">
              <div class="file-info">
                <div class="file-name" :data-fullname="file.zskName">{{ file.zskName }}</div>
                <div class="file-details">
                  <span class="file-date">{{ file.createTime }}</span>
                </div>
              </div>
              <div class="file-actions">
                <button class="action-button small" @click="openRenameModal(file)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                       class="lucide lucide-edit">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    <path d="m15 5 4 4"></path>
                  </svg>
                  重命名
                </button>
<!--                <button class="action-button small" @click="viewFile(file)">-->
<!--                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"-->
<!--                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"-->
<!--                       class="lucide lucide-eye">-->
<!--                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>-->
<!--                    <circle cx="12" cy="12" r="3"></circle>-->
<!--                  </svg>-->
<!--                  查看-->
<!--                </button>-->
                <button v-if="isTeacher" class="delete-btn" @click="confirmDeleteFile(file)">
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

        <div class="modal-footer">
          <button v-if="isTeacher" class="action-button primary" @click="showAddDocumentModal(currentFolder)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 class="lucide lucide-file-plus">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" x2="12" y1="18" y2="12"></line>
              <line x1="9" x2="15" y1="15" y2="15"></line>
            </svg>
            上传文档
          </button>
        </div>
      </div>


      <!-- 作业练习视图 -->
      <div v-if="activeTab === 'homework'" class="admin-panel">
        <div class="admin-panel-header">
          <h3>作业练习管理</h3>
          <button class="action-button primary" @click="showGenerateExamModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            生成作业/试卷
          </button>
        </div>

        <div v-if="isLoadingExams" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="examList.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <p>暂无作业/试卷，请点击上方按钮创建</p>
        </div>

        <div v-else class="exam-list">
          <!-- 这里将显示已生成的作业/试卷列表 -->
          <div v-for="exam in examList" :key="exam.id" class="exam-item">
            <div class="exam-info">
              <div class="exam-name">{{ exam.title }}</div>
              <div class="exam-details">
                <span class="exam-date">创建时间: {{ exam.createTime }}</span>
                <span class="exam-period">考试时间: {{ exam.startTime }} 至 {{ exam.endTime }}</span>
                <span class="exam-duration">时长: {{ exam.duration }}分钟</span>
                <span class="exam-score">总分: {{ exam.totalScore }}分</span>
              </div>
            </div>
            <div class="exam-actions">
              <button class="action-button small" @click="viewExam(exam)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     class="lucide lucide-eye">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                查看
              </button>

              <button v-if="isTeacher" class="delete-btn" @click="confirmDeleteExam(exam)">
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

      <!-- 生成作业/试卷弹窗 -->
      <div v-if="showExamModal" class="modal-backdrop" @click="closeExamModal"></div>
      <div v-if="showExamModal" class="modal-container exam-modal">
        <div class="modal-header">
          <h3>生成作业/试卷</h3>
          <button class="close-button" @click="closeExamModal">
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
            <label for="exam-subject">课程名称</label>
            <input
                type="text"
                id="exam-subject"
                v-model="examForm.subject"
                placeholder="请输入课程名称，如：Java基础"
                class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="exam-requirements">题目要求</label>
            <textarea
                id="exam-requirements"
                v-model="examForm.requirements"
                placeholder="请输入对试卷内容的具体要求，如题型、难度等"
                class="form-textarea"
                rows="4"
            ></textarea>
          </div>

          <div class="form-group-row">
            <div class="form-group half">
              <label for="exam-start-time">开始时间</label>
              <input
                  type="datetime-local"
                  id="exam-start-time"
                  v-model="examForm.startTime"
                  class="form-input"
              />
            </div>

            <div class="form-group half">
              <label for="exam-end-time">结束时间</label>
              <input
                  type="datetime-local"
                  id="exam-end-time"
                  v-model="examForm.endTime"
                  class="form-input"
              />
            </div>
          </div>
        </div>

        <div v-if="isGeneratingExam" class="generating-container">
          <div class="loading-spinner"></div>
          <p>正在生成作业/试卷，请稍候...</p>
          <div class="generation-progress">
            <div class="progress-messages">
              <div v-for="(message, index) in generationMessages" :key="index" class="progress-message">
                {{ message }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="action-button" @click="closeExamModal" :disabled="isGeneratingExam">取消</button>
          <button
              class="action-button primary"
              @click="generateExam"
              :disabled="isGeneratingExam || !examForm.subject || !examForm.startTime || !examForm.endTime"
          >
            <span v-if="isGeneratingExam">生成中...</span>
            <span v-else>开始生成</span>
          </button>
        </div>
      </div>

      <!-- 教学设计视图 -->
      <div v-if="activeTab === 'teaching'" class="admin-panel">
        <TeachingDesignTab
            :course-id="courseId"
            :is-teacher="isTeacher"
            :course-name="courseInfo.className"
            :showNotification="showNotification"
        />
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

        <div v-else-if="classStudents.length === 0" class="tudent-management">
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
            <!-- 移除、添加学生按钮 -->
            <div class="student-actions-right">
              <button
                  v-if="selectedStudents.length > 0"
                  class="action-button warning"
                  @click="batchRemoveStudents"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     class="lucide lucide-user-minus">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="16" x2="22" y1="11" y2="11"></line>
                </svg>
                批量移除 ({{ selectedStudents.length }})
              </button>
              &nbsp;
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
          <div class="empty-state ">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               class="lucide lucide-user-x">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="17" x2="22" y1="8" y2="13"></line>
            <line x1="22" x2="17" y1="8" y2="13"></line>
          </svg>
          <p>课程暂无学生</p>
          </div>
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

            <!-- 班级筛选下拉框 -->
            <div class="class-filter">
              <div class="multi-select-dropdown">
                <div class="multi-select-header" @click="toggleClassDropdown">
                    <span>班级筛选: {{
                        selectedClassCount === uniqueClassNames.length ? '全部' :
                            selectedClassCount === 0 ? '未选择' :
                            selectedClassCount === 1 ? selectedClasses[0] :
                            selectedClassCount <= 3 ? selectedClasses.join(', ') :
                            `${selectedClasses.slice(0, 2).join(', ')} 等${selectedClassCount}个班级`
                    }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon" :class="{ 'open': showClassDropdown }">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
                <div v-if="showClassDropdown" class="multi-select-options">
                  <div class="multi-select-all">
                    <input type="checkbox" id="select-all-classes" :checked="isAllClassesSelected" @change="toggleAllClasses"/>
                    <label for="select-all-classes">全选</label>
                  </div>
                  <div v-for="className in uniqueClassNames" :key="className" class="multi-select-option">
                    <input type="checkbox" :id="`class-${className}`" :checked="selectedClasses.includes(className)" @change="toggleClassSelection(className)" />
                    <label :for="`class-${className}`">{{ className || '未分配班级' }}</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 全选按钮 -->
            <div class="student-selection">
              <input type="checkbox" id="select-all-students" :checked="selectAllStudents" @change="toggleSelectAllStudents" />
              <label for="select-all-students">全选</label>
            </div>

            <!-- 移除、添加学生按钮 -->
            <div class="student-actions-right">
              <button
                  v-if="selectedStudents.length > 0"
                  class="action-button warning"
                  @click="batchRemoveStudents"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     class="lucide lucide-user-minus">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="16" x2="22" y1="11" y2="11"></line>
                </svg>
                批量移除 ({{ selectedStudents.length }})
              </button>
              &nbsp;
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

          <!-- 学生卡片网格 - 使用过滤后的学生列表 -->
          <div class="student-list-grid">
            <div
                v-for="student in filteredByClassStudents"
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
                  <span v-if="student.className" class="student-class">班级: {{ student.className }}</span>
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

          <div v-if="filteredByClassStudents.length === 0 && classStudents.length > 0" class="empty-search-result">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
            </svg>
            <p>没有找到匹配的学生</p>
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
<!--          <button-->
<!--              class="tab-button"-->
<!--              :class="{ 'active': addDocTab === 'text' }"-->
<!--              @click="addDocTab = 'text'"-->
<!--          >-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"-->
<!--                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"-->
<!--                 class="lucide lucide-text">-->
<!--              <path d="M17 6.1H3"></path>-->
<!--              <path d="M21 12.1H3"></path>-->
<!--              <path d="M15.1 18H3"></path>-->
<!--            </svg>-->
<!--            手动输入-->
<!--          </button>-->
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

    <!-- 创建文件夹弹窗 -->
    <div v-if="showCreateFolderModal" class="modal-backdrop" @click="closeCreateFolderModal"></div>
    <div v-if="showCreateFolderModal" class="modal-container create-modal">
      <div class="modal-header">
        <h3>创建文件夹</h3>
        <button class="close-button" @click="closeCreateFolderModal">
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
          <label for="folder-name">文件夹名称</label>
          <input
              type="text"
              id="folder-name"
              v-model="newFolder.name"
              placeholder="请输入文件夹名称"
              class="form-input"
          />
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button" @click="closeCreateFolderModal">取消</button>
        <button
            class="action-button primary"
            @click="createFolder"
            :disabled="!newFolder.name"
        >
          <span v-if="isCreatingFolder">创建中...</span>
          <span v-else>确认创建</span>
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
        <!-- 按班级添加部分的修改 -->
        <div v-if="addStudentTab === 'class'" class="class-selection-tab">
          <div v-if="isLoadingCollege || isLoadingMajor || isLoadingClas || isLoadingPreviewStudents" class="loading-container small">
            <div class="loading-spinner"></div>
            <p>加载数据中...</p>
          </div>
          <div v-else>
            <!-- 学院专业班级选择区域（横向排列） -->
            <div class="selection-row">
              <!-- 学院选择 -->
              <div class="form-group-horizontal">
                <label for="college-select">选择学院</label>
                <select
                    id="college-select"
                    v-model="selectedCollegeId"
                    class="form-input"
                    @change="handleCollegeChange"
                >
                  <option value="">请选择学院</option>
                  <option v-for="college in collegeList" :key="college.collegeId" :value="college.collegeId">
                    {{ college.collegeName }}
                  </option>
                </select>
              </div>

              <!-- 专业选择 -->
              <div class="form-group-horizontal" :class="{'disabled': !selectedCollegeId}">
                <label for="major-select">选择专业</label>
                <select
                    id="major-select"
                    v-model="selectedMajorId"
                    class="form-input"
                    @change="handleMajorChange"
                    :disabled="!selectedCollegeId"
                >
                  <option value="">请选择专业</option>
                  <option v-for="major in majorList" :key="major.majorId" :value="major.majorId">
                    {{ major.majorName }}
                  </option>
                </select>
              </div>

              <!-- 班级选择 -->
              <div class="form-group-horizontal" :class="{'disabled': !selectedMajorId}">
                <label for="class-select">选择班级</label>
                <select
                    id="class-select"
                    v-model="selectedClassId"
                    class="form-input"
                    @change="handleClassChange"
                    :disabled="!selectedMajorId"
                >
                  <option value="">请选择班级</option>
                  <option v-for="clas in classList" :key="clas.clasId" :value="clas.clasId">
                    {{ clas.clasName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 预览学生列表 -->
            <div v-if="selectedClassId" class="preview-container">
              <div class="preview-header">
                <h4>预览: 选中班级学生 ({{ previewStudents.length }}人)</h4>
              </div>

              <div v-if="previewStudents.length === 0" class="empty-state small">
                <p>该班级暂无学生</p>
              </div>

              <div v-else class="preview-students">
                <div v-for="student in previewStudents" :key="student.studentId" class="preview-student-item">
                  <div class="student-name">{{ student.studentName }}</div>
                  <div class="student-id">{{ student.studentNo }}</div>
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
            (addStudentTab === 'class' && !selectedClassId) ||
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
              <div v-if="learningProgressItems.length > 0" class="learning-progress">
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

  <!-- 试卷查看器模态框 -->
  <ExamViewerModal
      :visible.sync="showExamViewerModal"
      :examData="currentExamData"
      @close="showExamViewerModal = false"
  />
</template>

<script setup>
import {ref, reactive, computed, onMounted, nextTick, watch, onUnmounted} from 'vue'
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
import ExamViewerModal from '@/components/ExamViewerModal.vue'
import TeachingDesignViewerModal from '@/components/TeachingDesignViewerModal.vue'
import TeachingDesignTab from '@/components/TeachingDesignTab.vue'

const showExamViewerModal = ref(false)
const currentExamData = ref(null)
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

// 在 script setup 部分添加以下代码
const showRenameModal = ref(false)
const renameType = ref('') // 'folder' 或 'file'
const itemToRename = ref(null)
const newName = ref('')
const isRenaming = ref(false)

// 作业/试卷相关状态
const examList = ref([])
const isLoadingExams = ref(false)
const showExamModal = ref(false)
const isGeneratingExam = ref(false)
const generationMessages = ref([])
const examForm = ref({
  subject: '',
  requirements: '',
  startTime: '',
  endTime: ''
})

// 初始化日期时间
const initExamDates = () => {
  const now = new Date()
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 明天
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000) // 开始后2小时

  examForm.value.startTime = formatDateTimeForInput(start)
  examForm.value.endTime = formatDateTimeForInput(end)
}

// 格式化日期时间为input[type=datetime-local]所需格式
const formatDateTimeForInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// 格式化日期时间为后端所需格式
const formatDateTimeForBackend = (dateTimeString) => {
  if (!dateTimeString) return ''
  return dateTimeString.replace('T', ' ') + ':00'
}

// 显示生成作业/试卷弹窗
const showGenerateExamModal = () => {
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }

  initExamDates()
  showExamModal.value = true
}

// 关闭生成作业/试卷弹窗
const closeExamModal = () => {
  if (isGeneratingExam.value) {
    // 如果正在生成，询问是否确认取消
    if (confirm('生成过程中关闭将取消生成，确定要关闭吗？')) {
      if (eventSource) {
        eventSource.close()
      }
      isGeneratingExam.value = false
    } else {
      return
    }
  }

  showExamModal.value = false
  examForm.value = {
    subject: '',
    requirements: '',
    startTime: '',
    endTime: ''
  }
  generationMessages.value = []
}

let eventSource = null

// 生成作业/试卷
const generateExam = async () => {
  if (!examForm.value.subject || !examForm.value.startTime || !examForm.value.endTime) {
    showNotification('请填写必要信息', 'error')
    return
  }

  try {
    isGeneratingExam.value = true
    generationMessages.value = ['正在准备生成作业/试卷...']

    // 获取用户ID
    let teacherId = null
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      teacherId = userInfo.userId || userInfo.teacherId || null
    }

    if (!teacherId) {
      throw new Error('无法获取教师ID')
    }

    const requestData = {
      subject: examForm.value.subject,
      teacherId: teacherId,
      classId: courseId,
      startTime: formatDateTimeForBackend(examForm.value.startTime),
      endTime: formatDateTimeForBackend(examForm.value.endTime),
      requirements: examForm.value.requirements
    }

    const token = localStorage.getItem('token')
    const url = `/dev-api/exam/generate`

    generationMessages.value.push('开始生成试卷，请稍候...')

    // 使用fetch API发送请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      throw new Error(`服务器错误: ${response.status}`)
    }

    // 处理SSE流
    const reader = response.body.getReader()
    let decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      const text = decoder.decode(value)
      const lines = text.split('\n')

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const data = JSON.parse(line.substring(5))
            if (data.message) {
              generationMessages.value.push(data.message)
            }
          } catch (e) {
            // 如果不是JSON，则直接添加消息
            const message = line.substring(5).trim()
            if (message) {
              generationMessages.value.push(message)
            }
          }
        }
      }
    }

    generationMessages.value.push('试卷生成成功！')
    showNotification('作业/试卷生成成功', 'success')

    setTimeout(() => {
      isGeneratingExam.value = false
      closeExamModal()
      getExamList()
    }, 2000)

  } catch (error) {
    console.error('生成作业/试卷失败:', error)
    showNotification(`生成失败: ${error.message}`, 'error')
    isGeneratingExam.value = false
  }
}

// 获取作业/试卷列表
const getExamList = async () => {
  try {
    isLoadingExams.value = true
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/system/paper/listByCourseId/${courseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('获取作业/试卷列表失败')
    }

    const data = await res.json()
    if (data.code === 200 && Array.isArray(data.rows)) {
      examList.value = data.rows
    } else {
      examList.value = []
    }
  } catch (error) {
    console.error('获取作业/试卷列表失败:', error)
    showNotification('获取作业/试卷列表失败', 'error')
    examList.value = []
  } finally {
    isLoadingExams.value = false
  }
}


// 查看作业/试卷
const viewExam = (exam) => {
  // 这里可以实现查看作业/试卷的详情功能
  currentExamData.value = exam
  showExamViewerModal.value = true
}

// 确认删除作业/试卷
const confirmDeleteExam = (exam) => {
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }

  if (confirm(`确定要删除"${exam.subject}"吗？`)) {
    deleteExam(exam.id)
  }
}

// 删除作业/试卷
// 删除作业/试卷
const deleteExam = async (examId) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/system/paper/${examId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('删除作业/试卷失败')
    }

    showNotification('删除成功', 'success')
    await getExamList()
  } catch (error) {
    console.error('删除作业/试卷失败:', error)
    showNotification('删除作业/试卷失败', 'error')
  }
}


// 显示重命名弹窗
const openRenameModal = (item, type) => {
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }
  renameType.value = type
  itemToRename.value = item
  newName.value = item.zskName
  showRenameModal.value = true
}

// 关闭重命名弹窗
const closeRenameModal = () => {
  showRenameModal.value = false
  renameType.value = ''
  itemToRename.value = null
  newName.value = ''
}

// 确认重命名
// 修改 confirmRename 方法
const confirmRename = async () => {
  if (!itemToRename.value || !newName.value) return

  try {
    isRenaming.value = true
    const token = localStorage.getItem('token')

    const endpoint = renameType.value === 'folder'
        ? `/dev-api/folder/rename/${itemToRename.value.zskId}`
        : `/dev-api/folder/file/rename/${itemToRename.value.zskId}`

    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newName.value
      })
    })

    const data = await res.text() // 先获取响应文本
    if (res.ok) {
      showNotification(`${renameType.value === 'folder' ? '文件夹' : '文件'}重命名成功`, 'success')
      if (currentFolder.value && currentFolder.value.zskId) {
        // 确保currentFolder存在再调用
        console.log('getFilesByFolder')
        await getFilesByFolder(currentFolder.value.zskId)
      }else {
        console.log('getFolders')
        await getFolders()
      }
      closeRenameModal()
    } else {
      throw new Error(data || `${renameType.value === 'folder' ? '文件夹' : '文件'}重命名失败`)
    }
  } catch (error) {
    console.error('重命名失败:', error)
    showNotification(error.message || '重命名失败', 'error')
  } finally {
    isRenaming.value = false
  }
}



// 知识库相关状态
const folders = ref([])
const files = ref([])
const isLoadingFolders = ref(false)
const isLoadingFiles = ref(false)
const currentFolder = ref(null)
const showFilesModal = ref(false)

// 新增文件夹相关状态
const newFolder = ref({
  name: ''
})
const isCreatingFolder = ref(false)

const showCreateFolderModal = ref(false)

// 显示创建文件夹弹窗
const openCreateFolderModal = () => {
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }
  showCreateFolderModal.value = true
}

// 关闭创建文件夹弹窗
const closeCreateFolderModal = () => {
  showCreateFolderModal.value = false
  newFolder.value = {
    name: ''
  }
}

// 确认删除文件夹
const confirmDeleteFolder = (folder) => {
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }
  deleteType.value = 'folder'
  itemToDelete.value = {id: folder.zskId, name: folder.zskName}
  showDeleteConfirm.value = true
}

// 确认删除文件
const confirmDeleteFile = (file) => {
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }
  deleteType.value = 'file'
  itemToDelete.value = {id: file.zskId, name: file.zskName}
  showDeleteConfirm.value = true
}

// 查看文件内容
const viewFile = (file) => {
  // 这里可以添加查看文件内容的逻辑
  showNotification('文件内容查看功能尚未实现', 'info')
}


// 获取文件夹列表
const getFolders = async () => {
  try {
    isLoadingFolders.value = true
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/folder/list/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('获取文件夹列表失败')
    }

    const data = await res.json()
    console.log('文件夹数据:', data) // 添加日志

    if (Array.isArray(data)) {
      folders.value = data
    } else {
      folders.value = []
    }
  } catch (error) {
    console.error('获取文件夹列表失败:', error)
    showNotification('获取文件夹列表失败', 'error')
  } finally {
    isLoadingFolders.value = false
  }
}

// 获取文件夹下的文件列表
const getFilesByFolder = async (folderId) => {
  try {
    isLoadingFiles.value = true
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/folder/files/${folderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('获取文件列表失败')
    }

    const data = await res.json()
    console.log('文件数据:', data) // 添加日志

    // 修改这里，直接使用返回的数据，不需要检查data.data
    if (Array.isArray(data)) {
      files.value = data
    } else {
      files.value = []
    }

    console.log('files.value:', files.value) // 添加日志
  } catch (error) {
    console.error('获取文件列表失败:', error)
    showNotification('获取文件列表失败', 'error')
  } finally {
    isLoadingFiles.value = false
  }
}

// 显示文件夹文件列表
const showFolderFiles = async (folder) => {
  currentFolder.value = folder
  showFilesModal.value = true
  await getFilesByFolder(folder.zskId)
}

// 关闭文件列表弹窗
const closeFilesModal = () => {
  showFilesModal.value = false
  currentFolder.value = null
  files.value = []
}



// 删除文件夹
const deleteFolder = async (folder) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/folder/delete/${folder.zskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.ok) {
      showNotification('删除文件夹成功', 'success')
      await getFolders()
    } else {
      throw new Error('删除文件夹失败')
    }
  } catch (error) {
    console.error('删除文件夹失败:', error)
    showNotification('删除文件夹失败', 'error')
  }
}

// 删除文件
const deleteFile = async (file) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`/dev-api/folder/delete/${file.zskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.ok) {
      showNotification('删除文件成功', 'success')
      await getFilesByFolder(currentFolder.value.zskId)
    } else {
      throw new Error('删除文件失败')
    }
  } catch (error) {
    console.error('删除文件失败:', error)
    showNotification('删除文件失败', 'error')
  }
}

// 监听activeTab变化，加载相应数据
// 监听activeTab变化，加载相应数据
watch(activeTab, (newVal) => {
  if (newVal === 'students') {
    getClassStudents()
  } else if (newVal === 'knowledge') {
    getFolders()
  } else if (newVal === 'homework') {
    getExamList()
  }
})

// 添加班级折叠状态管理
const expandedClasses = ref({});

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

// 班级筛选相关
const showClassDropdown = ref(false);
const selectedClasses = ref([]);

// 获取所有唯一的班级名称
const uniqueClassNames = computed(() => {
  const classNames = classStudents.value.map(student => student.className || '未分配班级');
  return [...new Set(classNames)];
});

// 初始化选中所有班级
watch(uniqueClassNames, (newClasses) => {
  // 仅当selectedClasses为空时初始化（首次加载）
  if (selectedClasses.value.length === 0 && newClasses.length > 0) {
    selectedClasses.value = [...newClasses];
  }
}, { immediate: true });

// 是否所有班级都被选中
const isAllClassesSelected = computed(() => {
  return selectedClasses.value.length === uniqueClassNames.value.length;
});

// 已选班级数量
const selectedClassCount = computed(() => {
  return selectedClasses.value.length;
});

// 切换班级下拉框显示
const toggleClassDropdown = () => {
  showClassDropdown.value = !showClassDropdown.value;
};

// 切换单个班级选择状态
const toggleClassSelection = (className) => {
  const index = selectedClasses.value.indexOf(className);
  if (index === -1) {
    selectedClasses.value.push(className);
  } else {
    selectedClasses.value.splice(index, 1);
  }
};

// 切换全选班级
const toggleAllClasses = () => {
  if (isAllClassesSelected.value) {
    selectedClasses.value = [];
  } else {
    selectedClasses.value = [...uniqueClassNames.value];
  }
};

// 根据选中的班级和搜索关键词过滤学生
const filteredByClassStudents = computed(() => {
  // 首先按搜索关键词过滤
  let result = filteredStudents.value;

  // 如果没有选中任何班级，显示为空
  if (selectedClasses.value.length === 0) {
    return [];
  }

  // 然后按选中的班级过滤
  return result.filter(student =>
      selectedClasses.value.includes(student.className || '未分配班级')
  );
});

// 点击其他区域关闭下拉框
onMounted(() => {
  // ... existing code ...

  // 添加点击外部关闭班级下拉框的事件监听
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.multi-select-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      showClassDropdown.value = false;
    }
  });
});

// 在组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', () => {});
});

// 修改全选学生功能，只针对当前过滤后显示的学生
const toggleSelectAllStudents = () => {
  if (selectAllStudents.value) {
    selectedStudents.value = [];
  } else {
    // 只选择当前过滤后显示的学生
    selectedStudents.value = filteredByClassStudents.value.map(student => student.studentId);
  }
  selectAllStudents.value = !selectAllStudents.value;
};
//
// // 添加按班级分组的计算属性
// const groupedStudents = computed(() => {
//   if (!filteredStudents.value.length) return {};
//
//   const groups = {};
//
//   filteredStudents.value.forEach(student => {
//     const className = student.className || '未分配班级';
//     if (!groups[className]) {
//       groups[className] = [];
//
//       // 初始化折叠状态 - 默认展开第一个班级，其他折叠
//       if (Object.keys(expandedClasses.value).length === 0) {
//         expandedClasses.value[className] = true;
//       } else if (expandedClasses.value[className] === undefined) {
//         expandedClasses.value[className] = false;
//       }
//     }
//     groups[className].push(student);
//   });
//
//   return groups;
// });
//
// // 切换班级折叠状态
// function toggleClassGroup(className) {
//   expandedClasses.value[className] = !expandedClasses.value[className];
// }

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

// 学院、专业、班级相关状态
const collegeList = ref([])
const majorList = ref([])
const classList = ref([])
const selectedCollegeId = ref('')
const selectedMajorId = ref('')
const selectedClassId = ref('')
const isLoadingCollege = ref(false)
const isLoadingMajor = ref(false)
const isLoadingClas = ref(false)

// 获取学院列表
const getCollegeList = async () => {
  try {
    isLoadingCollege.value = true
    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/system/college/list?pageNum=1&pageSize=100', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('获取学院列表失败')
    }

    const data = await res.json()
    if (data.rows && Array.isArray(data.rows)) {
      collegeList.value = data.rows
    } else if (data.data && Array.isArray(data.data)) {
      collegeList.value = data.data
    } else {
      collegeList.value = []
    }
  } catch (error) {
    console.error('获取学院列表失败:', error)
    showNotification('获取学院列表失败', 'error')
  } finally {
    isLoadingCollege.value = false
  }
}

// 根据学院ID获取专业列表
const getMajorList = async (collegeId) => {
  if (!collegeId) return

  try {
    isLoadingMajor.value = true
    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/system/major/listByCollegeId?pageNum=1&pageSize=100', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ collegeId: collegeId })
    })

    if (!res.ok) {
      throw new Error('获取专业列表失败')
    }

    const data = await res.json()
    if (data.rows && Array.isArray(data.rows)) {
      majorList.value = data.rows
    } else if (data.data && Array.isArray(data.data)) {
      majorList.value = data.data
    } else {
      majorList.value = []
    }
  } catch (error) {
    console.error('获取专业列表失败:', error)
    showNotification('获取专业列表失败', 'error')
  } finally {
    isLoadingMajor.value = false
  }
}

// 根据专业ID获取班级列表
const getClassList = async (majorId) => {
  if (!majorId) return

  try {
    isLoadingClas.value = true
    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/system/clas/listByMajorId?pageNum=1&pageSize=100', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ majorId: majorId })
    })

    if (!res.ok) {
      throw new Error('获取班级列表失败')
    }

    const data = await res.json()
    if (data.rows && Array.isArray(data.rows)) {
      classList.value = data.rows
    } else if (data.data && Array.isArray(data.data)) {
      classList.value = data.data
    } else {
      classList.value = []
    }
  } catch (error) {
    console.error('获取班级列表失败:', error)
    showNotification('获取班级列表失败', 'error')
  } finally {
    isLoadingClas.value = false
  }
}

// 根据班级ID获取学生列表
const getStudentsByClassId = async (clasId) => {
  if (!clasId) return

  try {
    isLoadingPreviewStudents.value = true
    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/system/student/listByClasId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ clasId: clasId })
    })

    if (!res.ok) {
      throw new Error('获取班级学生列表失败')
    }

    const data = await res.json()
    if (data.rows && Array.isArray(data.rows)) {
      previewStudents.value = data.rows
    } else if (data.data && Array.isArray(data.data)) {
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

// 处理学院选择变化
const handleCollegeChange = () => {
  selectedMajorId.value = ''
  selectedClassId.value = ''
  majorList.value = []
  classList.value = []
  previewStudents.value = []

  if (selectedCollegeId.value) {
    getMajorList(selectedCollegeId.value)
  }
}

// 处理专业选择变化
const handleMajorChange = () => {
  selectedClassId.value = ''
  classList.value = []
  previewStudents.value = []

  if (selectedMajorId.value) {
    getClassList(selectedMajorId.value)
  }
}

// 处理班级选择变化
const handleClassChange = () => {
  previewStudents.value = []

  if (selectedClassId.value) {
    getStudentsByClassId(selectedClassId.value)
  }
}

// 修改显示添加学生弹窗方法
const showAddStudentsModal = () => {
  showAddStudentModal.value = true
  addStudentTab.value = 'class'

  // 重置所有选择状态
  selectedCollegeId.value = ''
  selectedMajorId.value = ''
  selectedClassId.value = ''
  selectedClassName.value = ''
  previewStudents.value = []
  manualStudentId.value = ''
  manualStudentInfo.value = null

  // 获取学院列表
  getCollegeList()
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
      if (!selectedClassId.value || previewStudents.value.length === 0) {
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
// const toggleSelectAllStudents = () => {
//   if (selectAllStudents.value) {
//     selectedStudents.value = []
//   } else {
//     selectedStudents.value = classStudents.value.map(student => student.studentId)
//   }
//   selectAllStudents.value = !selectAllStudents.value
// }

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

    // 获取当前教师ID
    let teacherId = null
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      teacherId = userInfo.userId || userInfo.teacherId || null
    }

    // 添加teacherId作为查询参数
    const url = '/dev-api/dataset/list?page=1&limit=100' + (teacherId ? `&teacherId=${teacherId}` : '');

    const res = await fetch(url, {
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

    // 获取当前教师ID
    let teacherId = null
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      teacherId = userInfo.userId || userInfo.teacherId || null
    }

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
        permission: 'all_team_members',
        teacherId: teacherId // 添加教师ID
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
// 显示添加文档弹窗
const showAddDocumentModal = (folder) => {  // 修改参数名
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error')
    return
  }
  currentFolder.value = folder  // 使用currentFolder而不是currentKnowledgeBase
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
// 提交添加文档
const submitAddDocument = async () => {
  if (!currentFolder.value || !currentFolder.value.zskId) {
    showNotification('请先选择一个文件夹', 'error')
    return
  }

  if (addDocTab.value === 'upload' && !selectedFile.value) return
  if (addDocTab.value === 'text' && (!newDocument.value.name || !newDocument.value.text)) return

  try {
    isAddingDoc.value = true
    const token = localStorage.getItem('token')

    if (addDocTab.value === 'upload') {
      // 创建FormData对象
      const formData = new FormData()
      formData.append('file', selectedFile.value)
      formData.append('folderId', currentFolder.value.zskId) // 添加文件夹ID

      // 添加处理规则数据
      const processRule = {
        indexing_technique: "high_quality",
        process_rule: {
          rules: {
            pre_processing_rules: [
              { id: "remove_extra_spaces", enabled: true },
              { id: "remove_urls_emails", enabled: true }
            ],
            segmentation: {
              separator: "###",
              max_tokens: 500
            }
          },
          mode: "custom"
        }
      }

      formData.append('data', JSON.stringify(processRule))

      // 发送请求到后端API
      const response = await fetch('/dev-api/document/uploadToFolder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `上传失败: ${response.status}`)
      }

      showNotification('文件上传成功', 'success')
      await getFilesByFolder(currentFolder.value.zskId)
      closeAddDocModal()
    } else {
      // 手动输入文本创建文档
      const res = await fetch('/dev-api/document/createToFolder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          folderId: currentFolder.value.id, // 这里也需要修改
          name: newDocument.value.name,
          text: newDocument.value.text
        })
      })

      if (res.ok) {
        showNotification('文档创建成功', 'success')
        await getDocuments(currentFolder.value.id) // 这里也需要修改
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
            text: data.data.text || '您暂无权限查看文档内容'
          }
        }
      } else {
        throw new Error('您暂无权限查看文档内容')
      }
    } catch (error) {
      console.error('您暂无权限查看文档内容:', error)
      showNotification('您暂无权限查看文档内容', 'error')
      currentDocument.value = {
        ...doc,
        text: '您暂无权限查看文档内容'
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
    } else if (deleteType.value === 'doc') {
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
    } else if (deleteType.value === 'folder') {
      // 删除文件夹
      const res = await fetch(`/dev-api/folder/delete/${itemToDelete.value.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        showNotification(`文件夹 "${itemToDelete.value.name}" 已删除`, 'success')
        await getFolders()
      } else {
        throw new Error('删除文件夹失败')
      }
    } else if (deleteType.value === 'file') {
      // 删除文件
      const res = await fetch(`/dev-api/folder/file/delete/${itemToDelete.value.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        showNotification(`文件 "${itemToDelete.value.name}" 已删除`, 'success')
        await getFilesByFolder(currentFolder.value.zskId)
      } else {
        throw new Error('删除文件失败')
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

// 创建文件夹
const createFolder = async () => {
  if (!newFolder.value.name) return

  try {
    isCreatingFolder.value = true
    const token = localStorage.getItem('token')

    // 获取用户ID
    let teacherId = null
    const userInfoStr = localStorage.getItem('userInfo')
    let userInfo = null
    if (userInfoStr) {
      userInfo = JSON.parse(userInfoStr)
      teacherId = userInfo.userId || userInfo.teacherId || null
    }

    const res = await fetch('/dev-api/folder/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        zskName: newFolder.value.name,
        classId: courseId,
        teacherId: teacherId
      })
    })

    if (res.ok) {
      showNotification('创建文件夹成功', 'success')
      await getFolders()
      closeCreateFolderModal()
    } else {
      throw new Error('创建文件夹失败')
    }
  } catch (error) {
    console.error('创建文件夹失败:', error)
    showNotification('创建文件夹失败', 'error')
  } finally {
    isCreatingFolder.value = false
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
