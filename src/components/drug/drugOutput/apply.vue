<template>
  <div>
    <div class="parts-search">
      <h4>药品列表</h4>
      <el-form :inline="true" :model="searchForm" class="searchForm">
        <el-form-item label="名称">
          <el-input type="text" v-model="searchForm.dName" placeholder="请输入名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="有效期">
          <el-form-item>
            <el-date-picker type="date" size="small" placeholder="选择日期" v-model="searchForm.dValidate" style="width:100%;"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="item">
        <el-badge :value="applyData" :max="10" :type="applyType">
          <el-button size="small" type="primary" :disabled="isNoData" @click="applyDialog = true">申请单</el-button>
        </el-badge>
      </div>
    </div>
    <el-table
    :data="tableData"
    ref="prodcutTable"
    @select="handleSelChange"
    border
    style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="药品名称">
      </el-table-column>
      <el-table-column
        prop="num"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="cName"
        label="厂家">
      </el-table-column>
      <el-table-column
        prop="endDate"
        label="最早过期时间">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page="searchForm.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        @size-change="changeSize"
        @current-change="changeCurrent"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="申请单"
      :visible.sync="applyDialog"
      width="51%"
      center>
      <div>
        <el-form :inline="true" :model="applyForm" ref="applyForm">
          <div v-for="(item,index) in applyForm.items" :key="index">
            <el-form-item label="名称:">
              <el-input type="text" v-model="item.pName" placeholder="请输入名称" readonly></el-input>
            </el-form-item>
            <el-form-item label="批次:" :prop="'items.' + index + '.pNum'" :rules="{required: true, message: '批次不能为空', trigger: 'change'}">
              <el-autocomplete
              popper-class="my-autocomplete"
              :fetch-suggestions="item.queryStr"
              v-model='item.pNum'
              placeholder="请选择批次"
               @select="item.select">
                <template slot-scope="{ item }">
                  <div class="name">批号:{{item.pNum}}</div>
                  <div class="addr">库存:{{item.lastNum}}</div>
                  <div class="addr">过期时间:{{item.endDate}}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="数量:" :prop="'items.' + index + '.num'" :rules="{required: true, message: '采购单价不能为空', trigger: 'blur'}">
              <el-input type="text" v-model="item.num" placeholder="请输入数量"></el-input>
            </el-form-item>
            <el-form-item label="单价:" :prop="'items.' + index + '.price'" :rules="{required: true, message: '采购单价不能为空', trigger: 'blur'}">
              <el-input type="text" v-model="item.price" placeholder="请输入单价"></el-input>
            </el-form-item>
            <el-form-item label="过期时间:">
              <el-form-item required>
                <el-date-picker type="date" placeholder="过期时间" v-model="item.endDate" style="width:100%;" readonly value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-form-item>
          </div>
          <hr>
          <el-form-item label="单号:" prop="num" :rules="[{ required: true, message: '请输入单号', trigger: 'blur' }]">
            <el-input type="text" v-model="applyForm.num" placeholder="请输入单号"></el-input>
          </el-form-item>
          <el-form-item label="收货人:" prop="consigner" :rules="[{ required: true, message: '请输入收货人', trigger: 'blur' }]">
            <el-input type="text" v-model="applyForm.consigner" placeholder="请输入收货人"></el-input>
          </el-form-item>
          <el-form-item label="出库时间:" required>
            <el-form-item prop="outDate" :rules="[{ required: true, message: '请选择出库时间', trigger: 'change'}]">
              <el-date-picker type="date" placeholder="出库时间" v-model="applyForm.outDate" style="width:100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="收货单位:" prop="consignee" :rules="[{ required: true, message: '请输入收货单位', trigger: 'blur' }]">
            <el-input type="textarea" v-model="applyForm.consignee" placeholder="请输入收货单位"></el-input>
          </el-form-item>
          <el-form-item label="收货地址:" prop="address" :rules="[{ required: true, message: '请输入收货地址', trigger: 'blur' }]">
            <el-input type="textarea" v-model="applyForm.address" placeholder="请输入收货地址"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input type="textarea" v-model="applyForm.soExt" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('applyForm')">提交</el-button>
        <el-button @click="applyDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'drugInput',
  data () {
    return {
      searchForm: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      isNoData: true,
      applyType: 'info',
      applyData: 0,
      applyDialog: false,
      applyList: [],
      applyListInfo: [],
      tableData: [],
      applyForm: {
        consignee: '', // 收货单位
        address: '', // 收货地址
        num: '', // 单号
        uId: '',
        consigner: '', // 收货人
        outDate: '', // 出库时间,
        soExt: '',
        items: [{
          pId: '',
          pName: '',
          num: '',
          price: '',
          pNum: '',
          endDate: ''
        }]
      }
    }
  },
  watch: {
    applyList: function () {
      this.applyData = this.applyList.length
      if (this.applyList.length) {
        this.isNoData = false
        this.applyType = 'danger'
      } else {
        this.isNoData = true
        this.applyType = 'info'
      }
      if (this.applyList.length) {
        let list = []
        for (let i = 0; i < this.applyList.length; i++) {
          let obj = {pNum: '', lastNum: '', endDate: '', queryStr: (str, cb) => { this.queryStr(i, str, cb) }, select: val => { this.handleSelect(i, val) }}
          obj.batchs = []
          obj.pName = this.applyList[i].pName
          obj.id = this.applyList[i].id
          list.push(obj)
        }
        this.applyForm.items = list
      }
    }
  },
  methods: {
    getTableData (resolve) {
      this.$axios.post('/api/medi/getProductStoreList', this.searchForm).then(res => {
        if (res.data.items.length) {
          this.tableData = res.data.items
          this.total = res.data.totalNum
          resolve(this.applyList)
        }
      })
    },
    changeSize (val) {
      this.searchForm.pageSize = val
      this.hasSelectedRow()
    },
    changeCurrent (val) {
      this.searchForm.currentPage = val
      this.hasSelectedRow()
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.applyForm)
          data.uId = JSON.parse(localStorage.userInfo).uId
          data.items.forEach(item => {
            delete item.batchs
            item.pId = item.id
            delete item.id
          })
          this.$axios.post('/api/medi/createStockOut', data).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: res.data.data
              })
              this.applyDialog = false
            }
          })
        } else {
          console.log('提交失败')
        }
      })
    },
    onSubmit () {
      console.log(123)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    filterRow (row) {
      this.applyList.forEach((item, index) => {
        if (item.id === row.id) {
          this.applyList.splice(index, 1)
        }
      })
    },
    handleSelChange (val, row) {
      if (val.length) {
        val.forEach(item => {
          if (item.id === row.id) {
            this.applyList.push(row)
          } else {
            this.filterRow(row)
          }
        })
      } else {
        this.filterRow(row)
      }
    },
    hasSelectedRow () {
      let getData = new Promise((resolve, reject) => {
        this.getTableData(resolve)
      })
      getData.then(res => {
        if (res.length) {
          this.$nextTick(() => {
            res.forEach(item => {
              this.tableData.forEach((row, index) => {
                if (row.id === item.id) {
                  this.$refs['prodcutTable'].toggleRowSelection(this.tableData[index], true)
                }
              })
            })
          })
        }
      })
    },
    queryStr (index, str, cb) {
      let id = this.applyForm.items[index].id
      let getBatchs = new Promise((resolve, reject) => {
        this.$axios.post('/api/medi/getProductOutItemByPId', {pId: id}).then(res => {
          resolve(res)
        })
      })
      getBatchs.then(res => {
        res.data.data.forEach(item => {
          item.endDate = item.endDate.split(' ')[0]
        })
        this.applyForm.items[index].batchs = res.data.data
        let batchs = this.applyForm.items[index].batchs
        let results = str ? batchs.filter(this.createFilter(str)) : batchs
        cb(results)
      })
    },
    createFilter (queryString) {
      return (batch) => {
        return (batch.pNum.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (index, val) {
      this.applyForm.items[index].pNum = val.pNum
      this.applyForm.items[index].endDate = val.endDate
    }
  },
  mounted () {
    this.hasSelectedRow()
  }
}
</script>
<style scoped>
.item {
  flex: 0 0 15%;
  text-align: center;
  margin-top: 9px;
}
.isNoData {
  background: #ccc;
}
.hasData {
  background: #67C23A;
}
.my-autocomplete li{
  line-height: normal;
    padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}

.my-autocomplete li .highlighted .addr {
  color: #ddd;
}
</style>
