<template>
  <div class="chat-container" :class="{ 'dark': isDarkMode }">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'slide-in': true, 'collapsed': isSidebarCollapsed }">
      <!-- User profile -->
      <div class="user-profile">
        <div class="avatar">
          <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="User avatar" />
          <div v-else class="avatar-placeholder">
            {{ userInfo?.nickName?.charAt(0) || userInfo?.userName?.charAt(0) || 'U' }}
          </div>
        </div>
        <div class="user-info" >
          <div class="user-name-row">
            <div class="user-name">
              {{ userInfo ? userInfo.nickName || userInfo.userName : 'User' }}
            </div>
            <!-- Teacher badge -->
            <div v-if="isTeacher" class="teacher-badge">教师</div>
            <!-- 学生标识 -->
            <div v-if="isStudent" class="student-badge">学生</div>
          </div>
        </div>

        <!-- Management toggle button for teachers - moved outside user-info for better positioning -->
        <button v-if="isTeacher && !isSidebarCollapsed" class="management-toggle-btn" @click="toggleAdminMode">
      <span class="toggle-icon">
        <svg v-if="isAdminMode" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
      </span>
          <span class="toggle-text">{{ isAdminMode ? '返回聊天' : '工作台' }}</span>
        </button>

        <!-- Toggle sidebar button (visible when sidebar is collapsed) -->
<!--        <button v-if="isSidebarCollapsed" class="toggle-sidebar-btn" @click="toggleSidebar">-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>-->
<!--        </button>-->

        <!-- 学生切换班级按钮 -->
        <button v-if="isStudent && !isSidebarCollapsed" class="management-toggle-btn" @click="goToCourseSelection">
      <span class="toggle-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
      </span>
          <span class="toggle-text">切换班级</span>
        </button>
      </div>

      <!-- These sections should only show when sidebar is not collapsed -->
      <div v-if="!isSidebarCollapsed">
        <!-- Actions -->
        <div class="sidebar-actions">
          <button class="action-button primary" @click="createNewChat">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            <span>新对话</span>
          </button>
        </div>

        <!-- Chat history -->
        <div class="sidebar-section">
          <h3 class="section-title">对话历史</h3>
          <ChatHistory
              :current-conversation-id="currentConversation?.id"
              :user-info="userInfo"
              :conversations="conversations"
              @select-chat="handleSelectChat"
              @delete-conversation="deleteConversation"
              @rename-conversation="renameConversation"
          />
        </div>

        <!-- Logout button -->
        <div class="sidebar-footer">
          <button class="action-button danger logout-btn" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>退出登录</span>
          </button>
        </div>
      </div>
    </aside>


    <!-- Main chat area -->
    <main v-if="!isAdminMode" class="chat-main" :class="{ 'fade-in': true }">
      <!-- 聊天界面 - 消息内容 -->
      <div class="messages-container" ref="messagesContainer">
        <div v-if="messages.length === 0" class="welcome-container">
          <div class="welcome-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-bot"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
          </div>
          <h2 class="welcome-title">欢迎使用数院导师AI助手</h2>
          <p class="welcome-message">有什么我可以帮助您的？请输入您的问题，我会尽力为您解答。</p>
          <div class="welcome-suggestions">
            <p class="suggestions-title">您可以这样问我：</p>
            <div class="suggestions-list">
              <button class="suggestion-button" @click="handleSuggestedQuestion('请介绍一下你自己')">
                请介绍一下你自己
              </button>
              <button class="suggestion-button" @click="handleSuggestedQuestion('你能帮我做什么？')">
                你能帮我做什么？
              </button>
              <button class="suggestion-button" @click="handleSuggestedQuestion('如何使用数院导师AI助手？')">
                如何使用数院导师AI助手？
              </button>
              <button class="suggestion-button" @click="handleSuggestedQuestion('帮我写一段代码')">
                帮我写一段代码
              </button>
            </div>
          </div>
        </div>
        <transition-group name="message-fade">
          <div v-for="message in messages"
               :key="message.id"
               class="message"
               :class="message.role">

            <!-- User message -->
            <div v-if="message.role === 'user'" class="message-bubble user">
              <div class="message-content">{{ message.content }}</div>

              <!-- Files -->
              <div v-if="message.files?.length" class="message-files">
                <div v-for="file in message.files" :key="file.id" class="file-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <span>{{ file.name }}</span>
                </div>
              </div>
            </div>

            <!-- AI message -->
            <div v-else class="message-bubble assistant">
              <!-- Thinking process -->
              <div v-if="message.thinking" class="thinking-process">
                <details>
                  <summary>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-brain"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>
                    <span>AI 思考过程</span>
                    <svg class="arrow lucide lucide-chevron-down" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
                  </summary>
                  <div class="thinking-content" v-html="formatMarkdown(message.thinking)"></div>
                </details>
              </div>

              <!-- Message content -->
              <div class="message-content" v-html="formatMarkdown(message.content)"></div>

              <!-- Message actions -->
              <div class="message-actions">
                <button v-if="message.id === currentMessageId && isLoading"
                        class="action-button small danger"
                        @click="stopResponse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>
                  <span>停止</span>
                </button>
                <button class="action-button small" @click="copyMessageContent(message)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                  <span>复制</span>
                </button>
                <button class="action-button small" @click="playMessageAudio(message)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-headphones"><path d="M3 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2"></path></svg>
                  <span>播放</span>
                </button>
                <button v-if="isSpeaking" class="action-button small danger" @click="stopSpeaking">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>
                  <span>停止播放</span>
                </button>
              </div>
            </div>

            <div class="message-time">{{ formatTime(message.created_at) }}</div>
          </div>
        </transition-group>

        <!-- Typing indicator -->
        <div v-if="isLoading && !currentMessageId" class="typing-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>

        <!-- Suggested questions -->
        <transition name="fade">
          <div v-if="suggestedQuestions.length" class="suggested-questions">
            <p class="suggestions-title">您可能想问：</p>
            <div class="suggestions-list">
              <button v-for="question in suggestedQuestions"
                      :key="question"
                      class="suggestion-button"
                      @click="handleSuggestedQuestion(question)">
                {{ question }}
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Input area -->
      <div class="input-container">
        <div class="input-wrapper">
          <textarea
              v-model="inputMessage"
              class="message-input"
              placeholder="输入您的问题..."
              @keydown.enter.prevent="sendMessage"
              rows="1"
              ref="inputField"
              @input="autoResize"
          ></textarea>

          <div class="input-actions">
            <!-- File upload -->
            <label class="action-button icon-only tooltip-wrapper">
              <span class="tooltip">上传文件</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-paperclip"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              <input type="file" class="hidden-input" @change="handleFileUpload" />
            </label>

            <!-- Send button -->
            <button class="action-button icon-only primary tooltip-wrapper"
                    @click="sendMessage"
                    :disabled="isLoading || !inputMessage.trim()">
              <span class="tooltip">发送消息</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
            </button>
          </div>
        </div>

        <!-- Uploaded files -->
        <transition name="slide-up">
          <div v-if="uploadedFiles.length > 0" class="uploaded-files">
            <div v-for="file in uploadedFiles" :key="file.id" class="uploaded-file">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <span>{{ file.name }}</span>
              <button class="remove-file" @click="removeFile(file.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>
            <button class="action-button small danger" @click="uploadedFiles = []">
              清除全部
            </button>
          </div>
        </transition>
      </div>
    </main>

    <main v-else class="admin-main">
      <!-- <div class="admin-header">
        <h2>工作台</h2>
      </div> -->

      <!-- 管理页面导航 -->
      <div class="admin-nav">
        <!-- <button
            class="admin-nav-item"
            :class="{ active: adminActiveTab === 'knowledge' }"
            @click="adminActiveTab = 'knowledge'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
          知识库管理
        </button> -->
