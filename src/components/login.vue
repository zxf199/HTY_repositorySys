<template>
  <el-row>
    <el-col :span="6" :offset="9">
      <el-card shadow="hover">
        <h2 class="title">用户登录</h2>
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="65px">
          <el-form-item label="用户名" prop="unm">
            <el-input v-model="loginForm.unm"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input v-model="loginForm.pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item class="sub-btn">
            <el-button type="primary" @click="submitForm('loginForm')" @keyup.enter="submitForm">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        unm: '',
        pwd: ''
      },
      loginRules: {
        unm: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          this.$axios.post('/api/user/login', this.loginForm).then(res => {
            if (res.data.code === 200) {
              localStorage.userInfo = JSON.stringify(res.data.data)
              sessionStorage.currentIndex = '1'
              this.$router.push({name: 'mainPage'})
              this.$message({
                message: '登录成功',
                type: 'success'
              })
            } else {
              this.$message.error('用户名或密码错误')
            }
          })
        }
      })
    },
    keyupEnter () {
      document.onkeydown = e => {
        if (e.keyCode === 13) {
          this.submitForm('loginForm')
        }
      }
    }
  },
  created () {
    this.keyupEnter()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
.el-row {
  text-align:center;
}
.title {
  margin-left: 35px;
}
.sub-btn {
  margin-right: 35px;
}
</style>
