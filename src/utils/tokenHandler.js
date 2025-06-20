import { ElMessageBox } from 'element-plus'
import router from '@/router'

// 处理token过期
export function handleTokenExpired() {
    console.log('进入handleTokenExpired函数')

    // 检查标记是否存在以及是否过期
    const expiredFlagData = localStorage.getItem('isShowingTokenExpired')
    const now = Date.now()

    if (expiredFlagData) {
        try {
            const flagData = JSON.parse(expiredFlagData)
            // 如果标记存在且未过期（设置5分钟过期时间）
            if (flagData.timestamp && (now - flagData.timestamp < 5 * 60 * 1000)) {
                console.log('检测到有效的isShowingTokenExpired，跳过弹窗')
                return Promise.reject('登录状态已过期')
            } else {
                console.log('检测到过期的isShowingTokenExpired，将重新设置')
            }
        } catch (e) {
            console.log('解析isShowingTokenExpired失败，将重新设置')
        }
    }

    console.log('设置isShowingTokenExpired')
    // 存储带时间戳的标记
    localStorage.setItem('isShowingTokenExpired', JSON.stringify({
        timestamp: now
    }))

    console.log('准备显示ElMessageBox')

    // 使用最简单的弹窗方式
    ElMessageBox.alert('您的登录状态已失效，请重新登录后继续操作', '登录状态已过期', {
        confirmButtonText: '重新登录',
        callback: () => {
            console.log('用户点击确认按钮')
            // 清除登录信息
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('isShowingTokenExpired')

            // 跳转到登录页
            router.push('/login')
        }
    })

    return Promise.reject('登录状态已过期')
}