<!--        <button-->
<!--            class="admin-nav-item"-->
<!--            :class="{ active: adminActiveTab === 'course' }"-->
<!--            @click="adminActiveTab = 'course'"-->
<!--        >-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>-->
<!--          课程管理-->
<!--        </button>-->
      </div>

      <!-- 管理页面内容 -->
      <div class="admin-content">
        <!-- 知识库管理内容 -->
<!--        <div v-if="adminActiveTab === 'knowledge'" class="admin-panel">-->
<!--          <div class="admin-panel-header">-->
<!--            <h3>知识库列表</h3>-->
<!--            <button class="action-button primary" @click="showCreateKnowledgeBaseModal">-->
<!--              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>-->
<!--              创建知识库-->
<!--            </button>-->
<!--          </div>-->

<!--          <div v-if="isLoadingKnowledgeBases" class="loading-container">-->
<!--            <div class="loading-spinner"></div>-->
<!--            <p>加载中...</p>-->
<!--          </div>-->

<!--          <div v-else-if="knowledgeBases.length === 0" class="empty-state">-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-folder"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>-->
<!--            <p>暂无知识库，请点击上方按钮创建</p>-->
<!--          </div>-->

<!--          <div v-else class="knowledge-list">-->
<!--            <div v-for="kb in knowledgeBases"-->
<!--                 :key="kb.id"-->
<!--                 class="knowledge-item">-->
<!--              <div class="knowledge-info">-->
<!--                <div class="knowledge-name">{{ kb.name }}</div>-->
<!--                <div class="knowledge-details" v-if="kb.description || kb.document_count !== undefined">-->
<!--                  <span v-if="kb.description" class="description">{{ kb.description }}</span>-->
<!--                  <div class="stats">-->
<!--                    <span v-if="kb.document_count !== undefined" class="document-count">-->
<!--                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>-->
<!--                      文档数: {{ kb.document_count }}-->
<!--                    </span>-->
<!--                    <span v-if="kb.word_count !== undefined" class="word-count">-->
<!--                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-text"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>-->
<!--                      词数: {{ kb.word_count }}-->
<!--                    </span>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="knowledge-actions">-->
<!--                <button class="action-button small" @click="showDocumentsModal(kb)">-->
<!--                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>-->
<!--                  查看文档-->
<!--                </button>-->
<!--                <button v-if="isTeacher" class="action-button small primary" @click="showAddDocumentModal(kb)">-->
<!--                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-plus"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" x2="12" y1="18" y2="12"></line><line x1="9" x2="15" y1="15" y2="15"></line></svg>-->
<!--                  添加文档-->
<!--                </button>-->
<!--                <button v-if="isTeacher" class="delete-btn" @click="confirmDeleteKnowledgeBase(kb.id, kb.name)">-->
<!--                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>-->
<!--                </button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

        <!-- 课程管理内容 -->
        <div v-if="adminActiveTab === 'course'" class="admin-panel">
          <div class="admin-panel-header">
            <!-- <h3>课程列表</h3> -->
            <button v-if="isSidebarCollapsed" class="toggle-sidebar-btn" @click="toggleSidebar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <span class="class-count">{{ classList.length }}个课程</span>
            <button class="action-button primary" @click="showCreateClassForm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
              创建新课程
            </button>
          </div>

          <div v-if="isLoadingClassList" class="loading-container">
            <div class="loading-spinner"></div>
            <p>加载课程列表中...</p>
          </div>

          <div v-else-if="classList.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <p>暂无课程，请点击上方按钮创建新课程</p>
          </div>

          <div class="course-grid-container">
            <div class="course-grid-header">
              <!-- <h4>课程列表</h4> -->
            </div>

            <div v-if="isLoadingClassList" class="loading-container">
              <div class="loading-spinner"></div>
              <p>加载课程列表中...</p>
            </div>

            <div v-else-if="classList.length === 0" class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              <p>暂无课程，请点击上方按钮创建新课程</p>
            </div>

            <div v-else class="course-grid">
              <div v-for="classItem in classList"
                   :key="classItem.classId"
                   class="course-card"
                   @click="openCourseInNewPage(classItem)">
                <div class="course-card-header">
                  <h3 class="course-name">{{ classItem.className }}</h3>
                </div>
                <div class="course-card-body">
                  <div class="course-stats">
                    <div class="course-stat">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      <span>{{ classItem.studentCount || 0 }}名学生</span>
                    </div>
                    <div class="course-stat">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                      <span>{{ classItem.createTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 知识库管理弹窗 -->
    <div v-if="showKnowledgeModal" class="modal-backdrop" @click="closeKnowledgeModal"></div>
    <div v-if="showKnowledgeModal" class="modal-container knowledge-modal">
      <div class="modal-header">
        <h3>知识库管理</h3>
        <button class="close-button" @click="closeKnowledgeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isLoadingKnowledgeBases" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="knowledgeBases.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-folder"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
          <p>暂无知识库，请点击下方按钮创建</p>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                    文档数: {{ kb.document_count }}
                  </span>
                  <span v-if="kb.word_count !== undefined" class="word-count">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-text"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
                    词数: {{ kb.word_count }}
                  </span>
                </div>
              </div>
            </div>
            <div class="knowledge-actions">
              <button class="action-button small" @click="showDocumentsModal(kb)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                查看文档
              </button>
              <button v-if="isTeacher" class="action-button small primary" @click="showAddDocumentModal(kb)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-plus"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" x2="12" y1="18" y2="12"></line><line x1="9" x2="15" y1="15" y2="15"></line></svg>
                添加文档
              </button>
              <button v-if="isTeacher" class="delete-btn" @click="confirmDeleteKnowledgeBase(kb.id, kb.name)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button primary" @click="showCreateKnowledgeBaseModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          创建知识库
        </button>
      </div>
    </div>

    <!-- 创建知识库弹窗 -->
    <div v-if="showCreateKBModal" class="modal-backdrop" @click="closeCreateKBModal"></div>
    <div v-if="showCreateKBModal" class="modal-container create-modal">
      <div class="modal-footer">
        <button v-if="isTeacher" class="action-button primary" @click="showCreateKnowledgeBaseModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          创建知识库
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

    <!-- 添加文档弹窗 -->
    <div v-if="showAddDocModal" class="modal-backdrop" @click="closeAddDocModal"></div>
    <div v-if="showAddDocModal" class="modal-container add-doc-modal">
      <div class="modal-header">
        <h3>添加文档到 {{ currentKnowledgeBase?.name }}</h3>
        <button class="close-button" @click="closeAddDocModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="add-doc-tabs">
          <button
              class="tab-button"
              :class="{ 'active': addDocTab === 'upload' }"
              @click="addDocTab = 'upload'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
            上传文件
          </button>
          <button
              class="tab-button"
              :class="{ 'active': addDocTab === 'text' }"
              @click="addDocTab = 'text'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-text"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-upload-cloud"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>
            <p>点击或拖拽文件到此处上传</p>
            <p class="upload-hint">支持 TXT、MARKDOWN、MDX、PDF、HTML、XLSX、XLS、DOCX、CSV、MD、HTM 格式，每个文件不超过 15MB</p>
          </div>

          <div v-if="selectedFile" class="selected-file">
            <div class="file-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <div>
                <div class="file-name">{{ selectedFile.name }}</div>
                <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
              </div>
            </div>
            <button class="remove-file" @click="selectedFile = null">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
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

    <!-- 查看文档弹窗 -->
    <div v-if="showDocsModal" class="modal-backdrop" @click="closeDocsModal"></div>
    <div v-if="showDocsModal" class="modal-container docs-modal">
      <div class="modal-header">
        <h3>{{ currentKnowledgeBase?.name }} 的文档</h3>
        <button class="close-button" @click="closeDocsModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isLoadingDocs" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="documents.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-text"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
                    {{ doc.word_count }} 词
                  </span>
                </div>
              </div>
              <div class="document-actions">
                <button class="action-button small" @click="viewDocument(doc)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  查看
                </button>
                <button v-if="isTeacher" class="delete-btn" @click="confirmDeleteDocument(doc.id, doc.name)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 分页控件 -->
<!--          <div class="pagination">-->
<!--            <button-->
<!--                class="pagination-button"-->
<!--                :disabled="currentPage === 1"-->
<!--                @click="changePage(currentPage - 1)"-->
<!--            >-->
<!--              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>-->
<!--              上一页-->
<!--            </button>-->

<!--            <div class="pagination-info">-->
<!--              第 {{ currentPage }} 页 / 共 {{ totalPages }} 页-->
<!--            </div>-->

<!--            <button-->
<!--                class="pagination-button"-->
<!--                :disabled="currentPage === totalPages || totalPages === 0"-->
<!--                @click="changePage(currentPage + 1)"-->
<!--            >-->
<!--              下一页-->
<!--              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>-->
<!--            </button>-->
<!--          </div>-->
        </div>
      </div>

      <div class="modal-footer">
        <button v-if="isTeacher" class="action-button primary" @click="showAddDocumentModal(currentKnowledgeBase)">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-file-plus"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" x2="12" y1="18" y2="12"></line><line x1="9" x2="15" y1="15" y2="15"></line></svg>
          添加文档
        </button>
      </div>
    </div>

    <!-- 查看文档内容弹窗 -->
    <div v-if="showDocContentModal" class="modal-backdrop" @click="closeDocContentModal"></div>
    <div v-if="showDocContentModal" class="modal-container doc-content-modal">
      <div class="modal-header">
        <h3>{{ currentDocument?.name }}</h3>
        <button class="close-button" @click="closeDocContentModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
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

    <!-- 确认删除弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-backdrop" @click="cancelDelete"></div>
    <div v-if="showDeleteConfirm" class="modal-container delete-modal">
      <div class="modal-header">
        <h3>确认删除</h3>
        <button class="close-button" @click="cancelDelete">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="delete-warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
          <p>确定要删除{{ deleteType === 'kb' ? '知识库' : '文档' }} <strong>"{{ itemToDelete.name }}"</strong> 吗？</p>
          <p class="warning-text">此操作不可逆，{{ deleteType === 'kb' ? '知识库中的所有文档和分段将被永久删除' : '文档将被永久删除' }}。</p>
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

    <!-- 创建课程弹窗 -->
    <div v-if="showClassModal" class="modal-backdrop" @click="closeClassModal"></div>
    <div v-if="showClassModal" class="modal-container class-modal">
      <div class="modal-header">
        <h3>课程管理</h3>
        <button class="close-button" @click="closeClassModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isLoadingClassList" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载课程列表中...</p>
        </div>

        <div v-else-if="classList.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          <p>暂无课程，请点击下方按钮创建新课程</p>
        </div>

        <div v-else class="class-list">
          <div v-for="classItem in classList"
               :key="classItem.classId"
               class="class-item"
               :class="{ active: selectedClass?.classId === classItem.classId }"
               @click="selectClass(classItem)">
            <div class="class-info">
              <div class="class-name">{{ classItem.className }}</div>
              <div class="class-details">
            <span class="student-count" v-if="classItem.studentCount !== undefined">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              学生数: {{ classItem.studentCount || 0 }}
            </span>
                <span class="class-date">创建时间: {{ formatDate(classItem.createTime) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 学生管理面板 - 仅在选择了课程时显示 -->
        <div v-if="selectedClass" class="student-management-panel">
          <div class="panel-header">
            <h4>{{ selectedClass.className }} - 学生名单</h4>
            <div class="panel-actions">
              <button class="action-button small primary" @click="showAddStudentsModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="16" x2="22" y1="11" y2="11"></line></svg>
                添加学生
              </button>
            </div>
          </div>

          <div v-if="isLoadingStudents" class="loading-container small">
            <div class="loading-spinner"></div>
            <p>加载学生名单中...</p>
          </div>

          <div v-else-if="classStudents.length === 0" class="empty-state small">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-user-x"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="17" x2="22" y1="8" y2="13"></line><line x1="22" x2="17" y1="8" y2="13"></line></svg>
            <p>课程暂无学生，请点击"添加学生"按钮添加</p>
          </div>

          <div v-else class="student-list">
            <div v-for="student in classStudents" :key="student.studentId" class="student-item">
              <div class="student-info">
                <div class="student-name">{{ student.studentName }}</div>
                <div class="student-details">
                  <span class="student-id">学号: {{ student.studentId }}</span>
                  <span class="student-class">班级: {{ student.className }}</span>
                </div>
              </div>
              <button class="action-button small danger" @click="removeStudentFromClass(student)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-user-minus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="16" x2="22" y1="11" y2="11"></line></svg>
                移除
              </button>
            </div>
            <!-- 学生列表分页控件 -->
            <div class="pagination" v-if="studentTotalPages > 1">
              <button
                  class="pagination-button"
                  :disabled="studentCurrentPage === 1"
                  @click="changeStudentPage(studentCurrentPage - 1)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button primary" @click="showCreateClassForm">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          <span>创建新课程</span>
        </button>
        <button class="action-button" @click="closeClassModal">关闭</button>
      </div>
    </div>

    <!-- 添加学生弹窗 -->
    <div v-if="showAddStudentModal" class="modal-backdrop" @click="closeAddStudentModal"></div>
    <div v-if="showAddStudentModal" class="modal-container add-student-modal">
      <div class="modal-header">
        <h3>向 {{ selectedClass?.className }} 添加学生</h3>
        <button class="close-button" @click="closeAddStudentModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="add-student-tabs">
          <button
              class="tab-button"
              :class="{ 'active': addStudentTab === 'class' }"
              @click="addStudentTab = 'class'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            按班级添加
          </button>
          <button
              class="tab-button"
              :class="{ 'active': addStudentTab === 'manual' }"
              @click="addStudentTab = 'manual'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="16" x2="22" y1="11" y2="11"></line></svg>
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


    <!-- 创建新课程表单 -->
    <div v-if="showClassForm" class="modal-backdrop" @click="closeClassForm"></div>
    <div v-if="showClassForm" class="modal-container create-class-form">
      <div class="modal-header">
        <h3>创建新课程</h3>
        <button class="close-button" @click="closeClassForm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="new-class-name">课程名称</label>
          <input
              type="text"
              id="new-class-name"
              v-model="newClass.className"
              placeholder="请输入课程名称"
              class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="new-kz-select">所属课组</label>
          <select
              id="new-kz-select"
              v-model="newClass.kzId"
              class="form-input"
          >
            <option value="">请选择课组</option>
            <option v-for="kz in kzList" :key="kz.kzId" :value="kz.kzId">
              {{ kz.kzName }}
            </option>
          </select>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button" @click="closeClassForm">取消</button>
        <button
            class="action-button primary"
            @click="submitCreateClass"
            :disabled="!newClass.className || !newClass.kzId || isCreatingClass"
        >
          <span v-if="isCreatingClass">创建中...</span>
          <span v-else>确认创建</span>
        </button>
      </div>
    </div>

    <!-- 登出确认弹窗 -->
    <div v-if="showLogoutConfirm" class="modal-backdrop" @click="cancelLogout"></div>
    <div v-if="showLogoutConfirm" class="modal-container logout-modal">
      <div class="modal-header">
        <h3>确认退出</h3>
        <button class="close-button" @click="cancelLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="logout-warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <p>确定要退出登录吗？</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button" @click="cancelLogout">取消</button>
        <button
            class="action-button danger"
            @click="confirmLogout"
        >
          确认退出
        </button>
      </div>
    </div>

    <!-- 通知提示 -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      <div class="notification-icon">
        <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
      </div>
      <div class="notification-content">
        {{ notification.message }}
      </div>
    </div>

    <!-- 复制成功提示 -->
    <div v-if="copySuccess" class="copy-success-notification">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>复制成功</span>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick, inject, watch, computed} from 'vue'
import { useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' // 使用深色主题的代码高亮
import ChatHistory from './ChatHistory.vue'
import { chatAPI } from '@/api/index'
import { authAPI } from '@/api/auth'
import CourseManagement from './course-management.vue';
const router = useRouter()

// Initialize markdown-it with code highlighting and custom renderer for code blocks
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value;
        // Add copy button to code blocks
        return `<div class="code-block-wrapper">
                  <div class="code-header">
                    <span class="code-language">${lang}</span>
                    <button class="code-copy-btn" onclick="copyCodeToClipboard(this)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                      <span>复制</span>
                    </button>
                  </div>
                  <pre class="hljs"><code>${highlighted}</code></pre>
                </div>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
})

// 添加管理界面相关状态
const isAdminMode = ref(false)
const adminActiveTab = ref('course') // 'knowledge' 或 'course'

const isSidebarCollapsed = ref(false)

// 切换管理模式
const toggleAdminMode = () => {
  isAdminMode.value = !isAdminMode.value

  // When entering admin mode, collapse the sidebar
  if (isAdminMode.value) {
    isSidebarCollapsed.value = true
    getClassList()
  } else {
    // When exiting admin mode, expand the sidebar
    isSidebarCollapsed.value = false
  }
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value

  // If toggling back to expanded while in admin mode, exit admin mode
  if (!isSidebarCollapsed.value && isAdminMode.value) {
    isAdminMode.value = false
  }
}

// Add script to document for copying code
onMounted(() => {
  if (!window.copyCodeToClipboard) {
    window.copyCodeToClipboard = function(button) {
      const codeBlock = button.closest('.code-block-wrapper').querySelector('code');
      const code = codeBlock.textContent;

      navigator.clipboard.writeText(code).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>已复制</span>
        `;
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      });
    };
  }
});

