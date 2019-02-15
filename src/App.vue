<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,body {
  height: 100%;
  overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  color: #2c3e50;
}
.el-select {
  width: 100%;
}
.sub-btn {
  text-align:center;
}
.block {
  text-align: center;
  margin-top: 15px;
}
.searchForm {
  flex: 0 0 80%;
  text-align: center;
  padding-top: 3px;
}
.searchForm .el-form-item {
  margin-bottom: 0;
}
.parts-search {
  display: flex;
  height: 50px;
  padding: 0 20px;
  margin-top: 30px;
  border: 1px solid #EBEEF5;
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  box-sizing: border-box;
}
h4 {
  margin: 0;
  padding: 0;
  line-height: 50px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
