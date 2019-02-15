const express = require('express')
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, '../dist')))
app.listen(3001, function () {
  console.log('监听3000端口成功')
})