// State
const conversations = ref([])
const currentConversation = ref(null)
const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const suggestedQuestions = ref([])
// const isRecording = ref(false)
const isDarkMode = inject('isDarkMode', ref(false))
const toggleDarkMode = inject('toggleDarkMode', () => {})
const currentMessageId = ref(null)
const uploadedFiles = ref([])
const userInfo = ref(null)
const inputField = ref(null)
const fileInput = ref(null)
const isSpeaking = ref(false)
const copySuccess = ref(false)
const showLogoutConfirm = ref(false)

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(1000)
const totalPages = ref(1)
const totalItems = ref(0)

// 知识库相关状态
const showKnowledgeModal = ref(false)
const showCreateKBModal = ref(false)
const showAddDocModal = ref(false)
const showDocsModal = ref(false)
const showDocContentModal = ref(false)
const showDeleteConfirm = ref(false)
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
const itemToDelete = ref({ id: '', name: '' })
const notification = ref({
  show: false,
  message: '',
  type: 'info' // 'success', 'error', 'info'
})

// 新知识库表单
const newKnowledgeBase = ref({
  name: '',
  description: ''
})

// 添加课程管理相关状态
const showClassModal = ref(false)
const showClassForm = ref(false)
const isLoadingKzList = ref(false)
const isCreatingClass = ref(false)
const kzList = ref([])
const classList = ref([])
const newClass = ref({
  className: '',
  kzId: '',
  teacherId: '',  // 将在提交时从用户信息获取
  status: '0'     // 默认状态：0-正常
})


