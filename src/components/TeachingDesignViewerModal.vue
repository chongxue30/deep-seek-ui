<template>
  <div class="teaching-design-viewer-modal" v-if="visible">
    <!-- 背景遮罩 -->
    <div class="modal-backdrop" @click="handleClose"></div>

    <!-- 模态框内容容器 -->
    <div class="modal-container">
      <!-- 模态框头部 -->
      <div class="modal-header">
        <h3>{{ designData.title || '教学设计详情' }}</h3>
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
        <!-- 教学设计基本信息卡片 -->
        <div class="design-info-card">
          <div class="info-header">
            <div class="title-section">
              <h2>{{ designData.title }}</h2>
              <div class="design-status" :class="getStatusClass(designData.status)">
                {{ getStatusText(designData.status) }}
              </div>
            </div>
            <div class="action-buttons">
              <template v-if="!isEditing">
                <button class="action-btn edit-btn" @click="startEditing" v-if="isTeacher">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  编辑设计
                </button>
                <button class="action-btn print-btn" @click="printDesign">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  打印设计
                </button>
              </template>
              <!-- 编辑状态下的按钮 -->
              <template v-else>
                <button class="action-btn save-btn" @click="saveDesign" :disabled="saving">
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

          <!-- 版本和创建时间信息 -->
          <div class="info-grid" v-if="!isEditing">
            <div class="info-item">
              <div class="label">版本</div>
              <div class="value">V{{ designData.version || '1' }}</div>
            </div>
            <div class="info-item">
              <div class="label">创建时间</div>
              <div class="value">{{ formatDateTime(designData.createTime) }}</div>
            </div>
            <div class="info-item">
              <div class="label">更新时间</div>
              <div class="value">{{ formatDateTime(designData.updateTime) }}</div>
            </div>
            <div class="info-item">
              <div class="label">生成AI提示词</div>
              <div class="value prompt-text">{{ designData.prompt || '无' }}</div>
            </div>
          </div>

          <!-- 编辑模式表单 -->
          <div class="edit-form" v-else>
            <div class="form-group">
              <label for="design-title">教学设计标题</label>
              <input id="design-title" v-model="editForm.title" type="text" placeholder="请输入教学设计标题">
            </div>

            <div class="form-group">
              <label for="design-prompt">AI提示词</label>
              <textarea id="design-prompt" v-model="editForm.prompt" rows="3" placeholder="请输入AI提示词"></textarea>
            </div>
          </div>
        </div>

        <!-- 教学设计内容区域 -->
        <div class="design-content-container">
          <!-- 加载中状态 -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>正在加载教学设计内容...</p>
          </div>

          <!-- 空状态 -->
          <div v-else-if="!designContents || designContents.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p>暂无教学设计内容</p>
          </div>

          <!-- 内容展示 -->
          <div v-else class="design-content">
            <!-- 使用tabs来分类展示不同内容 -->
            <div class="content-tabs">
              <button
                  v-for="tab in contentTabs"
                  :key="tab.value"
                  class="tab-btn"
                  :class="{ active: activeTab === tab.value }"
                  @click="activeTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>

            <!-- Tab内容区域 -->
            <div class="tab-content">
              <template v-if="isEditing">
                <div class="form-group">
                  <label :for="`edit-${activeTab}`">{{ getTabLabel(activeTab) }}</label>
                  <textarea
                      :id="`edit-${activeTab}`"
                      v-model="editContentForm[activeTab]"
                      class="form-textarea"
                      rows="15"
                  ></textarea>
                </div>
              </template>
              <template v-else>
                <div class="content-section" v-if="getContentByType(activeTab)">
                  <div class="content-text" v-html="formatContent(getContentByType(activeTab).content)"></div>
                </div>
                <div v-else class="empty-tab-content">
                  <p>该部分暂无内容</p>
                </div>
              </template>
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
// 在script标签顶部添加导入
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt({
  html: true,        // 启用HTML标签
  breaks: true,      // 将换行符转换为<br>
  linkify: true,     // 自动将URL转换为链接
  typographer: true,  // 启用一些语言中性的替换和引号
});

