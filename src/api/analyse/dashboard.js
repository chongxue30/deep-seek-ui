import request from "@/utils/request"

// 获取仪表盘统计数据
export function getStatistics() {
    return request({
        url: "/analyse/dashboard/statistics",  // 改为相对路径
        method: "get",
        headers: {
            'Authorization': localStorage.getItem('token') || '' // 添加认证头
        }
    })
}

// 获取问题类型分布
export function getQuestionTypes() {
    return request({
        url: "/analyse/dashboard/questionTypes",
        method: "get",
        headers: {
            'Authorization': localStorage.getItem('token') || '' // 添加认证头
        }
    })
}

// 获取学科分布
export function getSubjects() {
    return request({
        url: "/analyse/dashboard/subjects",
        method: "get",
        headers: {
            'Authorization': localStorage.getItem('token') || '' // 添加认证头
        }
    })
}

// 获取复杂度分布
export function getComplexityDistribution() {
    return request({
        url: "/analyse/dashboard/complexity",
        method: "get",
        headers: {
            'Authorization': localStorage.getItem('token') || '' // 添加认证头
        }
    })
}

// 获取每日提问趋势
export function getDailyTrend() {
    return request({
        url: "/analyse/dashboard/dailyTrend",
        method: "get",
        headers: {
            'Authorization': localStorage.getItem('token') || '' // 添加认证头
        }
    })
}

// 获取热门关键词
export function getHotKeywords() {
    return request({
        url: "/analyse/dashboard/hotKeywords",
        method: "get",
        headers: {
            'Authorization': localStorage.getItem('token') || '' // 添加认证头
        }
    })
}

// 获取最活跃学生
export function getActiveStudents() {
    return request({
        url: "/analyse/dashboard/activeStudents",
        method: "get",
        headers: {
            'Authorization': localStorage.getItem('token') || '' // 添加认证头
        }
    })
}

// 获取学生学习画像
export function getStudentProfile(userName) {
    return request({
        url: "/analyse/dashboard/studentProfile",
        method: "get",
        params: { userName },
        headers: {
            'Authorization': localStorage.getItem('token') || '' // 添加认证头
        }
    })
}

// 历史数据处理
export function processHistoryData() {
    return request({
        url: "/analyse/processHistoryData",
        method: "post",
        headers: {
            'Authorization': localStorage.getItem('token') || '' // 添加认证头
        }
    })
}

