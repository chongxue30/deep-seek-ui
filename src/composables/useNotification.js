// src/composables/useNotification.js
import { ref } from 'vue'

export function useNotification() {
    const notification = ref({
        show: false,
        message: '',
        type: 'info' // 'success', 'error', 'info', 'warning'
    })

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

    return {
        notification,
        showNotification
    }
}