// 新文档表单
const newDocument = ref({
  name: '',
  text: ''
})

// Methods
const formatMarkdown = (text) => {
  if (!text) return '';
  return md.render(text);
}

// 添加一个计算属性来判断用户是否为教师
const isTeacher = computed(() => {
  if (!userInfo.value || !userInfo.value.roles || !Array.isArray(userInfo.value.roles)) {
    return false;
  }

  // 检查roles数组中是否有对象的roleKey属性是'tea'
  return userInfo.value.roles.some(role => role.roleKey === 'tea');
});

// 添加一个计算属性来判断用户是否为学生
const isStudent = computed(() => {
  if (!userInfo.value || !userInfo.value.roles || !Array.isArray(userInfo.value.roles)) {
    return false;
  }

  // 检查roles数组中是否有对象的roleKey属性是'stu'
  return userInfo.value.roles.some(role => role.roleKey === 'stu');
});

// 添加切换班级方法
const goToCourseSelection = () => {
  router.push('/course-selection');
};

//新标签页中打开
const openCourseInNewPage = (classItem) => {
  window.open(`/course/${classItem.classId}`, '_blank')
}

// 创建知识库
const showCreateKnowledgeBaseModal = () => {
  // 只有教师可以创建知识库
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error');
    return;
  }
  showCreateKBModal.value = true;
}

// 添加课程管理相关状态
// 在现有代码基础上添加以下状态
const isLoadingClassList = ref(false)
const isLoadingStudents = ref(false)
const selectedClass = ref(null)
const classStudents = ref([])

// 添加学生相关状态
const showAddStudentModal = ref(false)
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


// 获取课程列表
const getClassList = async () => {
  try {
    const token = localStorage.getItem('token')

    const userId = userInfo.value?.userId || ''

    // Changed to POST method with userId in request body
    const res = await fetch('/dev-api/system/class/listByTeacherId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        teacherId: userId
      })
    })

    if (!res.ok) {
      throw new Error('获取课程列表失败')
    }

    const data = await res.json()
    if (data.rows && Array.isArray(data.rows)) {
      classList.value = data.rows
    } else {
      classList.value = []
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    showNotification('获取课程列表失败', 'error')
  }
}

// 学生列表分页相关状态
const studentCurrentPage = ref(1)
const studentPageSize = ref(10)
const studentTotalPages = ref(1)
const studentTotalItems = ref(0)

// 切换学生列表页码
const changeStudentPage = (page) => {
  if (page < 1 || page > studentTotalPages.value) return
  studentCurrentPage.value = page
  getClassStudents(selectedClass.value.classId)
}

// 选择课程时重置分页
const selectClass = async (classItem) => {
  selectedClass.value = classItem
  studentCurrentPage.value = 1 // 重置为第一页
  await getClassStudents(classItem.classId)
}

// Add these new state variables for student selection
const selectedStudents = ref([])
const selectAllStudents = ref(false)

