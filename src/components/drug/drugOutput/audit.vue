<template>
  <div>
    <div class="parts-search">
      <h4>申请列表</h4>
      <!-- <el-form :inline="true" :model="searchForm">
        <el-form-item label="状态">
          <el-select v-model="searchForm.type" placeholder="请选择状态" size="small">
            <el-option label="待审核" value="1"></el-option>
            <el-option label="审核中" value="2"></el-option>
            <el-option label="已审核" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
        </el-form-item>
      </el-form> -->
      <div class="item">
        <el-badge :value="valueLength" :type="valueType">
          <el-button type="primary" :disabled="hasData" size="small" @click="audit">审核</el-button>
        </el-badge>
      </div>
    </div>
    <el-table
    :data="tableData"
    border
    ref="outPutTable"
    @select="selectRow"
    style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="num"
        label="单号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="uName"
        label="申请人">
      </el-table-column>
      <el-table-column
        prop="passUName"
        label="审核人">
      </el-table-column>
      <el-table-column
        prop="consigner"
        label="收货人">
      </el-table-column>
      <el-table-column
        prop="consignee"
        label="收货单位">
      </el-table-column>
      <el-table-column
        prop="address"
        label="收货地址">
      </el-table-column>
      <el-table-column
        prop="startDate"
        label="申请时间">
      </el-table-column>
      <el-table-column
        prop="soStatus"
        label="状态">
        <template slot-scope="scope">
          <el-button type="info" size="small">{{scope.row.soStatus === 1 ? '待审核':''}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="soExt"
        label="申请备注">
      </el-table-column>
      <!-- <el-table-column
        prop="passExt"
        label="审核备注">
      </el-table-column> -->
      <el-table-column
        prop="outDate"
        label="预计发货时间">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="auditDialog"
      top="35vh"
      width="25%">
      <div style="text-align:center;">
        <el-radio @change="setCommentsVal" v-model="commentsVal" label="2">通过</el-radio>
        <el-radio @change="setCommentsVal" v-model="commentsVal" label="4">驳回</el-radio>
        <el-radio @change="setCommentsVal" v-model="commentsVal" label="3">作废</el-radio>
      </div>
      <div style="margin-top: 20px;">
        审核意见:
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入审核意见"
          @change="setComments"
          v-model="comments">
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="auditDialog = false">取 消</el-button>
        <el-button type="primary" @click="subAudit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'audit',
  data () {
    return {
      tableData: [],
      total: 0,
      multiple: [],
      searchForm: {
        pageSize: 10,
        currentPage: 1,
        soStatus: 1
      },
      hasData: true,
      valueLength: 0,
      valueType: 'info',
      selectList: [],
      auditDialog: false,
      commentsVal: '2',
      comments: ''
    }
  },
  watch: {
    selectList: function () {
      this.valueLength = this.selectList.length
      if (this.valueLength) {
        this.valueType = 'danger'
        this.hasData = false
      } else {
        this.valueType = 'info'
        this.hasData = true
      }
    }
  },
  methods: {
    getTableData (resolve) {
      this.$axios.post('/api/medi/getStockOutList', this.searchForm).then(res => {
        if (res.data.items && res.data.items.length) {
          this.tableData = res.data.items
          this.total = res.data.totalNum
          resolve(this.selectList)
        } else {
          this.tableData = []
        }
      })
    },
    onSubmit () {
      console.log(123)
    },
    filterRow (row) {
      this.selectList.forEach((item, index) => {
        if (item.id === row.id) {
          this.selectList.splice(index, 1)
        }
      })
    },
    selectRow (selection, row) {
      if (selection.length) {
        selection.forEach((item, index) => {
          if (item.id === row.id) {
            this.selectList.push(row)
          } else {
            this.filterRow(row)
          }
        })
      } else {
        this.filterRow(row)
      }
    },
    hasSelectEdRow () {
      let getTableData = new Promise((resolve, reject) => {
        this.getTableData(resolve)
      })
      getTableData.then(res => {
        if (res.length) {
          res.forEach(item => {
            this.tableData.forEach((row, index) => {
              if (item.id === row.id) {
                this.$refs['outPutTable'].toggleRowSelection(this.tableData[index], true)
              }
            })
          })
        }
      })
    },
    handleCurrentChange (val) {
      this.searchForm.currentPage = val
      this.hasSelectEdRow()
    },
    handleSizeChange (val) {
      this.searchForm.pageSize = val
      this.hasSelectEdRow()
    },
    audit () {
      this.commentsVal = '2'
      this.comments = ''
      this.auditDialog = true
    },
    setCommentsVal (val) {
      this.commentsVal = val
    },
    setComments (val) {
      this.comments = val
    },
    subAudit () {
      let arr = []
      this.selectList.forEach(item => {
        let obj = {}
        obj.id = item.id
        obj.soStatus = this.commentsVal
        obj.passUId = JSON.parse(localStorage.userInfo).uId
        obj.passExt = this.comments
        arr.push(obj)
      })
      this.$axios.post('/api/medi/auditStockOut', arr).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: res.data.data
          })
          this.hasSelectEdRow()
          this.auditDialog = false
        }
      })
    }
  },
  mounted () {
    this.hasSelectEdRow()
  }
}
</script>
<style scoped>
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
.parts-search {
  height: 60px;
  display:flex;
  justify-content: space-between;
  padding: 10px 20px 0;
  border: 1px solid #EBEEF5;
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  box-sizing: border-box;
}
.item {
  flex: 0 0 15%;
  text-align: center;
  margin-top: 9px;
}
</style>
