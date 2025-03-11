<template>
  <div class="knowledge-base-container">
    <!-- 知识库管理按钮 -->
    <div class="knowledge-base">
      <el-button @click="showModal" :icon="FolderAdd">
        知识库管理
      </el-button>
    </div>

    <!-- 知识库管理弹窗 -->
    <el-dialog
      v-model="showKnowledgeModal"
      title="知识库管理"
      width="50%"
    >
      <div class="knowledge-list">
        <div v-for="kb in knowledgeBases" 
             :key="kb.id" 
             class="knowledge-item">
          <div class="knowledge-info">
            <div class="knowledge-name">{{ kb.name }}</div>
            <div class="knowledge-details" v-if="kb.description || kb.document_count !== undefined">
              <span v-if="kb.description">{{ kb.description }}</span>
              <span v-if="kb.document_count !== undefined" class="document-count">文档数: {{ kb.document_count }}</span>
              <span v-if="kb.word_count !== undefined" class="word-count">词数: {{ kb.word_count }}</span>
            </div>
          </div>
          <el-upload
            :auto-upload="false"
            :on-change="(file) => handleFileChange(file, kb.id)"
          >
            <el-button type="primary" :icon="Upload">上传文件</el-button>
          </el-upload>
        </div>
      </div>
      <template #footer>
        <el-button @click="createKnowledgeBase" :icon="Plus">
          创建知识库
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import { FolderAdd, Upload, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { chatAPI } from '@/api/index'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['create-knowledge-base', 'file-change'])

const showKnowledgeModal = ref(false)
const knowledgeBases = ref([])

const showModal = () => {
  showKnowledgeModal.value = true
}

// 获取知识库列表
const getKnowledgeBases = async () => {
  try {
    const res = await chatAPI.dataset.list()
    console.log('知识库列表响应:', res)
    
    if (res.data && Array.isArray(res.data)) {
      knowledgeBases.value = res.data.map(kb => ({
        id: kb.id,
        name: kb.name,
        description: kb.description || '',
        document_count: kb.document_count,
        word_count: kb.word_count
      }))
    }
  } catch (error) {
    console.error('获取知识库列表失败:', error)
    ElMessage.error('获取知识库列表失败')
  }
}

const createKnowledgeBase = async () => {
  try {
    const name = await ElMessageBox.prompt('请输入知识库名称', '创建知识库', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    
    if (name.value) {
      try {
        const res = await chatAPI.dataset.create({
          name: name.value,
          user: props.userInfo?.userName || 'guest'
        })
        
        if (res.code === 200) {
          ElMessage.success('创建知识库成功')
          await getKnowledgeBases()
          emit('create-knowledge-base', name.value)
        }
      } catch (error) {
        console.error('创建知识库失败:', error)
        ElMessage.error('创建知识库失败')
      }
    }
  } catch (error) {
    // 用户取消操作，不做处理
  }
}

const handleFileChange = async (file, datasetId) => {
  try {
    // 这里可以添加文件上传到知识库的逻辑
    emit('file-change', { file: file.raw, datasetId })
    // 上传成功后刷新知识库列表
    await getKnowledgeBases()
  } catch (error) {
    console.error('文件上传失败:', error)
    ElMessage.error('文件上传失败')
  }
}

onMounted(() => {
  getKnowledgeBases()
})
</script>

<style scoped lang="scss">
.knowledge-base-container {
  .knowledge-base {
    padding: 16px;
    border-top: 1px solid #334155;
  }

  .knowledge-list {
    .knowledge-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
      
      .knowledge-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        .knowledge-name {
          font-weight: bold;
          font-size: 16px;
        }
        
        .knowledge-details {
          font-size: 12px;
          color: #64748b;
          display: flex;
          gap: 8px;
          
          .document-count, .word-count {
            background-color: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>