// Update the getClassStudents function to properly handle pagination
const getClassStudents = async (classId) => {
  if (!classId) return

  try {
    isLoadingStudents.value = true
    const token = localStorage.getItem('token')

    // Add pagination parameters
    const res = await fetch(`/dev-api/system/class/students/${classId}?pageNum=${studentCurrentPage.value}&pageSize=${studentPageSize.value}`, {
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
      studentTotalItems.value = data.data.total || 0
      studentTotalPages.value = Math.ceil(studentTotalItems.value / studentPageSize.value) || 1
    } else if (data.data && Array.isArray(data.data)) {
      // 兼容不同的API返回格式
      classStudents.value = data.data
      studentTotalItems.value = data.data.length
      studentTotalPages.value = 1
    } else {
      classStudents.value = []
      studentTotalItems.value = 0
      studentTotalPages.value = 1
    }

    // Reset selection when loading new data
    selectedStudents.value = []
    selectAllStudents.value = false
  } catch (error) {
    console.error('获取课程学生名单失败:', error)
    showNotification('获取课程学生名单失败', 'error')
    classStudents.value = []
    studentTotalItems.value = 0
    studentTotalPages.value = 1
  } finally {
    isLoadingStudents.value = false
  }
}

// Add a function to toggle student selection
const toggleStudentSelection = (studentId) => {
  const index = selectedStudents.value.indexOf(studentId)
  if (index === -1) {
    selectedStudents.value.push(studentId)
  } else {
    selectedStudents.value.splice(index, 1)
  }
}

// Add a function to toggle select all students
const toggleSelectAllStudents = () => {
  if (selectAllStudents.value) {
    // Deselect all
    selectedStudents.value = []
  } else {
    // Select all
    selectedStudents.value = classStudents.value.map(student => student.studentId)
  }
  selectAllStudents.value = !selectAllStudents.value
}

// 批量移除学生
const batchRemoveStudents = async () => {
  if (selectedStudents.value.length === 0) {
    showNotification('请先选择要移除的学生', 'error');
    return;
  }

  const confirmMessage = `确定要将选中的 ${selectedStudents.value.length} 名学生从课程中移除吗？`;
  if (!confirm(confirmMessage)) {
    return;
  }

  try {
    // 添加这个状态变量的定义（如果尚未定义）
    const isRemovingStudents = ref(false);
    isRemovingStudents.value = true;

    const token = localStorage.getItem('token');

    const res = await fetch('/dev-api/system/class/students/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        classId: selectedClass.value.classId,
        studentIds: selectedStudents.value
      })
    });

    if (!res.ok) {
      throw new Error('批量移除学生失败');
    }

    const data = await res.json();
    if (data.code === 200) {
      showNotification('批量移除学生成功', 'success');
      // 重置选择
      selectedStudents.value = [];
      selectAllStudents.value = false;
      // 刷新学生列表
      await getClassStudents(selectedClass.value.classId);
    } else {
      throw new Error(data.msg || '批量移除学生失败');
    }
  } catch (error) {
    console.error('批量移除学生失败:', error);
    showNotification(`批量移除学生失败: ${error.message}`, 'error');
  } finally {
    isRemovingStudents.value = false;
  }
};

// Update the removeStudentFromClass function to handle multiple students
const removeStudentFromClass = async (student) => {
  // If a specific student is provided, just remove that one
  const studentIds = student ? [student.studentId] : selectedStudents.value

  if (studentIds.length === 0) {
    showNotification('请先选择要移除的学生', 'error')
    return
  }

  const confirmMessage = student
      ? `确定要将学生 ${student.studentName} 从课程中移除吗？`
      : `确定要将选中的 ${studentIds.length} 名学生从课程中移除吗？`

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
        classId: selectedClass.value.classId,
        studentIds: studentIds // Changed to send array of IDs
      })
    })

    if (!res.ok) {
      throw new Error('移除学生失败')
    }

    const data = await res.json()
    if (data.code === 200) {
      showNotification('移除学生成功', 'success')
      // Reset selection
      selectedStudents.value = []
      selectAllStudents.value = false
      // 刷新学生列表
      await getClassStudents(selectedClass.value.classId)
    } else {
      throw new Error(data.msg || '移除学生失败')
    }
  } catch (error) {
    console.error('移除学生失败:', error)
    showNotification(`移除学生失败: ${error.message}`, 'error')
  } finally {
    isRemovingStudents.value = false
  }
}

// Function to generate avatar color based on student name
const getAvatarColor = (name) => {
  if (!name) return '#3b82f6'

  // Generate a consistent color based on the name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert to hex color
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

// Function to get initials from name
const getInitials = (name) => {
  if (!name) return '?'
  return name.charAt(0)
}

// 显示添加学生弹窗
const showAddStudentsModal = async () => {
  if (!selectedClass.value) {
    showNotification('请先选择一个课程', 'error')
    return
  }

  addStudentTab.value = 'class'
  selectedClassName.value = ''
  previewStudents.value = []
  manualStudentId.value = ''
  manualStudentInfo.value = null
  showAddStudentModal.value = true

  // 获取可用班级列表
  await getClassNames()
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

// 关闭添加学生弹窗
const closeAddStudentModal = () => {
  showAddStudentModal.value = false
}

// 监听班级选择变化，加载预览学生列表
watch(selectedClassName, async (newVal) => {
  if (!newVal) {
    previewStudents.value = []
    return
  }

  await getPreviewStudents(newVal)
})

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
    // 修改这里：从data.rows改为data.data
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


// 监听手动输入学号变化，查询学生信息
watch(manualStudentId, async (newVal) => {
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

let studentSearchTimeout = null

// 根据学号查询学生
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

// 确认添加学生
const confirmAddStudents = async () => {
  if (!selectedClass.value) {
    showNotification('请先选择一个课程', 'error')
    return
  }

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
        classId: selectedClass.value.classId,
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
      await getClassStudents(selectedClass.value.classId)
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

// 添加文档
const showAddDocumentModal = (kb) => {
  // 只有教师可以添加文档
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error');
    return;
  }
  currentKnowledgeBase.value = kb;
  addDocTab.value = 'upload';
  selectedFile.value = null;
  newDocument.value = {
    name: '',
    text: ''
  };
  showAddDocModal.value = true;
}

// 确认删除知识库
const confirmDeleteKnowledgeBase = (id, name) => {
  // 只有教师可以删除知识库
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error');
    return;
  }
  deleteType.value = 'kb';
  itemToDelete.value = { id, name };
  showDeleteConfirm.value = true;
}

// 确认删除文档
const confirmDeleteDocument = (id, name) => {
  // 只有教师可以删除文档
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error');
    return;
  }
  deleteType.value = 'doc';
  itemToDelete.value = { id, name };
  showDeleteConfirm.value = true;
}


// 显示创建课程表单
const showCreateClassForm = () => {
  // 首先重置表单，确保teacherId被正确设置
  resetClassForm()
  // 获取课组列表
  getKzList()
  showClassForm.value = true
}

// 关闭创建课程表单
const closeClassForm = () => {
  showClassForm.value = false
}

// 重置课程表单
const resetClassForm = () => {
  newClass.value = {
    className: '',
    kzId: '',
    teacherId: userInfo.value?.userId || '',
    status: '0'
  }
}

// 关闭课程管理弹窗
const closeClassModal = () => {
  showClassModal.value = false
  closeClassForm()
}

// 获取课组列表
const getKzList = async () => {
  try {
    isLoadingKzList.value = true
    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/system/kz/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('获取课组列表失败')
    }

    const data = await res.json()
    if (data.rows && Array.isArray(data.rows)) {
      kzList.value = data.rows
    } else {
      kzList.value = []
    }
  } catch (error) {
    console.error('获取课组列表失败:', error)
    showNotification('获取课组列表失败', 'error')
  } finally {
    isLoadingKzList.value = false
  }
}


// 提交创建课程
const submitCreateClass = async () => {
  if (!newClass.value.className || !newClass.value.kzId) {
    showNotification('请填写完整的课程信息', 'error')
    return
  }

  try {
    isCreatingClass.value = true
    const token = localStorage.getItem('token')

    const res = await fetch('/dev-api/system/class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newClass.value)
    })

    if (!res.ok) {
      throw new Error('创建课程失败')
    }

    const result = await res.json()
    if (result.code === 200) {
      showNotification('课程创建成功', 'success')
      resetClassForm()
      closeClassForm()
      await getClassList() // 刷新课程列表
    } else {
      throw new Error(result.msg || '创建课程失败')
    }
  } catch (error) {
    console.error('创建课程失败:', error)
    showNotification(`创建课程失败: ${error.message}`, 'error')
  } finally {
    isCreatingClass.value = false
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    const container = messagesContainer.value;
    const scrollAnimation = container.animate(
        [
          { scrollTop: container.scrollTop },
          { scrollTop: container.scrollHeight }
        ],
        {
          duration: 300,
          easing: 'ease-out',
          fill: 'forwards'
        }
    );
    scrollAnimation.onfinish = () => {
      container.scrollTop = container.scrollHeight;
    };
  }
}