export default {
  name: "TeachingDesignViewerModal",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    designId: {
      type: [Number, String],
      default: null
    },
    designData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isEditing: false,
      editForm: {},
      editContentForm: {
        overview: '',
        chapters: '',
        assessment: '',
        scoring: '',
        outcome: ''
      },
      saving: false,
      loading: false,
      activeTab: 'overview',
      designContents: [],
      contentTabs: [
        { label: '课程概述和设计目标', value: 'overview' },
        { label: '课程章节', value: 'chapters' },
        { label: '考核方案', value: 'assessment' },
        { label: '评分详细标准', value: 'scoring' },
        { label: '预计成果', value: 'outcome' }
      ],
      statusMap: [
        { value: 0, text: '草稿', class: 'status-draft' },
        { value: 1, text: '已完成', class: 'status-completed' }
      ]
    };
  },
  computed: {
    isTeacher() {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        return userInfo.roles?.some(role => role.roleKey === 'tea');
      }
      return false;
    }
  },
  watch: {
    visible(newVal) {
      if (newVal && this.designId) {
        this.loadDesignData();
      }
    },
    designData: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal && Object.keys(newVal).length > 0) {
          // 如果有designData，加载内容
          this.loadDesignContents();
        }
      }
    }
  },
  mounted() {
    if (this.visible) {
      if (this.designId) {
        this.loadDesignData();
      } else if (this.designData && Object.keys(this.designData).length > 0) {
        this.loadDesignContents();
      }
    }
  },
  methods: {
    // 开始编辑
    startEditing() {
      this.editForm = {
        id: this.designData.id,
        title: this.designData.title,
        prompt: this.designData.prompt
      };

      // 填充内容编辑表单
      this.designContents.forEach(content => {
        if (content.contentType && content.content) {
          this.editContentForm[content.contentType] = content.content;
        }
      });

      this.isEditing = true;
    },

    // 取消编辑
    cancelEditing() {
      if (confirm('确定要取消编辑吗？未保存的内容将丢失。')) {
        this.isEditing = false;
        this.editForm = {};
        this.resetEditContentForm();
      }
    },

    // 重置内容编辑表单
    resetEditContentForm() {
      this.editContentForm = {
        overview: '',
        chapters: '',
        assessment: '',
        scoring: '',
        outcome: ''
      };

      // 重新填充表单
      this.designContents.forEach(content => {
        if (content.contentType && content.content) {
          this.editContentForm[content.contentType] = content.content;
        }
      });
    },

    // 保存设计
    async saveDesign() {
      if (!this.editForm.title) {
        alert('教学设计标题不能为空');
        return;
      }

      this.saving = true;
      try {
        const token = localStorage.getItem('token');

        // 保存主表数据
        const mainResponse = await fetch('/dev-api/system/design', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: this.designData.id,
            title: this.editForm.title,
            prompt: this.editForm.prompt,
            status: this.designData.status
          })
        });

        if (!mainResponse.ok) {
          throw new Error('更新教学设计失败');
        }

        // 保存内容数据
        for (const contentType in this.editContentForm) {
          if (this.editContentForm[contentType]) {
            // 查找是否已存在该类型的内容
            const existingContent = this.designContents.find(c => c.contentType === contentType);

            if (existingContent) {
              // 更新现有内容
              await fetch('/dev-api/system/content', {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  id: existingContent.id,
                  designId: this.designData.id,
                  contentType: contentType,
                  content: this.editContentForm[contentType]
                })
              });
            } else {
              // 创建新内容
              await fetch('/dev-api/system/content', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  designId: this.designData.id,
                  contentType: contentType,
                  content: this.editContentForm[contentType]
                })
              });
            }
          }
        }

        alert('教学设计保存成功');
        this.isEditing = false;

        // 重新加载数据
        await this.loadDesignData();
      } catch (error) {
        console.error('保存教学设计失败:', error);
        alert('保存教学设计失败: ' + error.message);
      } finally {
        this.saving = false;
      }
    },

    // 加载教学设计数据
    async loadDesignData() {
      if (!this.designId) return;

      this.loading = true;
      try {
        const token = localStorage.getItem('token');

        // 获取主表数据
        const response = await fetch(`/dev-api/system/design/${this.designId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('获取教学设计失败');
        }

        const result = await response.json();
        if (result.code === 200 && result.data) {
          // 更新设计数据
          Object.assign(this.designData, result.data);
          // 加载内容数据
          this.loadDesignContents();
        }
      } catch (error) {
        console.error('加载教学设计数据失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 加载教学设计内容
    async loadDesignContents() {
      const designId = this.designId || this.designData.id;
      if (!designId) {
        console.error("无法确定教学设计ID");
        return;
      }

      this.loading = true;
      try {
        const token = localStorage.getItem('token');

        // 获取内容数据
        const response = await fetch(`/dev-api/system/content/list?designId=${designId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('获取教学设计内容失败');
        }

        const result = await response.json();
        if (result.rows && Array.isArray(result.rows)) {
          this.designContents = result.rows;

          // 初始化编辑表单
          this.resetEditContentForm();

          // 自动选择第一个有内容的标签
          for (const tab of this.contentTabs) {
            if (this.getContentByType(tab.value)) {
              this.activeTab = tab.value;
              break;
            }
          }
        } else {
          this.designContents = [];
        }
      } catch (error) {
        console.error('加载教学设计内容失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 根据内容类型获取内容
    getContentByType(contentType) {
      return this.designContents.find(item => item.contentType === contentType);
    },

    // 获取标签名称
    getTabLabel(tabValue) {
      const tab = this.contentTabs.find(t => t.value === tabValue);
      return tab ? tab.label : '';
    },

    // 格式化内容文本
    formatContent(content) {
      if (!content) return '';

      // 预处理Markdown内容，将连续的多个换行替换为两个换行（即一个空行）
      const normalizedContent = content.replace(/\n{3,}/g, '\n\n');

      // 使用markdown-it渲染处理后的内容
      return md.render(normalizedContent);
    },

    // 格式化日期时间
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

    // 获取状态文本
    getStatusText(status) {
      const statusObj = this.statusMap.find(item => item.value === Number(status));
      return statusObj ? statusObj.text : '未知状态';
    },

    // 获取状态类名
    getStatusClass(status) {
      const statusObj = this.statusMap.find(item => item.value === Number(status));
      return statusObj ? statusObj.class : '';
    },

    // 打印设计
    printDesign() {
      let printWindow = window.open('', '_blank');

      // CSS样式
      const printStyles = `
    body {
      font-family: SimSun, serif;
      padding: 20px;
      margin: 0;
      color: #333;
    }
    /* ...其他样式... */

    /* Markdown 样式 */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 {
      font-size: 2em;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3em;
    }
    h2 {
      font-size: 1.5em;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3em;
    }
    p { margin-bottom: 16px; }
    code {
      background-color: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: monospace;
    }
    pre {
      background-color: #f6f8fa;
      padding: 16px;
      border-radius: 3px;
      overflow: auto;
    }
    pre code {
      padding: 0;
      background-color: transparent;
    }
    blockquote {
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
      margin: 0 0 16px 0;
    }
    ul, ol {
      padding-left: 2em;
      margin-bottom: 16px;
    }
    table {
      border-collapse: collapse;
      margin-bottom: 16px;
      width: 100%;
    }
    table th, table td {
      border: 1px solid #dfe2e5;
      padding: 6px 13px;
    }
    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
  `;

      // 构建HTML文档结构
      let contentHtml = '';
      this.contentTabs.forEach(tab => {
        const content = this.getContentByType(tab.value);
        if (content) {
          contentHtml += `
        <div class="section">
          <div class="section-title">${tab.label}</div>
          <div class="section-content">${md.render(content.content)}</div>
        </div>
      `;
        }
      });

      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${this.designData.title || '教学设计'}</title>
            <meta charset="utf-8">
            <style>${printStyles}</style>
          </head>
          <body>
            <div class="no-print" style="position:fixed; top:10px; right:10px; padding:10px; background:#f0f0f0; border-radius:5px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
              <button onclick="window.print()" style="margin-right:10px; padding:5px 10px;">打印</button>
              <button onclick="window.close()" style="padding:5px 10px;">关闭</button>
            </div>
            <div class="print-header">
              <div class="print-title">${this.designData.title || '教学设计'}</div>
              <div class="print-info">版本: V${this.designData.version || '1'} | 创建时间: ${this.formatDateTime(this.designData.createTime)}</div>
            </div>
            ${contentHtml}
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

    // 关闭模态框
    handleClose() {
      if (this.isEditing) {
        if (!confirm('您有未保存的编辑内容，确定要关闭吗？')) {
          return;
        }
      }
      this.$emit('update:visible', false);
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
/* 模态窗口基础样式 */
.teaching-design-viewer-modal {
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
  background-color: #fafafa;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
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
  transition: all 0.2s;
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
  background-color: #fafafa;
}

.action-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #f5f5f5;
  border-color: #c0c0c0;
}

/* 教学设计信息卡片样式 */
.design-info-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.title-section h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #262626;
}

/* 设计状态样式 */
.design-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status-draft {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-completed {
  background-color: #f6ffed;
  color: #52c41a;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f0f0f0;
}

.edit-btn {
  color: #52c41a;
  border-color: #b7eb8f;
  background-color: #f6ffed;
}

.edit-btn:hover {
  background-color: #d9f7be;
  border-color: #95de64;
}

.print-btn {
  color: #1890ff;
  border-color: #91caff;
  background-color: #e6f7ff;
}

.print-btn:hover {
  background-color: #bae7ff;
  border-color: #69c0ff;
}

.save-btn {
  color: #1890ff;
  border-color: #91caff;
  background-color: #e6f7ff;
}

.save-btn:hover {
  background-color: #bae7ff;
  border-color: #69c0ff;
}

.save-btn:disabled {
  color: #bae7ff;
  border-color: #e6f7ff;
  background-color: #f0f7ff;
  cursor: not-allowed;
}

.cancel-btn {
  color: #ff4d4f;
  border-color: #ffa39e;
  background-color: #fff1f0;
}

.cancel-btn:hover {
  background-color: #ffccc7;
  border-color: #ff7875;
}

/* 信息网格样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 6px;
}

.value {
  font-size: 15px;
  font-weight: 500;
  color: #262626;
}

.prompt-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 教学设计内容容器样式 */
.design-content-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #8c8c8c;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #f0f0f0;
  border-radius: 50%;
  border-top: 3px solid #1890ff;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
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
  color: #bfbfbf;
}

.empty-state svg {
  margin-bottom: 16px;
  color: #d9d9d9;
}

/* 内容标签页样式 */
.content-tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.content-tabs::-webkit-scrollbar {
  height: 4px;
}

.content-tabs::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 2px;
}

.tab-btn {
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #595959;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.tab-btn:hover:not(.active) {
  color: #40a9ff;
}

/* 标签内容区域 */
.tab-content {
  padding: 20px 0;
}

.content-section {
  line-height: 1.8;
  color: #262626;
}

.content-text {
  white-space: pre-line;
  font-size: 15px;
}

.empty-tab-content {
  display: flex;
  justify-content: center;
  padding: 40px 0;
  color: #bfbfbf;
  font-style: italic;
}

/* 编辑表单样式 */
.edit-form {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #262626;
  font-size: 15px;
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

.form-textarea {
  resize: vertical;
  min-height: 240px;
  font-family: inherit;
  line-height: 1.6;
  padding: 12px !important;
  font-size: 15px !important;
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
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 12px 16px;
    font-size: 14px;
  }

  .info-header {
    flex-direction: column;
    gap: 12px;
  }

  .title-section {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

/* Markdown渲染优化样式 */
.content-text {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
}

/* 标题样式优化 */
.content-text h1, .content-text h2, .content-text h3,
.content-text h4, .content-text h5, .content-text h6 {
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  line-height: 1.25;
  font-weight: 600;
  color: #111;
}

.content-text h1 {
  font-size: 1.8em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eee;
}

.content-text h2 {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eee;
}

.content-text h3 { font-size: 1.25em; }
.content-text h4 { font-size: 1.15em; }

/* 段落样式优化 */
.content-text p {
  margin: 0 0 1em;
}

/* 列表样式优化 */
.content-text ul,
.content-text ol {
  padding-left: 1.5em;
  margin: 0 0 1em;
}

.content-text li + li {
  margin-top: 0.25em;
}

/* 代码样式优化 */
.content-text code {
  font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.04);
  color: #d63384;
}

.content-text pre {
  margin: 1em 0;
  padding: 1em;
  overflow: auto;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #eaecef;
}

.content-text pre code {
  display: block;
  padding: 0;
  color: inherit;
  background: none;
  overflow-x: auto;
  line-height: 1.5;
}

/* 引用块样式优化 */
.content-text blockquote {
  margin: 1em 0;
  padding: 0.5em 1em;
  color: #6c757d;
  border-left: 0.25em solid #6c757d;
  background-color: #f8f9fa;
}

.content-text blockquote > :first-child { margin-top: 0; }
.content-text blockquote > :last-child { margin-bottom: 0; }

/* 表格样式优化 */
.content-text table {
  display: block;
  width: 100%;
  overflow: auto;
  margin: 1em 0;
  border-collapse: collapse;
  border-spacing: 0;
}

.content-text table th {
  font-weight: 600;
  text-align: left;
}

.content-text table th,
.content-text table td {
  padding: 0.5em 1em;
  border: 1px solid #dfe2e5;
}

.content-text table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

/* 水平线样式 */
.content-text hr {
  height: 1px;
  margin: 1.5em 0;
  background-color: #e1e4e8;
  border: none;
}

/* 链接样式 */
.content-text a {
  color: #0969da;
  text-decoration: none;
}

.content-text a:hover {
  text-decoration: underline;
}

/* 图片样式 */
.content-text img {
  max-width: 100%;
  box-sizing: border-box;
  margin: 1em 0;
  border-radius: 6px;
}
</style>
