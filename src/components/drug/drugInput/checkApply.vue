<template>
  <div>
    <div class="parts-search">
      <h4>申请列表</h4>
      <!-- <el-form :inline="true" :model="searchForm" class="searchForm">
        <el-form-item label="厂家">
          <el-select v-model="searchForm.cId" filterable placeholder="请选择" ref="cName" size="small">
            <el-option
              v-for="item in options"
              :key="item.cId"
              :label="item.cName"
              :value="item.cId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input type="text" v-model="searchForm.pName" placeholder="请输入名称" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
        </el-form-item>
      </el-form> -->
      <div class="item">
        <el-badge :value="applyLen" :max="10" :type="applyType">
          <el-button size="small" type="primary" :disabled="isNoData" @click="showBox">审核</el-button>
        </el-badge>
      </div>
    </div>
    <el-table
    :data="tableData"
    border
    ref="productTable"
    @select="handleSelChange"
    style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="payer"
        label="付款方">
      </el-table-column>
      <el-table-column
        prop="uAlias"
        label="申请人">
      </el-table-column>
      <el-table-column
        prop="usAlias"
        label="审核人">
      </el-table-column>
       <el-table-column
        prop="invoice"
        width="100"
        label="有无发票">
      </el-table-column>
      <el-table-column
        prop="poPhoto"
        label="发票">
        <template slot-scope="scope">
          <div class="poPhoto" v-for="(item,index) in scope.row.poPhoto" :key="index">
            <img :src="item"/>
            <span>
              <i class="el-icon-zoom-in" @click="showBigImg(item)"></i>
            </span>
          </div>
          <el-dialog :visible.sync="viewBigImg" width="30%" top="5vh">
            <img width="100%" :src="bigImgSrc" alt="">
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column
        prop="poStatus"
        label="状态">
        <template slot-scope="scope">
          <el-button type="info" size="small">{{scope.row.poStatus}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="putDate"
        label="申请时间">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="changeSize"
        @current-change="changeCurrent"
        :current-page="searchForm.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import checkComment from '../../message/checkComment'
export default {
  name: 'checkApply',
  data () {
    return {
      searchForm: {
        pName: '',
        cId: '',
        currentPage: 1,
        pageSize: 10,
        poStatus: 1
      },
      total: 0,
      options: [],
      applyType: 'info',
      isNoData: true,
      applyLen: 0,
      applyData: [],
      tableData: [],
      viewBigImg: false,
      bigImgSrc: ''
    }
  },
  watch: {
    applyData: function () {
      this.applyLen = this.applyData.length
      if (this.applyData.length) {
        this.isNoData = false
        this.applyType = 'danger'
      } else {
        this.isNoData = true
        this.applyType = 'info'
      }
    }
  },
  methods: {
    getProductList (resolve) {
      this.$axios.post('/api/medi/getProductOutList', this.searchForm).then(res => {
        if (res.status === 200) {
          let data = res.data
          this.total = data.totalNum
          if (data.items && data.items.length) {
            data.items.forEach(item => {
              item.poPhoto = this.doImg(item.poPhoto)
              item.invoice = item.invoice === 1 ? '有' : '无'
              if (item.poStatus === 1) {
                item.poStatus = '待审核'
              }
            })
            this.tableData = data.items
          } else this.tableData = []
          resolve(this.applyData)
        }
      })
    },
    doImg (poPhoto) {
      const reg = /,/g
      let imgList = []
      if (poPhoto) {
        if (reg.test(poPhoto)) {
          imgList = poPhoto.split(',')
        } else imgList[0] = poPhoto
      } else imgList = []
      return imgList
    },
    changeSize (val) {
      this.searchForm.pageSize = val
      this.hasSelectedRow()
    },
    changeCurrent (val) {
      this.searchForm.currentPage = val
      this.hasSelectedRow()
    },
    onSubmit () {
      this.hasSelectedRow()
    },
    hasSelectedRow () {
      let getData = new Promise((resolve, reject) => {
        this.getProductList(resolve)
      })
      getData.then((res) => {
        if (res.length) {
          this.$nextTick(() => {
            res.forEach(row => {
              this.tableData.forEach((item, index) => {
                if (row.id === item.id) {
                  this.$refs['productTable'].toggleRowSelection(this.tableData[index], true)
                }
              })
            })
          })
        }
      })
    },
    handleSelChange (val, row) {
      if (val.length) {
        val.forEach(item => {
          if (item.id === row.id) {
            this.applyData.push(row)
          } else {
            this.filterRow(row)
          }
        })
      } else {
        this.filterRow(row)
      }
    },
    filterRow (row) {
      this.applyData.forEach((item, index) => {
        if (item.id === row.id) {
          this.applyData.splice(index, 1)
        }
      })
    },
    showBox () {
      const h = this.$createElement
      this.$msgbox({
        title: '审核',
        message: h(checkComment),
        showCancelButton: true,
        confirmButtonText: '提交',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.confirmCheck(done)
          } else {
            done()
          }
        }
      }).catch(() => {
        console.log('取消')
      })
    },
    confirmCheck (done) {
      let arr = []
      this.applyData.forEach(item => {
        let data = {}
        data.poStatus = sessionStorage.commentsVal
        data.poExt = sessionStorage.comments
        data.passUId = JSON.parse(localStorage.userInfo).uId
        data.id = item.id
        arr.push(data)
      })
      this.$axios.post('/api/medi/auditProductOut', arr).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '审核完成'
          })
          this.applyData = [] // 清空已选的申请单数据
          this.hasSelectedRow() // 刷新列表
          // sessionStorage.comments = '' // 清空备注
          // sessionStorage.commentsVal = 2 // 恢复审批状态
          done()
        } else {
          this.$message.error('参数有误')
        }
      })
    },
    showBigImg (item) {
      this.bigImgSrc = item
      this.viewBigImg = true
    }
  },
  mounted () {
    this.options = this.$store.getters.getCustomerInfo
    this.hasSelectedRow()
  }
}
</script>
<style scoped>
.parts-search {
  justify-content: space-between;
}
.item {
  flex: 0 0 15%;
  text-align: center;
  margin-top: 9px;
}
.poPhoto {
  height: 50px;
  width: 50px;
  display: inline-block;
  margin-right: 5px;
  position: relative;
}
.poPhoto img {
  height: 100%;
  width: 100%;
}
.poPhoto span {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
}
.poPhoto span:hover {
  opacity: 1;
  transition: all .3s linear;
  background: rgba(0,0,0,.4);
  border-radius: 3px;
}
.poPhoto span i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform:translate(-50%,-50%);
  font-size: 20px;
  color: #fff;
}
</style>