const createNewChat = () => {
  currentConversation.value = null
  messages.value = []
}

const handleSelectChat = async (chat) => {
  currentConversation.value = chat
  await getMessages(chat.id)
}

const getMessages = async (conversationId) => {
  if (!conversationId) return

  try {
    isLoading.value = true;
    const res = await chatAPI.getMessages({
      user: userInfo.value.userName,
      conversationId: conversationId
    })

    if (res.data) {
      // Process messages as in the original code
      messages.value = res.data.flatMap(msg => {
        const messageArray = []

        // Add user question
        if (msg.query) {
          messageArray.push({
            id: msg.id + '_user',
            content: msg.query,
            role: 'user',
            created_at: msg.created_at,
            files: msg.message_files || []
          })
        }

        // Process AI reply
        let thinking = ''
        let answer = ''

        if (msg.agent_thoughts && msg.agent_thoughts.length > 0) {
          thinking = msg.agent_thoughts[0].thought
          const lastThought = msg.agent_thoughts[msg.agent_thoughts.length - 1]

          if (lastThought.tool_input && lastThought.tool_input.includes('Final Answer')) {
            try {
              const toolInput = JSON.parse(lastThought.tool_input)
              answer = toolInput['Final Answer']
            } catch (e) {
              answer = lastThought.thought
            }
          } else {
            answer = lastThought.thought
          }
        }

        if (!answer && msg.answer) {
          answer = msg.answer
        }

        // Add AI reply
        if (thinking || answer) {
          messageArray.push({
            id: msg.id + '_assistant',
            content: answer,
            role: 'assistant',
            created_at: msg.created_at,
            thinking: thinking,
            files: msg.message_files || []
          })
        }

        return messageArray
      })

      scrollToBottom()
    }
  } catch (error) {
    console.error('Failed to get messages:', error)
  } finally {
    isLoading.value = false;
  }
}

const deleteConversation = async (conversationId) => {
  try {
    if (!confirm('确定要删除这个对话吗？')) {
      return
    }

    const res = await chatAPI.deleteConversation({
      conversationId:conversationId,
      user:userInfo.value.userName
    })

    if (res.code === 200) {
      // Show success animation
      const index = conversations.value.findIndex(c => c.id === conversationId);
      if (index !== -1) {
        const element = document.querySelectorAll('.chat-item')[index];
        if (element) {
          element.classList.add('deleting');
          setTimeout(() => {
            conversations.value = conversations.value.filter(c => c.id !== conversationId);
            if (currentConversation.value?.id === conversationId) {
              createNewChat();
            }
          }, 300);
        } else {
          conversations.value = conversations.value.filter(c => c.id !== conversationId);
          if (currentConversation.value?.id === conversationId) {
            createNewChat();
          }
        }
      }

      // 重新获取会话列表
      await getConversations();
    }
  } catch (error) {
    console.error('Failed to delete conversation:', error)
  }
}

// 重命名会话
const renameConversation = async (conversationId, newName) => {
  try {
    const res = await chatAPI.renameConversation( {
      user: userInfo.value.userName,
      conversationId: conversationId,
      newName: newName
    });

    if (res.code === 200) {
      // 更新本地会话列表
      const index = conversations.value.findIndex(c => c.id === conversationId);
      if (index !== -1) {
        conversations.value[index].name = newName;

        // 如果是当前会话，也更新当前会话
        if (currentConversation.value?.id === conversationId) {
          currentConversation.value.name = newName;
        }
      }
      showNotification('会话重命名成功', 'success');
      await getConversations();
    }
  } catch (error) {
    console.error('Failed to rename conversation:', error);
    showNotification('会话重命名失败', 'error');
  }
}

