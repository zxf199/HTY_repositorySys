const express = require('express')
const path = require('path')
const app = express()
const history = require('connect-history-api-fallback') // 为了vue路由的history模式配置的中间件
app.use(history()) // 必须放在static上面 nginx.conf在服务器上查找的路径是cd /usr/local/nginx/conf
app.use(express.static(path.join(__dirname, '../dist')))
app.listen(3001, function () {
  console.log('监听3001端口成功')
})
