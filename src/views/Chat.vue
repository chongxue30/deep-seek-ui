<template>
  <div class="chat-container" :class="{ 'dark': isDarkMode }">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'slide-in': true }">
      <!-- User profile -->
      <div class="user-profile">
        <div class="avatar">
          <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="User avatar" />
          <div v-else class="avatar-placeholder">
            {{ userInfo?.nickName?.charAt(0) || userInfo?.userName?.charAt(0) || 'U' }}
          </div>
        </div>
        <div class="user-name">
          {{ userInfo ? userInfo.nickName || userInfo.userName : 'User' }}
        </div>
      </div>

      <!-- Actions -->
      <div class="sidebar-actions">
        <button class="action-button primary" @click="createNewChat">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          <span>新对话</span>
        </button>
        <button class="action-button theme-toggle" @click="toggleDarkMode">
          <div class="toggle-track">
            <div class="toggle-thumb" :class="{ 'active': isDarkMode }">
              <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path></svg>
            </div>
          </div>
          <span>{{ isDarkMode ? '黑暗模式' : '明亮模式' }}</span>
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

      <!-- Knowledge base section - moved to bottom -->
      <div class="sidebar-footer">
        <KnowledgeBase
            :user-info="userInfo"
            :is-teacher="isTeacher"
            @create-knowledge-base="handleCreateKnowledgeBase"
            @file-change="handleFileChange"
            @show-knowledge-modal="openKnowledgeModal"
        />


        <!-- Logout -->
        <button class="action-button danger logout-btn" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>退出登录</span>
        </button>
      </div>
    </aside>

    <!-- Main chat area -->
    <main class="chat-main" :class="{ 'fade-in': true }">
      <!-- Messages -->
      <div class="messages-container" ref="messagesContainer">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>
                    <span>AI 思考过程</span>
                    <svg class="arrow lucide lucide-chevron-down" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>
                  <span>停止</span>
                </button>
                <button class="action-button small" @click="copyMessageContent(message)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                  <span>复制</span>
                </button>
                <button class="action-button small" @click="playMessageAudio(message)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headphones"><path d="M3 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2"></path></svg>
                  <span>播放</span>
                </button>
                <button v-if="isSpeaking" class="action-button small danger" @click="stopSpeaking">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paperclip"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              <input type="file" class="hidden-input" @change="handleFileUpload" />
            </label>

            <!-- Send button -->
            <button class="action-button icon-only primary tooltip-wrapper"
                    @click="sendMessage"
                    :disabled="isLoading || !inputMessage.trim()">
              <span class="tooltip">发送消息</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
            </button>
          </div>
        </div>

        <!-- Uploaded files -->
        <transition name="slide-up">
          <div v-if="uploadedFiles.length > 0" class="uploaded-files">
            <div v-for="file in uploadedFiles" :key="file.id" class="uploaded-file">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <span>{{ file.name }}</span>
              <button class="remove-file" @click="removeFile(file.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>
            <button class="action-button small danger" @click="uploadedFiles = []">
              清除全部
            </button>
          </div>
        </transition>
      </div>
    </main>

    <!-- 知识库管理弹窗 -->
    <div v-if="showKnowledgeModal" class="modal-backdrop" @click="closeKnowledgeModal"></div>
    <div v-if="showKnowledgeModal" class="modal-container knowledge-modal">
      <div class="modal-header">
        <h3>知识库管理</h3>
        <button class="close-button" @click="closeKnowledgeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isLoadingKnowledgeBases" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="knowledgeBases.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                    文档数: {{ kb.document_count }}
                  </span>
                  <span v-if="kb.word_count !== undefined" class="word-count">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
                    词数: {{ kb.word_count }}
                  </span>
                </div>
              </div>
            </div>
            <div class="knowledge-actions">
              <button class="action-button small" @click="showDocumentsModal(kb)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                查看文档
              </button>
              <button v-if="isTeacher" class="action-button small primary" @click="showAddDocumentModal(kb)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-plus"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" x2="12" y1="18" y2="12"></line><line x1="9" x2="15" y1="15" y2="15"></line></svg>
                添加文档
              </button>
              <button v-if="isTeacher" class="delete-btn" @click="confirmDeleteKnowledgeBase(kb.id, kb.name)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="action-button primary" @click="showCreateKnowledgeBaseModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          创建知识库
        </button>
      </div>
    </div>

    <!-- 创建知识库弹窗 -->
    <div v-if="showCreateKBModal" class="modal-backdrop" @click="closeCreateKBModal"></div>
    <div v-if="showCreateKBModal" class="modal-container create-modal">
      <div class="modal-footer">
        <button v-if="isTeacher" class="action-button primary" @click="showCreateKnowledgeBaseModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="add-doc-tabs">
          <button
              class="tab-button"
              :class="{ 'active': addDocTab === 'upload' }"
              @click="addDocTab = 'upload'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
            上传文件
          </button>
          <button
              class="tab-button"
              :class="{ 'active': addDocTab === 'text' }"
              @click="addDocTab = 'text'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload-cloud"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>
            <p>点击或拖拽文件到此处上传</p>
            <p class="upload-hint">支持 TXT、MARKDOWN、MDX、PDF、HTML、XLSX、XLS、DOCX、CSV、MD、HTM 格式，每个文件不超过 15MB</p>
          </div>

          <div v-if="selectedFile" class="selected-file">
            <div class="file-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <div>
                <div class="file-name">{{ selectedFile.name }}</div>
                <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
              </div>
            </div>
            <button class="remove-file" @click="selectedFile = null">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div v-if="isLoadingDocs" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="documents.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
                    {{ doc.word_count }} 词
                  </span>
                </div>
              </div>
              <div class="document-actions">
                <button class="action-button small" @click="viewDocument(doc)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  查看
                </button>
                <button v-if="isTeacher" class="delete-btn" @click="confirmDeleteDocument(doc.id, doc.name)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 分页控件 -->
          <div class="pagination">
            <button
                class="pagination-button"
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
              上一页
            </button>

            <div class="pagination-info">
              第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
            </div>

            <button
                class="pagination-button"
                :disabled="currentPage === totalPages || totalPages === 0"
                @click="changePage(currentPage + 1)"
            >
              下一页
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button v-if="isTeacher" class="action-button primary" @click="showAddDocumentModal(currentKnowledgeBase)">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-plus"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" x2="12" y1="18" y2="12"></line><line x1="9" x2="15" y1="15" y2="15"></line></svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="delete-warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
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

    <!-- 登出确认弹窗 -->
    <div v-if="showLogoutConfirm" class="modal-backdrop" @click="cancelLogout"></div>
    <div v-if="showLogoutConfirm" class="modal-container logout-modal">
      <div class="modal-header">
        <h3>确认退出</h3>
        <button class="close-button" @click="cancelLogout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="logout-warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
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
        <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
      </div>
      <div class="notification-content">
        {{ notification.message }}
      </div>
    </div>

    <!-- 复制成功提示 -->
    <div v-if="copySuccess" class="copy-success-notification">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
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
import KnowledgeBase from '@/components/KnowledgeBase.vue'
import { chatAPI } from '@/api/index'
import { authAPI } from '@/api/auth'

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
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
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