// 获取文档列表 - 添加分页支持
const getDocuments = async (datasetId) => {
  try {
    isLoadingDocs.value = true;
    const token = localStorage.getItem('token');
    // 使用URL查询参数而不是请求体
    const res = await fetch(`/dev-api/document/list?page=${currentPage.value}&limit=${pageSize.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ datasetId })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.data && Array.isArray(data.data.items)) {
        documents.value = data.data.items;
        totalItems.value = data.data.total || 0;
        totalPages.value = Math.ceil(totalItems.value / pageSize.value) || 1;
      } else if (data.data && Array.isArray(data.data)) {
        // 兼容旧接口格式
        documents.value = data.data;
        totalItems.value = data.data.length;
        totalPages.value = 1;
      } else {
        documents.value = [];
        totalItems.value = 0;
        totalPages.value = 1;
      }
    } else {
      throw new Error('获取文档列表失败');
    }
  } catch (error) {
    console.error('获取文档列表失败:', error);
    showNotification('获取文档列表失败', 'error');
    documents.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
  } finally {
    isLoadingDocs.value = false;
  }
}

// 显示文档列表弹窗 - 重置分页
const showDocumentsModal = async (kb) => {
  currentKnowledgeBase.value = kb;
  currentPage.value = 1; // 重置为第一页
  showDocsModal.value = true;
  await getDocuments(kb.id);
}

const getConversations = async () => {
  try {
    const res = await chatAPI.getConversations({
      user: userInfo.value.userName
    })

    if (res && Array.isArray(res.data)) {
      conversations.value = res.data.map(conv => ({
        id: conv.id,
        name: conv.name || '新对话',
        introduction: decodeUnicode(conv.introduction || ''),
        status: conv.status,
        created_at: conv.created_at,
        updated_at: conv.updated_at
      }))
    }
  } catch (error) {
    console.error('Failed to get conversations:', error)
  }
}

const decodeUnicode = (str) => {
  try {
    return decodeURIComponent(JSON.parse('"' + str.replace(/\"/g, '\\"') + '"'))
  } catch (e) {
    console.warn('Unicode decoding failed:', e)
    return str
  }
}

const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return;

  // Add user message
  const messageId = generateId();
  const userMessage = {
    id: messageId,
    content: inputMessage.value,
    role: 'user',
    created_at: new Date(),
    files: uploadedFiles.value.map(file => ({
      id: file.id,
      name: file.name
    }))
  };
  messages.value.push(userMessage);

  // Add AI reply placeholder
  const aiMessageId = generateId();
  currentMessageId.value = aiMessageId;

  const aiMessage = {
    id: aiMessageId,
    content: '',
    role: 'assistant',
    thinking: '',
    created_at: new Date()
  };
  messages.value.push(aiMessage);

  // Clear input and scroll
  const currentInput = inputMessage.value;
  inputMessage.value = '';
  uploadedFiles.value = [];
  scrollToBottom();
  isLoading.value = true;

  try {
    const token = localStorage.getItem('token');
    // 从 localStorage 获取选择的课程 ID
    const selectedCourseId = localStorage.getItem('selectedCourseId');

    // 如果没有选择课程 ID 且用户是学生，显示错误并重定向
    if (!selectedCourseId) {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        const isStudent = userInfo.roles?.some(role => role.roleKey === 'stu');

        if (isStudent) {
          throw new Error('请先选择一个课程');
        }
      }
    }

    // Create POST request - using original API path
    const response = await fetch('https://chat.imutoj.cn/deepSeek/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: currentInput,
        conversationId: currentConversation.value?.id || '',
        user: userInfo.value.userName,
        responseMode: "streaming",
        classId: selectedCourseId // 使用从 localStorage 获取的课程 ID
      })
    });

    // 其余代码保持不变...

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is empty');
    }

    // Process streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode received data chunk
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Process complete SSE events
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        // Parse event type and data
        const eventMatch = line.match(/event:\s*(\w+)/);
        const dataMatch = line.match(/data:\s*(.*)/);

        if (!dataMatch) continue;

        const eventType = eventMatch ? eventMatch[1] : 'message';
        let data = dataMatch[1].trim();

        try {
          // Parse JSON data
          const parsedData = JSON.parse(data);

          // Update UI based on event type
          if (eventType === 'agent_thought' && parsedData.thought) {
            // Update thinking process
            const index = messages.value.findIndex(msg => msg.id === aiMessageId);
            if (index !== -1) {
              messages.value[index].thinking = parsedData.thought;
              await scrollToBottom();
            }
          } else if (eventType === 'agent_message' && parsedData.answer) {
            // Update reply content
            const index = messages.value.findIndex(msg => msg.id === aiMessageId);
            if (index !== -1) {
              messages.value[index].content += parsedData.answer;
              await scrollToBottom();
            }
          } else if (eventType === 'message' && parsedData.answer) {
            // Handle regular message
            const index = messages.value.findIndex(msg => msg.id === aiMessageId);
            if (index !== -1) {
              messages.value[index].content += parsedData.answer;
              await scrollToBottom();
            }
          }
        } catch (e) {
          console.error('Failed to parse data:', e, data);
        }
      }
    }

    isLoading.value = false;
    currentMessageId.value = null;

    // If this is a new chat, get conversations
    if (!currentConversation.value) {
      getConversations();
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    isLoading.value = false;
    currentMessageId.value = null;

    // If request failed, remove AI message
    messages.value = messages.value.filter(msg => msg.id !== aiMessageId);

    // 如果错误是关于课程选择，重定向到课程选择页面
    if (error.message.includes('请先选择一个课程')) {
      alert('请先选择一个课程');
      router.push('/course-selection');
    }
  }
};

const stopResponse = () => {
  isLoading.value = false;
  currentMessageId.value = null;
  // Implement actual stop logic here
}

const handleSuggestedQuestion = (question) => {
  inputMessage.value = question;
  sendMessage();
}

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedFiles.value.push({
      id: Date.now().toString(),
      name: file.name,
      file: file
    });
    // Reset the input to allow selecting the same file again
    event.target.value = '';
  }
}

const removeFile = (fileId) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId);
}

// 复制消息内容
const copyMessageContent = (message) => {
  // 创建一个临时元素来提取纯文本内容
  const tempElement = document.createElement('div');
  tempElement.innerHTML = message.content;
  const textContent = tempElement.textContent || tempElement.innerText || '';

  navigator.clipboard.writeText(textContent).then(() => {
    // 显示复制成功提示
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  }).catch(err => {
    console.error('复制失败:', err);
    showNotification('复制失败，请重试', 'error');
  });
}

// 语音播放功能 - 使用Web Speech API
const playMessageAudio = async (message) => {
  try {
    // 停止当前正在播放的语音
    stopSpeaking();

    // 使用Web Speech API进行文本转语音
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'zh-CN';

    // 创建一个临时元素来提取纯文本内容
    const tempElement = document.createElement('div');
    tempElement.innerHTML = message.content;
    speech.text = tempElement.textContent || tempElement.innerText || '';

    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    // 设置语音结束事件
    speech.onend = () => {
      isSpeaking.value = false;
    };

    // 播放语音
    window.speechSynthesis.speak(speech);
    isSpeaking.value = true;

    showNotification('正在播放语音...', 'info');
  } catch (error) {
    console.error('语音播放错误:', error);
    showNotification('语音播放失败', 'error');
  }
};

// 停止语音播放
const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    isSpeaking.value = false;
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp instanceof Date ? timestamp : timestamp * 1000);
  return date.toLocaleTimeString();
}

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

// 知识库相关方法
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



// 关闭知识库弹窗
const closeKnowledgeModal = () => {
  showKnowledgeModal.value = false;
}

// 获取知识库列表
const getKnowledgeBases = async () => {
  try {
    isLoadingKnowledgeBases.value = true;
    const res = await chatAPI.dataset.list();

    if (res.data && Array.isArray(res.data)) {
      knowledgeBases.value = res.data.map(kb => ({
        id: kb.id,
        name: kb.name,
        description: kb.description || '',
        document_count: kb.document_count,
        word_count: kb.word_count
      }));
    }
  } catch (error) {
    console.error('获取知识库列表失败:', error);
    showNotification('获取知识库列表失败', 'error');
  } finally {
    isLoadingKnowledgeBases.value = false;
  }
}


// 关闭创建知识库弹窗
const closeCreateKBModal = () => {
  showCreateKBModal.value = false;
  newKnowledgeBase.value = {
    name: '',
    description: ''
  };
}

// 提交创建知识库
const submitCreateKnowledgeBase = async () => {
  if (!newKnowledgeBase.value.name) return;

  try {
    isCreatingKB.value = true;
    const res = await chatAPI.dataset.create({
      name: newKnowledgeBase.value.name,
      description: newKnowledgeBase.value.description,
      indexing_technique: 'economy',
      permission: 'all_team_members'
    });

    if (res) {
      showNotification('创建知识库成功', 'success');
      await getKnowledgeBases();
      closeCreateKBModal();
    }
  } catch (error) {
    console.error('创建知识库失败:', error);
    showNotification('创建知识库失败', 'error');
  } finally {
    isCreatingKB.value = false;
  }
}

// 关闭添加文档弹窗
const closeAddDocModal = () => {
  showAddDocModal.value = false;
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click();
}

// 文件拖放处理
// 修改文件拖放处理函数
const onFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) {
    // 检查文件大小
    if (file.size > 15 * 1024 * 1024) {
      showNotification('文件大小不能超过 15MB', 'error');
      return;
    }

    // 检查文件类型
    const allowedTypes = [
      'text/plain',
      'text/markdown',
      'application/pdf',
      'text/html',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'text/markdown',
      'text/html'
    ];

    const allowedExtensions = [
      '.txt', '.markdown', '.mdx', '.pdf', '.html',
      '.xlsx', '.xls', '.docx', '.csv', '.md', '.htm'
    ];

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      showNotification('不支持的文件类型', 'error');
      return;
    }

    selectedFile.value = file;
  }
}

// 文件选择处理
const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 检查文件大小
    if (file.size > 15 * 1024 * 1024) {
      showNotification('文件大小不能超过 15MB', 'error');
      return;
    }

    // 检查文件类型
    const allowedTypes = [
      'text/plain',
      'text/markdown',
      'application/pdf',
      'text/html',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'text/markdown',
      'text/html'
    ];

    const allowedExtensions = [
      '.txt', '.markdown', '.mdx', '.pdf', '.html',
      '.xlsx', '.xls', '.docx', '.csv', '.md', '.htm'
    ];

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      showNotification('不支持的文件类型', 'error');
      return;
    }

    selectedFile.value = file;
  }
}

// 提交添加文档
const submitAddDocument = async () => {
  if (addDocTab.value === 'upload' && !selectedFile.value) return;
  if (addDocTab.value === 'text' && (!newDocument.value.name || !newDocument.value.text)) return;

  try {
    isAddingDoc.value = true;

    if (addDocTab.value === 'upload') {
      try {
        // 获取token
        const token = localStorage.getItem('token');

        // 创建FormData对象
        const formData = new FormData();
        formData.append('file', selectedFile.value);
        formData.append('datasetId', currentKnowledgeBase.value.id);

        // 添加固定的JSON数据
        const processData = JSON.stringify({
          indexing_technique: "economy",
          process_rule: {
            mode: "automatic",
            rules: {}
          }
        });
        formData.append('data', processData);

        // 发送请求到后端API
        const response = await fetch('https://chat.imutoj.cn/dev-api/document/createByFile', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // 注意：使用FormData时不要手动设置Content-Type，浏览器会自动设置正确的Content-Type和boundary
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`上传失败: ${response.status}`);
        }

        const result = await response.text();
        console.log('上传结果:', result);

        showNotification('文件上传成功', 'success');
        await getKnowledgeBases();
        closeAddDocModal();
      } catch (error) {
        console.error('文件上传失败:', error);
        showNotification('文件上传失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error');
      } finally {
        isAddingDoc.value = false;
      }
    } else {
      // 手动输入文本创建文档
      const token = localStorage.getItem('token');
      const res = await fetch('https://chat.imutoj.cn/dev-api/document/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,
          'Authorization': `Bearer ${token}`},
        body: JSON.stringify({
          datasetId: currentKnowledgeBase.value.id,
          name: newDocument.value.name,
          text: newDocument.value.text,
          indexingTechnique: 'economy',
          processRule: { mode: 'automatic' }
        })
      });

      if (res.ok) {
        showNotification('文档创建成功', 'success');
        await getKnowledgeBases();
        closeAddDocModal();
      } else {
        throw new Error('文档创建失败');
      }
    }
  } catch (error) {
    console.error('添加文档失败:', error);
    showNotification('添加文档失败', 'error');
  } finally {
    isAddingDoc.value = false;
  }
}

// 关闭文档列表弹窗
const closeDocsModal = () => {
  showDocsModal.value = false;
}

// 查看文档内容
const viewDocument = async (doc) => {
  currentDocument.value = doc;
  showDocContentModal.value = true;

  // 如果文档没有text字段，需要获取文档内容
  if (!doc.text) {
    try {
      isLoadingDocContent.value = true;
      // 这里应该调用获取文档内容的API
      // 模拟获取文档内容
      setTimeout(() => {
        currentDocument.value = {
          ...doc,
          text: '您暂无权限查看知识库文档内容！'
        };
        isLoadingDocContent.value = false;
      }, 1000);
    } catch (error) {
      console.error('获取文档内容失败:', error);
      showNotification('获取文档内容失败', 'error');
      isLoadingDocContent.value = false;
    }
  }
}

// 关闭文档内容弹窗
const closeDocContentModal = () => {
  showDocContentModal.value = false;
}

// 取消删除
const cancelDelete = () => {
  showDeleteConfirm.value = false;
  itemToDelete.value = { id: '', name: '' };
}

// 确认删除
const confirmDelete = async () => {
  if (!itemToDelete.value.id) return;

  try {
    isDeleting.value = true;

    if (deleteType.value === 'kb') {
      const token = localStorage.getItem('token');
      // 删除知识库
      const res = await fetch(`https://chat.imutoj.cn/dev-api/dataset/delete/${itemToDelete.value.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`}
      });

      if (res.ok) {
        showNotification(`知识库 "${itemToDelete.value.name}" 已删除`, 'success');
        await getKnowledgeBases();
      } else {
        throw new Error('删除知识库失败');
      }
    } else {
      // 删除文档
      const token = localStorage.getItem('token');
      const res = await fetch('https://chat.imutoj.cn/dev-api/document/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`},
        body: JSON.stringify({
          datasetId: currentKnowledgeBase.value.id,
          documentId: itemToDelete.value.id
        })
      });

      if (res.ok) {
        showNotification(`文档 "${itemToDelete.value.name}" 已删除`, 'success');
        await getDocuments(currentKnowledgeBase.value.id);
      } else {
        throw new Error('删除文档失败');
      }
    }

    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('删除失败:', error);
    showNotification('删除失败', 'error');
  } finally {
    isDeleting.value = false;
  }
}

