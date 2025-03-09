<template>
  <div class="voice-recorder">
    <el-button 
      :class="{ recording: isRecording }"
      :icon="isRecording ? 'Microphone' : 'MicrophoneOff'"
      @click="toggleRecording"
    >
      {{ isRecording ? '结束录音' : '开始录音' }}
    </el-button>
    <div v-if="isRecording" class="recording-status">
      <span class="recording-indicator"></span>
      <span class="recording-time">{{ formatTime(recordingTime) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const emit = defineEmits(['recordComplete'])

const isRecording = ref(false)
const recordingTime = ref(0)
const mediaRecorder = ref(null)
const chunks = ref([])
let timer = null

const toggleRecording = async () => {
  if (!isRecording.value) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.value = new MediaRecorder(stream)
      
      mediaRecorder.value.ondataavailable = (e) => {
        chunks.value.push(e.data)
      }
      
      mediaRecorder.value.onstop = () => {
        const blob = new Blob(chunks.value, { type: 'audio/wav' })
        emit('recordComplete', blob)
        chunks.value = []
        recordingTime.value = 0
        clearInterval(timer)
      }
      
      mediaRecorder.value.start()
      isRecording.value = true
      
      timer = setInterval(() => {
        recordingTime.value++
      }, 1000)
    } catch (err) {
      console.error('录音失败:', err)
      ElMessage.error('无法访问麦克风')
    }
  } else {
    mediaRecorder.value.stop()
    isRecording.value = false
  }
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
  }
  clearInterval(timer)
})
</script>

<style scoped>
.voice-recorder {
  display: flex;
  align-items: center;
  gap: 10px;
}

.recording {
  background-color: #f56c6c !important;
  color: white !important;
}

.recording-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recording-indicator {
  width: 8px;
  height: 8px;
  background-color: #f56c6c;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

.recording-time {
  font-size: 14px;
  color: #f56c6c;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style> 