// Add script to document for copying code
onMounted(() => {
  if (!window.copyCodeToClipboard) {
    window.copyCodeToClipboard = function(button) {
      const codeBlock = button.closest('.code-block-wrapper').querySelector('code');
      const code = codeBlock.textContent;

      navigator.clipboard.writeText(code).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
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
const pageSize = ref(10)
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

// 创建知识库
const showCreateKnowledgeBaseModal = () => {
  // 只有教师可以创建知识库
  if (!isTeacher.value) {
    showNotification('您没有权限执行此操作', 'error');
    return;
  }
  showCreateKBModal.value = true;
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

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  getDocuments(currentKnowledgeBase.value.id);
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
    // Create POST request - using original API path
    const response = await fetch('http://10.131.149.41:8080/deepSeek/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
        'Authorization': `Bearer ${token}`},
      body: JSON.stringify({
        query: currentInput,
        conversationId: currentConversation.value?.id || '',
        user: userInfo.value.userName,
        responseMode: "streaming"
      })
    });
    // const response = await chatAPI.sendMessage({
    //   query: currentInput,
    //   conversationId: currentConversation.value?.id || '',
    //   user: userInfo.value.userName,
    //   responseMode: "streaming"
    // });
    console.log(response)
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

// 打开知识库弹窗
const openKnowledgeModal = async (kbs) => {
  if (kbs && Array.isArray(kbs)) {
    knowledgeBases.value = kbs;
  } else {
    await getKnowledgeBases();
  }
  showKnowledgeModal.value = true;
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

    if (res.code === 200) {
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
        const response = await fetch('http://10.131.149.41:8080/document/createByFile', {
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
      const res = await fetch('http://10.131.149.41:8080/document/create', {
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
      const res = await fetch(`http://10.131.149.41:8080/dataset/delete/${itemToDelete.value.id}`, {
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
      const res = await fetch('http://10.131.149.41:8080/document/delete', {
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

// Knowledge base methods
const handleCreateKnowledgeBase = async (name) => {
  try {
    const res = await chatAPI.dataset.create({
      name: name,
      description: '',
      indexing_technique: 'economy',
      permission: 'all_team_members'
    })

    if (res.code === 200) {
      showNotification('知识库创建成功', 'success');
      await getKnowledgeBases();
    }
  } catch (error) {
    console.error('Failed to create knowledge base:', error);
    showNotification('知识库创建失败', 'error');
  }
}

const handleFileChange = async (file, datasetId) => {
  try {
    const formData = new FormData();
    formData.append('file', file.raw);
    formData.append('datasetId', datasetId);

    // 实现文件上传逻辑
    showNotification('文件上传中...', 'info');

    // 模拟上传成功
    setTimeout(() => {
      showNotification('文件上传成功', 'success');
      getKnowledgeBases();
    }, 1500);
  } catch (error) {
    console.error('File upload failed:', error);
    showNotification('文件上传失败', 'error');
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

// Component lifecycle
onMounted(async () => {
  // Get user info
  await getUserInfo();

  // Get conversations
  await getConversations();

  // Default to new chat
  currentConversation.value = null;
  messages.value = [];

  // Initialize auto-resize for textarea
  autoResize();

  // Add animation class after mount
  nextTick(() => {
    document.querySelector('.sidebar').classList.add('slide-in');
    document.querySelector('.chat-main').classList.add('fade-in');
  });

  // 确保在组件卸载时停止语音播放
  window.addEventListener('beforeunload', stopSpeaking);
});
</script>

<style scoped>
/* Base styles */
.chat-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #f9fafb;
  color: #111827;
  overflow: hidden;
}

/* Dark mode styles */
.dark {
  background-color: #111827;
  color: #f9fafb;
}

/* Sidebar */
.sidebar {
  width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateX(-100%);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
  z-index: 10;
}

.dark .sidebar {
  background-color: #1f2937;
  border-right-color: #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.sidebar.slide-in {
  transform: translateX(0);
  opacity: 1;
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
}

.dark .user-profile {
  border-bottom-color: #374151;
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  overflow: hidden;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.user-name {
  font-weight: 600;
  font-size: 0.9375rem;
}

.dark .user-name {
  color: #f3f4f6;
}

.sidebar-actions {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-section {
  padding: 0 1rem;
  margin-bottom: 1rem;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .section-title {
  color: #9ca3af;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dark .sidebar-footer {
  border-top-color: #374151;
}

.logout-btn {
  margin-top: 0.5rem;
}

/* Main chat area */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.dark .chat-main {
  background: linear-gradient(135deg, #111827 0%, #1e293b 100%);
}

.chat-main.fade-in {
  opacity: 1;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  scroll-behavior: smooth;
}

.message {
  margin-bottom: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.message-bubble {
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  max-width: 80%;
  word-break: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.message-bubble:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.message.user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-bubble.user {
  background: linear-gradient(135deg, #79a2ea 0%, #175bef 100%);
  color: white;
  border-radius: 0.75rem 0.75rem 0 0.75rem;
}

.message-bubble.assistant {
  background: linear-gradient(135deg, #eeeef3 0%, #ffffff 100%);
  border-radius: 0.75rem 0.75rem 0.75rem 0;
  border: 1px solid #e5e7eb;
}

.dark .message-bubble.assistant {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-color: #374151;
  color: #f3f4f6;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.message-files {
  margin-top: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  margin-top: 0.25rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  backdrop-filter: blur(4px);
}

.thinking-process {
  margin-bottom: 0.75rem;
}

.thinking-process details {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.dark .thinking-process details {
  background-color: #1f2937;
}

.thinking-process details:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.thinking-process summary {
  padding: 0.625rem 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #4b5563;
  user-select: none;
}

.dark .thinking-process summary {
  color: #d1d5db;
}

.thinking-process summary .arrow {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.thinking-process details[open] summary .arrow {
  transform: rotate(180deg);
}

.thinking-content {
  padding: 0.875rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4b5563;
  background-color: #f3f4f6;
  border-top: 1px solid #e5e7eb;
  animation: slideDown 0.3s ease;
}

.dark .thinking-content {
  color: #d1d5db;
  background-color: #111827;
  border-top-color: #374151;
}

.message-content {
  line-height: 1.5;
}

/* 代码块样式 */
:deep(.code-block-wrapper) {
  margin: 0rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: rgb(9, 28, 35);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgb(9, 28, 35);
  border-bottom: 1px solid #fffdfd;
}

:deep(.code-language) {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
}

:deep(.code-copy-btn) {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: #3b3b3b;
  color: #e5e7eb;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.code-copy-btn:hover) {
  background-color: #4b4b4b;
}

:deep(.hljs) {
  padding: 1rem;
  border-radius: 0;
  background-color: rgba(12, 50, 64, 0);
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.75rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.message-bubble:hover .message-actions {
  opacity: 1;
  transform: translateY(0);
}

.suggested-questions {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.suggestions-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-button {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

.suggestion-button:nth-child(1) { animation-delay: 0.1s; }
.suggestion-button:nth-child(2) { animation-delay: 0.2s; }
.suggestion-button:nth-child(3) { animation-delay: 0.3s; }
.suggestion-button:nth-child(4) { animation-delay: 0.4s; }

.suggestion-button:hover {
  background-color: #e5e7eb;
  transform: translateY(-2px);
}

/* Input area */
.input-container {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.625rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.message-input {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  padding: 0.5rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  max-height: 150px;
  background-color: transparent;
  transition: all 0.3s ease;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.uploaded-files {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background-color: #f3f4f6;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  animation: fadeIn 0.3s ease;
  transition: all 0.3s ease;
}

.uploaded-file:hover {
  background-color: #e5e7eb;
}

.remove-file {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.125rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.remove-file:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.hidden-input {
  display: none;
}

/* Buttons */
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
  position: relative;
  overflow: hidden;
}

.action-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

.action-button:active::after {
  animation: ripple 0.6s ease-out;
}

.action-button:hover {
  background-color: #f3f4f6;
  transform: translateY(-2px);
}

.action-button.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-color: transparent;
}

.action-button.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
}

.action-button.danger {
  color: #ef4444;
  border-color: #fecaca;
}

.action-button.danger:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.action-button.small {
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
}

.action-button.icon-only {
  padding: 0.5rem;
  border-radius: 0.5rem;
}

/* Theme toggle */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}

.toggle-track {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: #e5e7eb;
  border-radius: 10px;
  margin-right: 0.5rem;
  transition: background-color 0.3s ease;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease, background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-thumb.active {
  transform: translateX(20px);
  background-color: #3b82f6;
}

/* Typing indicator */
.typing-indicator {
  display: inline-flex;
  align-items: center;
  background-color: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  animation: fadeIn 0.5s ease;
}

.dot {
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background-color: #9ca3af;
  border-radius: 50%;
  animation: bounce 1.5s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* Tooltip */
.tooltip-wrapper {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background-color: #1f2937;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  margin-bottom: 5px;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #1f2937 transparent transparent transparent;
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* 知识库弹窗样式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 100;
}

.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 101;
  display: flex;
  flex-direction: column;
  animation: modalFadeIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* 知识库列表样式 */
.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.knowledge-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.knowledge-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.knowledge-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.knowledge-name {
  font-weight: 600;
  font-size: 1rem;
  color: #111827;
}

.knowledge-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.description {
  font-size: 0.875rem;
  color: #6b7280;
}

.stats {
  display: flex;
  gap: 0.75rem;
}

.document-count, .word-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.knowledge-actions {
  display: flex;
  gap: 0.5rem;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: #fee2e2;
  color: #ef4444;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: #fecaca;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

/* 添加文档样式 */
.add-doc-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.tab-button {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-button:hover {
  color: #4b5563;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload-area:hover {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

.upload-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.selected-file {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.file-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.file-size {
  font-size: 0.75rem;
  color: #6b7280;
}

/* 文档列表样式 */
.documents-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.document-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.document-item:hover {
  background-color: #f3f4f6;
}

.document-info {
  flex: 1;
}

.document-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.document-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.document-date, .document-word-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.document-actions {
  display: flex;
  gap: 0.5rem;
}

/* 文档内容样式 */
.document-content {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  max-height: 50vh;
  overflow-y: auto;
}

.document-content pre {
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* 删除确认样式 */
.delete-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 1rem;
}

.delete-warning svg {
  color: #ef4444;
}

.warning-text {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #6b7280;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #9ca3af;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
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

/* 通知样式 */
.notification {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease;
  max-width: 24rem;
}

.notification.success {
  border-left: 4px solid #10b981;
}

.notification.error {
  border-left: 4px solid #ef4444;
}

.notification.info {
  border-left: 4px solid #3b82f6;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification.success .notification-icon {
  color: #10b981;
}

.notification.error .notification-icon {
  color: #ef4444;
}

.notification.info .notification-icon {
  color: #3b82f6;
}

.notification-content {
  flex: 1;
  font-size: 0.875rem;
}

/* 复制成功提示 */
.copy-success-notification {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background-color: #10b981;
  color: white;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  z-index: 1000;
  animation: fadeInDown 0.3s ease;
}

/* 分页样式 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 1rem;
}

.pagination-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

/* 深色模式分页样式 */
.dark .pagination-button {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}

.dark .pagination-button:hover:not(:disabled) {
  background-color: #4b5563;
}

.dark .pagination-info {
  color: #9ca3af;
}

/* 动画 */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

/* Transition groups */
.message-fade-enter-active, .message-fade-leave-active {
  transition: all 0.5s ease;
}

.message-fade-enter-from, .message-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 深色模式 */
.dark .modal-container {
  background-color: #1f2937;
  color: #f9fafb;
}

.dark .modal-header,
.dark .modal-footer {
  border-color: #374151;
}

.dark .close-button {
  color: #9ca3af;
}

.dark .close-button:hover {
  background-color: #374151;
  color: #f9fafb;
}

.dark .knowledge-item {
  background-color: #111827;
  border-color: #374151;
}

.dark .knowledge-name {
  color: #f9fafb;
}

.dark .description {
  color: #9ca3af;
}

.dark .document-count,
.dark .word-count {
  background-color: #374151;
  color: #d1d5db;
}

.dark .form-input,
.dark .form-textarea {
  background-color: #1f2937;
  border-color: #4b5563;
  color: #f9fafb;
}

.dark .form-input:focus,
.dark .form-textarea:focus {
  border-color: #eceef3;
}

.dark .form-group label {
  color: #d1d5db;
}

.dark .file-upload-area {
  border-color: #4b5563;
}

.dark .file-upload-area:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.dark .selected-file,
.dark .document-item,
.dark .document-content {
  background-color: #111827;
  border-color: #374151;
}

.dark .notification {
  background-color: #1f2937;
  color: #f9fafb;
}

.dark .tab-button {
  color: #9ca3af;
}

.dark .tab-button.active {
  color: #3b82f6;
}

.dark .tab-button:hover {
  color: #d1d5db;
}

.dark :deep(.code-block-wrapper) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark :deep(.code-header) {
  background-color: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
}

.dark :deep(.code-copy-btn) {
  background-color: #2a2a2a;
  color: #d1d5db;
}

.dark :deep(.code-copy-btn:hover) {
  background-color: #3a3a3a;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 85vh;
  }

  .knowledge-item,
  .document-item {
    flex-direction: column;
    gap: 1rem;
  }

  .knowledge-actions,
  .document-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