const getUserInfo = async () => {
  try {
    // Get user info from localStorage or API
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      userInfo.value = JSON.parse(userInfoStr);
    } else {
      // If localStorage doesn't have it, get from API
      const res = await authAPI.getInfo();
      if (res.code === 200 && res.user) {
        userInfo.value = res.user;
        localStorage.setItem('userInfo', JSON.stringify(res.user));
      }
    }
  } catch (error) {
    console.error('Failed to get user info:', error);
  }
}

// 处理登出
const handleLogout = () => {
  showLogoutConfirm.value = true;
}

// 取消登出
const cancelLogout = () => {
  showLogoutConfirm.value = false;
}

// 确认登出
const confirmLogout = async () => {
  try {
    await authAPI.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    showNotification('已成功退出登录', 'success');
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  } catch (error) {
    console.error('Failed to logout:', error);
    showNotification('退出登录失败', 'error');
  } finally {
    showLogoutConfirm.value = false;
  }
}

const autoResize = () => {
  if (!inputField.value) return;

  // Reset height to auto to get the correct scrollHeight
  inputField.value.style.height = 'auto';

  // Set new height based on scrollHeight (with max height limit)
  const newHeight = Math.min(inputField.value.scrollHeight, 150);
  inputField.value.style.height = `${newHeight}px`;
}

// Watch for changes to input to auto-resize
watch(inputMessage, () => {
  nextTick(() => {
    autoResize();
  });
});

// 组件生命周期
onMounted(async () => {
  // 获取用户信息
  await getUserInfo();

  // 检查学生是否已选择课程
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr);
    const isStudent = userInfo.roles?.some(role => role.roleKey === 'stu');

    if (isStudent) {
      const selectedCourseId = localStorage.getItem('selectedCourseId');
      if (!selectedCourseId) {
        // 如果学生未选择课程，重定向到课程选择页面
        router.push('/course-selection');
        return;
      }
    }
  }

  // 获取对话历史
  await getConversations();

  // 默认新对话
  currentConversation.value = null;
  messages.value = [];

  // 初始化自动调整文本框大小
  autoResize();

  // 添加挂载后动画
  nextTick(() => {
    document.querySelector('.sidebar').classList.add('slide-in');
    document.querySelector('.chat-main').classList.add('fade-in');
  });

  // 确保在组件卸载时停止语音播放
  window.addEventListener('beforeunload', stopSpeaking);
});
</script>

<style src="./Chat.css" scoped></style>
