<template>
  <el-container>
    <el-menu :collapse="isCollapse" background-color="#1f2438" text-color="#fff" :unique-opened="isUnique"  default-active="1">
      <h1 class="erp-name" v-if="!isCollapse">汇通云仓库管理系统</h1>
      <div v-else class="logo"><img src="../assets/logo.jpg" alt=""></div>
      <el-menu-item index="1" @click="goToLink('mainPage', ['首页'])">
        <i class="iconfont icon-zhuye"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="iconfont icon-shebei"></i>
          <span slot="title">机器</span>
        </template>
        <el-menu-item index="2-1" @click="goToLink('macInput', ['机器', '入库'])">入库</el-menu-item>
        <el-menu-item index="2-2" @click="goToLink('macOutput', ['机器', '出库'])">出库</el-menu-item>
        <!-- <el-menu-item index="2-3" @click="goToLink('macType', ['机器', '机型'])">机型</el-menu-item> -->
        <el-menu-item index="2-3" @click="goToLink('macList', ['机器', '机器列表'])">机器列表</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="iconfont icon-yaopin"></i>
          <span slot="title">药品</span>
        </template>
        <el-menu-item index="3-1" @click="goToLink('clientInfo', ['药品', '客户首营资料'])">客户首营资料</el-menu-item>
        <el-menu-item index="3-2" @click="goToLink('productInfo', ['药品', '供应商资料'])">产品首营资料</el-menu-item>
        <el-submenu index="3-3">
          <template slot="title">入库</template>
          <el-menu-item index="3-3-1" @click="goToLink('inputApply', ['药品', '入库', '申请'])">申请</el-menu-item>
          <el-menu-item index="3-3-2" @click="goToLink('checkApply', ['药品', '入库', '审核'])">审核</el-menu-item>
          <el-menu-item index="3-3-3" @click="goToLink('inputLog', ['药品', '入库', '申请记录'])">申请记录</el-menu-item>
        </el-submenu>
        <el-submenu index="3-4">
          <template slot="title">出库</template>
          <el-menu-item index="3-4-1" @click="goToLink('apply', ['药品', '出库', '申请'])">申请</el-menu-item>
          <el-menu-item index="3-4-2" @click="goToLink('audit', ['药品', '出库', '审核'])">审核</el-menu-item>
          <el-menu-item index="3-4-3" @click="goToLink('drugOutput', ['药品', '出库', '出库'])">出库</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="iconfont icon-lingjian"></i>
          <span slot="title">零件</span>
        </template>
        <el-submenu index="4-1">
          <template slot="title">入库</template>
          <el-menu-item index="4-2-1" @click="goToLink('partsApply', ['零件', '出库', '申请'])">申请</el-menu-item>
          <el-menu-item index="4-2-2" @click="goToLink('partsInput', ['零件', '入库', '入库'])">入库</el-menu-item>
        </el-submenu>
        <el-submenu index="4-2">
          <template slot="title">出库</template>
          <el-menu-item index="4-2-1" @click="goToLink('partsApply', ['零件', '出库', '申请'])">申请</el-menu-item>
          <el-menu-item index="4-2-2" @click="goToLink('partsAudit', ['零件', '出库', '审核'])">审核</el-menu-item>
          <el-menu-item index="4-2-3" @click="goToLink('partsOutput', ['零件', '出库', '出库'])">出库</el-menu-item>
          <el-menu-item index="4-2-4" @click="goToLink('partsAuditLog', ['零件', '出库', '审核记录'])">审核记录</el-menu-item>
        </el-submenu>
        <el-menu-item index="4-3" @click="goToLink('partList', ['零件', '机型'])">机型</el-menu-item>
        <el-menu-item index="4-4" @click="goToLink('staticData', ['零件', '统计'])">统计</el-menu-item>
      </el-submenu>
    </el-menu>
    <el-container>
      <el-header>
        <div class="main-header">
          <i :class="[isCollapse ?'icon-shu': 'icon-horizontal', isDefinde]" @click="fold"></i>
          <div class="main-right">
            <i class="iconfont icon-xiaoxi is-big"></i>
            <i class="iconfont icon-yonghu is-big"></i>
            <span class="user-name">{{uName}}</span>
            <i class="iconfont icon-tuichu is-big" @click="quit"></i>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in currentPage" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import '../assets/fonts/iconfont.css'
export default {
  name: 'index',
  data () {
    return {
      isCollapse: false,
      isUnique: true,
      isDefinde: 'iconfont isCollapse big-font',
      currentPage: ['首页'],
      uName: ''
    }
  },
  methods: {
    fold () {
      this.isCollapse = !this.isCollapse
    },
    quit () {
      this.$router.push({name: 'login'})
    },
    goToLink (url, title) {
      this.$router.push({name: url})
      this.currentPage = [...title]
    },
    getCustomerAll () {
      this.$axios.post('/api/medi/getCustomerAll').then(res => {
        if (res.data.data.length) {
          this.$store.dispatch('setCusInfo', res.data.data)
        }
      })
    }
  },
  mounted () {
    this.$router.push({name: 'mainPage'})
    this.getCustomerAll()
    this.uName = JSON.parse(localStorage.userInfo).uAlias
  }
}
</script>
<style scoped>
.el-container {
  height: 100%;
}
.el-aside {
  overflow: hidden;
}
.el-header {
  padding-right: 0;
}
.el-aside i.inconfont {
  color: #fff;
}
.erp-name {
  height: 60px;
  line-height: 65px;
  margin: 0;
  padding: 0;
  background: #2A3259;
  color: #fff;
  text-align:center;
  box-sizing: border-box;
  font-size: 20px;
}
.logo {
  height: 60px;
  text-align:center;
  background: #2A3259;
}
.logo img {
  height: 50px;
  width: 50px;
  margin-top: 9px;
  border-radius: 50%;
}
.el-menu {
  height: 100%;
  border-right: none;
}
.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.el-header {
  background: #e9eef1;
}
.big-font {
  font-size: 30px;
}
.main-header {
  height: 60px;
  line-height: 65px;
  display: flex;
  justify-content: space-between;
}
.main-right {
  display: flex;
  line-height: 65px;
}
.is-big {
  font-size: 25px;
  margin: 0 15px;
}
.user-name {
  display: inline-block;
  line-height: 65px;
}
.icon-yonghu {
  margin-right: 5px;
}
.el-breadcrumb {
  height: 30px;
}
</style>
