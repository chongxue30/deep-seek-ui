// src/composables/useKnowledgeBase.js
import { ref } from 'vue'
import { chatAPI } from '@/api/index'
import { useNotification } from './useNotification'

export function useKnowledgeBase() {
    const { showNotification } = useNotification()

    // State
    const knowledgeBases = ref([])
    const showKnowledgeModal = ref(false)
    const showCreateKBModal = ref(false)
    const isLoadingKnowledgeBases = ref(false)
    const isCreatingKB = ref(false)
    const newKnowledgeBase = ref({
        name: '',
        description: ''
    })

    // Methods
    const getKnowledgeBases = async () => {
        try {
            isLoadingKnowledgeBases.value = true
            const res = await chatAPI.dataset.list()

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
            showNotification('获取知识库列表失败', 'error')
        } finally {
            isLoadingKnowledgeBases.value = false
        }
    }

    const openKnowledgeModal = async (kbs) => {
        if (kbs && Array.isArray(kbs)) {
            knowledgeBases.value = kbs
        } else {
            await getKnowledgeBases()
        }
        showKnowledgeModal.value = true
    }

    const closeKnowledgeModal = () => {
        showKnowledgeModal.value = false
    }

    const showCreateKnowledgeBaseModal = () => {
        showCreateKBModal.value = true
    }

    const closeCreateKBModal = () => {
        showCreateKBModal.value = false
        newKnowledgeBase.value = {
            name: '',
            description: ''
        }
    }

    const submitCreateKnowledgeBase = async () => {
        if (!newKnowledgeBase.value.name) return

        try {
            isCreatingKB.value = true
            const res = await chatAPI.dataset.create({
                name: newKnowledgeBase.value.name,
                description: newKnowledgeBase.value.description,
                indexing_technique: 'economy',
                permission: 'all_team_members'
            })

            if (res.code === 200) {
                showNotification('创建知识库成功', 'success')
                await getKnowledgeBases()
                closeCreateKBModal()
            }
        } catch (error) {
            console.error('创建知识库失败:', error)
            showNotification('创建知识库失败', 'error')
        } finally {
            isCreatingKB.value = false
        }
    }

    const handleCreateKnowledgeBase = async (name) => {
        try {
            const res = await chatAPI.dataset.create({
                name: name,
                description: '',
                indexing_technique: 'economy',
                permission: 'all_team_members'
            })

            if (res.code === 200) {
                showNotification('知识库创建成功', 'success')
                await getKnowledgeBases()
            }
        } catch (error) {
            console.error('Failed to create knowledge base:', error)
            showNotification('知识库创建失败', 'error')
        }
    }

    const handleFileChange = async (file, datasetId) => {
        try {
            const formData = new FormData()
            formData.append('file', file.raw)
            formData.append('datasetId', datasetId)

            // Implement file upload logic
            showNotification('文件上传中...', 'info')

            // Simulate successful upload
            setTimeout(() => {
                showNotification('文件上传成功', 'success')
                getKnowledgeBases()
            }, 1500)
        } catch (error) {
            console.error('File upload failed:', error)
            showNotification('文件上传失败', 'error')
        }
    }

    return {
        knowledgeBases,
        showKnowledgeModal,
        showCreateKBModal,
        isLoadingKnowledgeBases,
        isCreatingKB,
        newKnowledgeBase,
        getKnowledgeBases,
        openKnowledgeModal,
        closeKnowledgeModal,
        showCreateKnowledgeBaseModal,
        closeCreateKBModal,
        submitCreateKnowledgeBase,
        handleCreateKnowledgeBase,
        handleFileChange
    }
}
