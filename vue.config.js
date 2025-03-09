const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,  // 暂时关闭 lint，等配置正确后可以重新打开
  // webpack-dev-server 相关配置
  devServer: {
    port: 8081,
    open: true,
    proxy: {
      // 配置反向代理
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/dev-api': '' },
        logLevel: 'debug' // 添加日志级别，方便调试
      }
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.ts', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src/')
      }
    }
  }
})
