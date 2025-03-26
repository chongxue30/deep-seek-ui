// src/composables/useChat.js
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { chatAPI } from '@/api/index'
import { authAPI } from '@/api/auth'
import { useNotification } from './useNotification'

export function useChat() {
    const router = useRouter()
    const { showNotification } = useNotification()

    // State
    const conversations = ref([])
    const currentConversation = ref(null)
    const messages = ref([])
    const inputMessage = ref('')
    const isLoading = ref(false)
    const messagesContainer = ref(null)
    const suggestedQuestions = ref([])
    const currentMessageId = ref(null)
    const uploadedFiles = ref([])
    const userInfo = ref(null)
    const inputField = ref(null)
    const isSpeaking = ref(false)
    const copySuccess = ref(false)
    const showLogoutConfirm = ref(false)

    // Methods
    const scrollToBottom = async () => {
        await nextTick()
        if (messagesContainer.value) {
            const container = messagesContainer.value
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
            )
            scrollAnimation.onfinish = () => {
                container.scrollTop = container.scrollHeight
            }
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
            isLoading.value = true
            const res = await chatAPI.getMessages({
                user: userInfo.value.userName,
                conversationId: conversationId
            })

            if (res.data) {
                // Process messages
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
            isLoading.value = false
        }
    }

    const deleteConversation = async (conversationId) => {
        try {
            if (!confirm('确定要删除这个对话吗？')) {
                return
            }

            const res = await chatAPI.deleteConversation({
                conversationId: conversationId,
                user: userInfo.value.userName
            })

            if (res.code === 200) {
                // Show success animation
                const index = conversations.value.findIndex(c => c.id === conversationId)
                if (index !== -1) {
                    const element = document.querySelectorAll('.chat-item')[index]
                    if (element) {
                        element.classList.add('deleting')
                        setTimeout(() => {
                            conversations.value = conversations.value.filter(c => c.id !== conversationId)
                            if (currentConversation.value?.id === conversationId) {
                                createNewChat()
                            }
                        }, 300)
                    } else {
                        conversations.value = conversations.value.filter(c => c.id !== conversationId)
                        if (currentConversation.value?.id === conversationId) {
                            createNewChat()
                        }
                    }
                }

                // Refresh conversations list
                await getConversations()
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error)
        }
    }

    const renameConversation = async (conversationId, newName) => {
        try {
            const res = await chatAPI.renameConversation({
                user: userInfo.value.userName,
                conversationId: conversationId,
                newName: newName
            })

            if (res.code === 200) {
                // Update local conversations list
                const index = conversations.value.findIndex(c => c.id === conversationId)
                if (index !== -1) {
                    conversations.value[index].name = newName

                    // If it's the current conversation, update that too
                    if (currentConversation.value?.id === conversationId) {
                        currentConversation.value.name = newName
                    }
                }
                showNotification('会话重命名成功', 'success')
                await getConversations()
            }
        } catch (error) {
            console.error('Failed to rename conversation:', error)
            showNotification('会话重命名失败', 'error')
        }
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
        if (!inputMessage.value.trim()) return

        // Add user message
        const messageId = generateId()
        const userMessage = {
            id: messageId,
            content: inputMessage.value,
            role: 'user',
            created_at: new Date(),
            files: uploadedFiles.value.map(file => ({
                id: file.id,
                name: file.name
            }))
        }
        messages.value.push(userMessage)

        // Add AI reply placeholder
        const aiMessageId = generateId()
        currentMessageId.value = aiMessageId

        const aiMessage = {
            id: aiMessageId,
            content: '',
            role: 'assistant',
            thinking: '',
            created_at: new Date()
        }
        messages.value.push(aiMessage)

        // Clear input and scroll
        const currentInput = inputMessage.value
        inputMessage.value = ''
        uploadedFiles.value = []
        scrollToBottom()
        isLoading.value = true

        try {
            const token = localStorage.getItem('token')
            // Create POST request
            const response = await fetch('https://chat.imutoj.cn/dev-api/deepSeek/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: currentInput,
                    conversationId: currentConversation.value?.id || '',
                    user: userInfo.value.userName,
                    responseMode: "streaming"
                })
            })

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`)
            }

            if (!response.body) {
                throw new Error('Response body is empty')
            }

            // Process streaming response
            const reader = response.body.getReader()
            const decoder = new TextDecoder('utf-8')
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()

                if (done) {
                    break
                }

                // Decode received data chunk
                const chunk = decoder.decode(value, { stream: true })
                buffer += chunk

                // Process complete SSE events
                const lines = buffer.split('\n\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                    if (!line.trim()) continue

                    // Parse event type and data
                    const eventMatch = line.match(/event:\s*(\w+)/)
                    const dataMatch = line.match(/data:\s*(.*)/)

                    if (!dataMatch) continue

                    const eventType = eventMatch ? eventMatch[1] : 'message'
                    let data = dataMatch[1].trim()

                    try {
                        // Parse JSON data
                        const parsedData = JSON.parse(data)

                        // Update UI based on event type
                        if (eventType === 'agent_thought' && parsedData.thought) {
                            // Update thinking process
                            const index = messages.value.findIndex(msg => msg.id === aiMessageId)
                            if (index !== -1) {
                                messages.value[index].thinking = parsedData.thought
                                await scrollToBottom()
                            }
                        } else if (eventType === 'agent_message' && parsedData.answer) {
                            // Update reply content
                            const index = messages.value.findIndex(msg => msg.id === aiMessageId)
                            if (index !== -1) {
                                messages.value[index].content += parsedData.answer
                                await scrollToBottom()
                            }
                        } else if (eventType === 'message' && parsedData.answer) {
                            // Handle regular message
                            const index = messages.value.findIndex(msg => msg.id === aiMessageId)
                            if (index !== -1) {
                                messages.value[index].content += parsedData.answer
                                await scrollToBottom()
                            }
                        }
                    } catch (e) {
                        console.error('Failed to parse data:', e, data)
                    }
                }
            }

            isLoading.value = false
            currentMessageId.value = null

            // If this is a new chat, get conversations
            if (!currentConversation.value) {
                getConversations()
            }
        } catch (error) {
            console.error('Failed to send message:', error)
            isLoading.value = false
            currentMessageId.value = null

            // If request failed, remove AI message
            messages.value = messages.value.filter(msg => msg.id !== aiMessageId)
        }
    }

    const stopResponse = () => {
        isLoading.value = false
        currentMessageId.value = null
        // Implement actual stop logic here
    }

    const handleSuggestedQuestion = (question) => {
        inputMessage.value = question
        sendMessage()
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            uploadedFiles.value.push({
                id: Date.now().toString(),
                name: file.name,
                file: file
            })
            // Reset the input to allow selecting the same file again
            event.target.value = ''
        }
    }

    const removeFile = (fileId) => {
        uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId)
    }

    const copyMessageContent = (message) => {
        // Create a temporary element to extract plain text content
        const tempElement = document.createElement('div')
        tempElement.innerHTML = message.content
        const textContent = tempElement.textContent || tempElement.innerText || ''

        navigator.clipboard.writeText(textContent).then(() => {
            // Show copy success notification
            copySuccess.value = true
            setTimeout(() => {
                copySuccess.value = false
            }, 2000)
        }).catch(err => {
            console.error('复制失败:', err)
            showNotification('复制失败，请重试', 'error')
        })
    }

    const playMessageAudio = async (message) => {
        try {
            // Stop any currently playing speech
            stopSpeaking()

            // Use Web Speech API for text-to-speech
            const speech = new SpeechSynthesisUtterance()
            speech.lang = 'zh-CN'

            // Create a temporary element to extract plain text content
            const tempElement = document.createElement('div')
            tempElement.innerHTML = message.content
            speech.text = tempElement.textContent || tempElement.innerText || ''

            speech.volume = 1
            speech.rate = 1
            speech.pitch = 1

            // Set speech end event
            speech.onend = () => {
                isSpeaking.value = false
            }

            // Play speech
            window.speechSynthesis.speak(speech)
            isSpeaking.value = true

            showNotification('正在播放语音...', 'info')
        } catch (error) {
            console.error('语音播放错误:', error)
            showNotification('语音播放失败', 'error')
        }
    }

    const stopSpeaking = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel()
            isSpeaking.value = false
        }
    }

    const getUserInfo = async () => {
        try {
            // Get user info from localStorage or API
            const userInfoStr = localStorage.getItem('userInfo')
            if (userInfoStr) {
                userInfo.value = JSON.parse(userInfoStr)
            } else {
                // If localStorage doesn't have it, get from API
                const res = await authAPI.getInfo()
                if (res.code === 200 && res.user) {
                    userInfo.value = res.user
                    localStorage.setItem('userInfo', JSON.stringify(res.user))
                }
            }
        } catch (error) {
            console.error('Failed to get user info:', error)
        }
    }

    const handleLogout = () => {
        showLogoutConfirm.value = true
    }

    const cancelLogout = () => {
        showLogoutConfirm.value = false
    }

    const confirmLogout = async () => {
        try {
            await authAPI.logout()
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            showNotification('已成功退出登录', 'success')
            setTimeout(() => {
                router.push('/login')
            }, 1000)
        } catch (error) {
            console.error('Failed to logout:', error)
            showNotification('退出登录失败', 'error')
        } finally {
            showLogoutConfirm.value = false
        }
    }

    const autoResize = () => {
        if (!inputField.value) return

        // Reset height to auto to get the correct scrollHeight
        inputField.value.style.height = 'auto'

        // Set new height based on scrollHeight (with max height limit)
        const newHeight = Math.min(inputField.value.scrollHeight, 150)
        inputField.value.style.height = `${newHeight}px`
    }

    return {
        conversations,
        currentConversation,
        messages,
        inputMessage,
        isLoading,
        messagesContainer,
        suggestedQuestions,
        currentMessageId,
        uploadedFiles,
        userInfo,
        inputField,
        isSpeaking,
        copySuccess,
        showLogoutConfirm,
        createNewChat,
        handleSelectChat,
        getMessages,
        deleteConversation,
        renameConversation,
        getConversations,
        sendMessage,
        stopResponse,
        handleSuggestedQuestion,
        handleFileUpload,
        removeFile,
        copyMessageContent,
        playMessageAudio,
        stopSpeaking,
        getUserInfo,
        handleLogout,
        cancelLogout,
        confirmLogout,
        autoResize
    }
}
