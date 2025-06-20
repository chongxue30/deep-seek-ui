// src/composables/useDocuments.js
import { ref } from 'vue'
import { useNotification } from './useNotification'
import { formatFileSize } from '@/utils/formatters'

export function useDocuments() {
    const { showNotification } = useNotification()

    // State
    const documents = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalPages = ref(1)
    const totalItems = ref(0)
    const showDocsModal = ref(false)
    const showAddDocModal = ref(false)
    const showDocContentModal = ref(false)
    const isLoadingDocs = ref(false)
    const isLoadingDocContent = ref(false)
    const isAddingDoc = ref(false)
    const currentKnowledgeBase = ref(null)
    const currentDocument = ref(null)
    const selectedFile = ref(null)
    const addDocTab = ref('upload')
    const fileInput = ref(null)
    const newDocument = ref({
        name: '',
        text: ''
    })

    // Methods
    const getDocuments = async (datasetId) => {
        try {
            isLoadingDocs.value = true
            const token = localStorage.getItem('token')
            // Use URL query parameters instead of request body
            const res = await fetch(`/dev-api/document/list?page=${currentPage.value}&limit=${pageSize.value}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ datasetId })
            })

            if (res.ok) {
                const data = await res.json()
                if (data.data && Array.isArray(data.data.items)) {
                    documents.value = data.data.items
                    totalItems.value = data.data.total || 0
                    totalPages.value = Math.ceil(totalItems.value / pageSize.value) || 1
                } else if (data.data && Array.isArray(data.data)) {
                    // Compatible with old API format
                    documents.value = data.data
                    totalItems.value = data.data.length
                    totalPages.value = 1
                } else {
                    documents.value = []
                    totalItems.value = 0
                    totalPages.value = 1
                }
            } else {
                throw new Error('获取文档列表失败')
            }
        } catch (error) {
            console.error('获取文档列表失败:', error)
            showNotification('获取文档列表失败', 'error')
            documents.value = []
            totalItems.value = 0
            totalPages.value = 1
        } finally {
            isLoadingDocs.value = false
        }
    }

    const changePage = (page) => {
        if (page < 1 || page > totalPages.value) return
        currentPage.value = page
        getDocuments(currentKnowledgeBase.value.id)
    }

    const showDocumentsModal = async (kb) => {
        currentKnowledgeBase.value = kb
        currentPage.value = 1 // Reset to first page
        showDocsModal.value = true
        await getDocuments(kb.id)
    }

    const showAddDocumentModal = (kb) => {
        currentKnowledgeBase.value = kb
        addDocTab.value = 'upload'
        selectedFile.value = null
        newDocument.value = {
            name: '',
            text: ''
        }
        showAddDocModal.value = true
    }

    const closeAddDocModal = () => {
        showAddDocModal.value = false
    }

    const triggerFileInput = () => {
        fileInput.value.click()
    }

    const onFileDrop = (event) => {
        const file = event.dataTransfer.files[0]
        if (file) {
            selectedFile.value = file
        }
    }

    const onFileSelected = (event) => {
        const file = event.target.files[0]
        if (file) {
            selectedFile.value = file
        }
    }

    const submitAddDocument = async () => {
        if (addDocTab.value === 'upload' && !selectedFile.value) return
        if (addDocTab.value === 'text' && (!newDocument.value.name || !newDocument.value.text)) return

        try {
            isAddingDoc.value = true

            if (addDocTab.value === 'upload') {
                try {
                    // Get token
                    const token = localStorage.getItem('token')

                    // Create FormData object
                    const formData = new FormData()
                    formData.append('file', selectedFile.value)
                    formData.append('datasetId', currentKnowledgeBase.value.id)

                    // Add fixed JSON data
                    const processData = JSON.stringify({
                        indexing_technique: "economy",
                        process_rule: {
                            mode: "automatic",
                            rules: {}
                        }
                    })
                    formData.append('data', processData)

                    // Send request to backend API
                    const response = await fetch('http://localhost:8080/document/createByFile', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                            // Note: Don't manually set Content-Type when using FormData
                        },
                        body: formData
                    })

                    if (!response.ok) {
                        throw new Error(`上传失败: ${response.status}`)
                    }

                    const result = await response.text()
                    console.log('上传结果:', result)

                    showNotification('文件上传成功', 'success')
                    await getDocuments(currentKnowledgeBase.value.id)
                    closeAddDocModal()
                } catch (error) {
                    console.error('文件上传失败:', error)
                    showNotification('文件上传失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error')
                }
            } else {
                // Manually create text document
                const token = localStorage.getItem('token')
                const res = await fetch('http://localhost:8080/document/create', {
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
                        processRule: { mode: 'automatic' }
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

    const closeDocsModal = () => {
        showDocsModal.value = false
    }

    const viewDocument = async (doc) => {
        currentDocument.value = doc
        showDocContentModal.value = true

        // If document doesn't have text field, need to get document content
        if (!doc.text) {
            try {
                isLoadingDocContent.value = true
                // Here should call API to get document content
                // Simulate getting document content
                setTimeout(() => {
                    currentDocument.value = {
                        ...doc,
                        text: '您暂无权限查看知识库文档内容！'
                    }
                    isLoadingDocContent.value = false
                }, 1000)
            } catch (error) {
                console.error('获取文档内容失败:', error)
                showNotification('获取文档内容失败', 'error')
                isLoadingDocContent.value = false
            }
        }
    }

    const closeDocContentModal = () => {
        showDocContentModal.value = false
    }

    return {
        documents,
        currentPage,
        pageSize,
        totalPages,
        totalItems,
        showDocsModal,
        showAddDocModal,
        showDocContentModal,
        isLoadingDocs,
        isLoadingDocContent,
        isAddingDoc,
        currentKnowledgeBase,
        currentDocument,
        selectedFile,
        addDocTab,
        newDocument,
        fileInput,
        getDocuments,
        changePage,
        showDocumentsModal,
        showAddDocumentModal,
        closeAddDocModal,
        triggerFileInput,
        onFileDrop,
        onFileSelected,
        submitAddDocument,
        closeDocsModal,
        viewDocument,
        closeDocContentModal
    }
}
