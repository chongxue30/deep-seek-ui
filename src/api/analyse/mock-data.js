// 模拟数据，用于开发环境测试
export const mockData = {
    // 基本统计数据
    statistics: {
        code: 200,
        data: {
            totalQuestions: 1248,
            totalStudents: 356,
            totalSubjects: 12,
            todayQuestions: 87,
        },
    },

    // 问题类型分布
    questionTypes: {
        code: 200,
        data: [
            { name: "概念解释", value: 425 },
            { name: "操作指导", value: 318 },
            { name: "原理分析", value: 265 },
            { name: "比较分析", value: 178 },
            { name: "一般提问", value: 62 },
        ],
    },

    // 学科分布
    subjects: {
        code: 200,
        data: [
            { name: "编程语言", value: 385 },
            { name: "数据结构与算法", value: 275 },
            { name: "数据库", value: 210 },
            { name: "Web开发", value: 185 },
            { name: "计算机网络", value: 120 },
        ],
    },

    // 复杂度分布
    complexityDistribution: {
        code: 200,
        data: {
            simple: 520,
            medium: 430,
            complex: 298,
        },
    },

    // 每日提问趋势
    dailyTrend: {
        code: 200,
        data: [
            { date: "03-01", count: 45 },
            { date: "03-02", count: 52 },
            { date: "03-03", count: 49 },
            { date: "03-04", count: 62 },
            { date: "03-05", count: 58 },
            { date: "03-06", count: 73 },
            { date: "03-07", count: 80 },
        ],
    },

    // 热门关键词
    hotKeywords: {
        code: 200,
        data: [
            { keyword: "React", frequency: 85 },
            { keyword: "JavaScript", frequency: 72 },
            { keyword: "Python", frequency: 68 },
            { keyword: "数据库", frequency: 56 },
            { keyword: "算法", frequency: 52 },
            { keyword: "CSS", frequency: 48 },
            { keyword: "Node.js", frequency: 45 },
            { keyword: "Vue", frequency: 42 },
            { keyword: "TypeScript", frequency: 38 },
            { keyword: "网络", frequency: 35 },
        ],
    },

    // 活跃学生
    activeStudents: {
        code: 200,
        data: [
            { userName: "张三", mainSubject: "编程语言", totalQuestions: 45, learningScore: 92 },
            { userName: "李四", mainSubject: "数据结构", totalQuestions: 38, learningScore: 85 },
            { userName: "王五", mainSubject: "Web开发", totalQuestions: 32, learningScore: 78 },
            { userName: "赵六", mainSubject: "数据库", totalQuestions: 28, learningScore: 75 },
            { userName: "钱七", mainSubject: "计算机网络", totalQuestions: 25, learningScore: 70 },
        ],
    },

    // 学生画像
    studentProfile: {
        code: 200,
        data: {
            userName: "张三",
            totalQuestions: 45,
            mainSubject: "编程语言",
            lastActiveTime: "2023-03-07 15:30",
            learningStatus: "优秀",
            complexityDistribution: {
                simple: 20,
                medium: 15,
                complex: 10,
            },
            learningProgressItems: [
                { dimensionName: "基础知识", score: 85, color: "#4361ee" },
                { dimensionName: "实践能力", score: 72, color: "#f72585" },
                { dimensionName: "创新思维", score: 63, color: "#f8961e" },
                { dimensionName: "团队协作", score: 90, color: "#43aa8b" },
            ],
            recommendationItems: [
                {
                    icon: "el-icon-reading",
                    title: "加强基础知识学习",
                    description: "建议多阅读相关教材，巩固基础知识点。",
                },
                {
                    icon: "el-icon-cpu",
                    title: "增加实践项目经验",
                    description: "参与更多实际项目，提升编程实践能力。",
                },
                {
                    icon: "el-icon-data-line",
                    title: "关注学习效率",
                    description: "建议制定合理的学习计划，提高学习效率。",
                },
            ],
        },
    },

    // 处理历史数据
    processHistoryData: {
        code: 200,
        msg: "历史数据处理成功",
    },
}

