<template>
  <div class="audio-player">
    <el-button 
      :class="{ playing: isPlaying }"
      :icon="isPlaying ? 'VideoPause' : 'VideoPlay'"
      @click="togglePlay"
      size="small"
    >
      {{ isPlaying ? '暂停' : '播放' }}
    </el-button>
    
    <div class="progress-container">
      <div class="progress-bar" @click="seek" ref="progressBar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
        <div class="progress-handle" :style="{ left: progress + '%' }"></div>
      </div>
      <div class="time-display">
        <span>{{ formatTime(currentTime) }}</span>
        <span>/</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'

const props = defineProps({
  audioData: {
    type: String,
    required: true
  }
})

const audio = ref(null)
const isPlaying = ref(false)
const duration = ref(0)
const currentTime = ref(0)
const progress = ref(0)
const isDarkMode = inject('isDarkMode', ref(false))

onMounted(() => {
  // 检查audioData是否已经是Blob URL
  if (props.audioData.startsWith('blob:')) {
    audio.value = new Audio(props.audioData)
  } else {
    // 如果是base64，则转换为Blob
    try {
      const audioBlob = base64ToBlob(props.audioData, 'audio/wav')
      audio.value = new Audio(URL.createObjectURL(audioBlob))
    } catch (error) {
      console.error('Error processing audio data:', error)
      audio.value = new Audio(props.audioData)
    }
  }
  
  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value.duration
  })
  audio.value.addEventListener('timeupdate', updateProgress)
  audio.value.addEventListener('ended', () => {
    isPlaying.value = false
  })
})

onUnmounted(() => {
  audio.value.removeEventListener('timeupdate', updateProgress)
  audio.value.pause()
})

const togglePlay = () => {
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const updateProgress = () => {
  currentTime.value = audio.value.currentTime
  progress.value = (audio.value.currentTime / audio.value.duration) * 100
}

const seek = (event) => {
  const rect = event.target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  audio.value.currentTime = percent * audio.value.duration
}

const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const base64ToBlob = (base64, type) => {
  try {
    const byteCharacters = atob(base64)
    const byteArrays = []
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i))
    }
    
    return new Blob([new Uint8Array(byteArrays)], { type })
  } catch (error) {
    console.error('Error converting base64 to blob:', error)
    return new Blob([], { type })
  }
}
</script>

<style scoped>
.audio-player {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa, #edf2f7);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.progress-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-bar {
  height: 6px;
  background: rgba(233, 236, 239, 0.8);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #3d84f7, #64a8ff);
  border-radius: 3px;
  position: relative;
  transition: width 0.1s ease;
}

.progress-handle {
  width: 14px;
  height: 14px;
  background: #ffffff;
  border: 2px solid #3d84f7;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.progress-handle:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.time-display {
  display: flex;
  gap: 4px;
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.playing {
  background: linear-gradient(135deg, #3d84f7, #2563eb) !important;
  color: white !important;
  box-shadow: 0 2px 5px rgba(37, 99, 235, 0.3) !important;
}

:deep(.dark-theme) .audio-player {
  background: linear-gradient(135deg, #2a2a2a, #1e1e1e);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:deep(.dark-theme) .progress-bar {
  background: rgba(60, 60, 60, 0.8);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

:deep(.dark-theme) .progress {
  background: linear-gradient(90deg, #3d84f7, #1d4ed8);
}

:deep(.dark-theme) .progress-handle {
  background: #333;
  border: 2px solid #3d84f7;
}

:deep(.dark-theme) .time-display {
  color: #a0a0a0;
}
</style>