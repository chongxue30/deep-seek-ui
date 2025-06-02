import crypto from './crypto'

// 保存原始的fetch方法
const originalFetch = window.fetch

// 重写全局fetch方法
window.fetch = async function(url, options = {}) {
    let newUrl = url
    let newOptions = {...options}

    // 只处理开发API的请求
    if (url.includes('/dev-api/')) {
        // 处理GET请求参数加密
        if (!options.method || options.method === 'GET') {
            const queryIndex = url.indexOf('?')
            if (queryIndex > -1) {
                const baseUrl = url.substring(0, queryIndex)
                const queryParams = url.substring(queryIndex + 1)
                const encryptedParams = crypto.encrypt(queryParams)
                newUrl = `${baseUrl}?encrypted=${encodeURIComponent(encryptedParams)}`
            }
        }
        // 处理POST等其他请求体加密
        else if (options.body) {
            try {
                // 如果body是JSON字符串，则解析后加密
                const bodyData = JSON.parse(options.body)
                const encryptedData = crypto.encrypt(bodyData)
                newOptions.body = JSON.stringify({ encrypted: encryptedData })
            } catch (e) {
                // 如果body不是JSON字符串，直接加密整个字符串
                const encryptedData = crypto.encrypt(options.body)
                newOptions.body = JSON.stringify({ encrypted: encryptedData })
            }

            newOptions.headers = {
                ...newOptions.headers,
                'Content-Type': 'application/json'
            }
        }
    }

    // 使用原始fetch方法发送请求
    return originalFetch(newUrl, newOptions)
}
