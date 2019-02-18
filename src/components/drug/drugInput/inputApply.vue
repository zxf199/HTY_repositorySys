<template>
  <div>
    <el-dialog
    title="申请单"
    :visible.sync="inputDialog"
    width="52%"
    top="5vh">
      <el-form :model="drugForm" :inline="true" ref="drugForm">
        <el-form-item label="厂家:">
          <el-input v-model="drugForm.cName" readonly></el-input>
        </el-form-item>
        <el-form-item label="付款方:" prop="payer" :rules="{required: true, message: '付款方不能为空', trigger: 'blur'}">
          <el-input v-model="drugForm.payer" placeholder="请输入付款方信息"></el-input>
        </el-form-item>
        <el-form-item label="经办人:">
          <el-input v-model="drugForm.uName" readonly></el-input>
        </el-form-item>
        <div v-for="(item,index) in drugForm.item" :key="index">
          <hr>
          <el-form-item label="产品名称:">
            <el-input v-model="item.pName" readonly></el-input>
          </el-form-item>
          <el-form-item label="规格:">
            <el-input v-model="item.pSpec" readonly></el-input>
          </el-form-item>
          <el-form-item label="包装规格:">
            <el-input v-model="item.pPack" readonly></el-input>
          </el-form-item>
          <el-form-item label="采购单价:" :prop="'item.' + index + '.price'" :rules="{required: true, message: '采购单价不能为空', trigger: 'blur'}">
            <el-input v-model="item.price" placeholder="请输入采购单价" ref="price"></el-input>
          </el-form-item>
          <el-form-item label="数量:" :prop="'item.' + index + '.num'" :rules="{required: true, message: '数量不能为空', trigger: 'blur'}">
            <el-input v-model="item.num" placeholder="请输入数量" ref="num"></el-input>
          </el-form-item>
          <el-form-item label="采购总价:">
            <el-input v-model="item.total" readonly></el-input>
          </el-form-item>
          <el-form-item label="生产日期:" required>
            <el-form-item :prop="'item.' + index + '.startDate'"  :rules="{required: true, message: '生产日期不能为空', trigger: 'change'}">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期" v-model="item.startDate"></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="批号:" :prop="'item.' + index + '.pNum'" :rules="{required: true, message: '批号不能为空', trigger: 'blur'}">
            <el-input v-model="item.pNum" placeholder="请输入批号"></el-input>
          </el-form-item>
          <el-form-item label="有效期:" required>
            <el-form-item :prop="'item.' + index + '.endDate'" :rules="{required: true, message: '有效期不能为空', trigger: 'change'}">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期" v-model="item.endDate"></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="预警日期:" required>
            <el-form-item :prop="'item.' + index + '.warningDate'" :rules="{required: true, message: '预警日期不能为空', trigger: 'change'}">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期" v-model="item.warningDate"></el-date-picker>
            </el-form-item>
          </el-form-item>
        </div>
        <hr>
        <el-form-item label="是否有发票:">
            <el-switch v-model="drugForm.invoice"></el-switch>
        </el-form-item>
        <el-form-item label="发票:" v-if="drugForm.invoice"  prop="poPhoto" :rules="{required: true, message: '发票不能为空', trigger: 'blur'}">
        <el-upload
        :action="upUrl"
        :data="token"
        ref="poPhotos"
        multiple
        list-type="picture-card"
        :on-success="uploadSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-input v-model="drugForm.poPhoto" v-show="false"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" v-model="drugForm.poExt" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div align="center">
        <el-button type="primary" @click="subApply('drugForm')">提交</el-button>
        <el-button @click="inputDialog=false">取消</el-button>
      </div>
    </el-dialog>
    <div class="parts-search">
      <h4>药品列表</h4>
      <el-form :inline="true" :model="searchForm" class="searchForm">
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
      </el-form>
      <div class="item">
        <el-badge :value="applyData" :max="10" :type="applyType">
          <el-button size="small" type="primary" :disabled="isNoData" @click="showApply">申请单</el-button>
        </el-badge>
      </div>
    </div>
    <el-table
    :data="tableData"
    border
    ref="productTable"
    @select="selectChange"
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
        prop="pSpec"
        label="规格">
      </el-table-column>
      <el-table-column
        prop="pPack"
        label="包装规格">
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
import allCustomerData from '../../../common/getCustomerAll.js'
export default {
  name: 'inputApply',
  mixins: [allCustomerData],
  data () {
    return {
      searchForm: {
        pName: '',
        cId: '',
        currentPage: 1,
        pageSize: 10
      },
      upUrl: 'http://upload-z2.qiniup.com',
      token: {
        token: 'y9w95CXDnMcbv66ZJdZLkymjXTqgpRUHzR8X564f:NXhu6AWxiFpOppzD0eoY6ZYxDOE=:eyJzY29wZSI6ImJ1Y2tldGltZyIsImRlYWRsaW5lIjoxNTQ1ODgzODUxMjM0MjN9'
      },
      total: 0,
      options: [],
      drugForm: {
        cName: '',
        cId: '',
        payer: '',
        uName: '',
        uId: '',
        invoice: true,
        poPhoto: '',
        poExt: '',
        item: [{
          pId: '',
          pName: '',
          num: '',
          pSpec: '',
          pPack: '',
          price: '',
          total: '',
          startDate: '',
          pNum: '',
          endDate: '',
          warningDate: ''
        }]
      },
      inputFile: [],
      supList: [], // 供应商,
      factoryList: [], // 厂家,
      applyType: 'info',
      isNoData: true,
      applyData: 0,
      inputDialog: false,
      dialogImageUrl: '',
      dialogVisible: false,
      tableData: [],
      hasSelectData: []
    }
  },
  watch: {
    hasSelectData: function () {
      this.applyData = this.hasSelectData.length
      if (this.hasSelectData.length) {
        this.isNoData = false
        this.applyType = 'danger'
      } else {
        this.isNoData = true
        this.applyType = 'info'
      }
      this.mergeData(this.hasSelectData)
    }
  },
  methods: {
    getProductList (resolve) {
      this.$axios.post('/api/medi/getProductList', this.searchForm).then(res => {
        if (res.data.items && res.data.items.length) {
          this.tableData = res.data.items
          this.total = res.data.totalNum
          resolve(this.hasSelectData)
        }
      })
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
    changeSize (val) {
      this.searchForm.pageSize = val
      this.hasSelectedRow()
    },
    changeCurrent (val) {
      this.searchForm.currentPage = val
      this.hasSelectedRow()
    },
    subApply (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.drugForm)
          if (data.invoice) {
            data.invoice = 1
          } else {
            data.invoice = 2
            data.poPhoto = ''
          }
          this.filterPrice(data.item)
          this.$axios.post('/api/medi/insertProductOut', data).then(res => {
            if (res.data.msg === 'ok') {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.inputDialog = false
              if (this.$refs['poPhotos']) this.$refs['poPhotos'].clearFiles()
              this.$refs['productTable'].clearSelection()
              this.hasSelectData = []
            }
          })
        } else {
          console.log('提交失败')
        }
      })
    },
    filterPrice (data) {
      data.forEach(item => {
        item.price *= 100
        item.total *= 100
      })
    },
    onSubmit () {
      this.hasSelectedRow()
    },
    createImg (fileList) {
      let list = []
      try {
        fileList.forEach(item => {
          let {response: {key}} = item
          list.push(this.$img + key)
        })
        this.drugForm.poPhoto = list.join(',')
      } catch (err) {
        console.log(err)
      }
    },
    uploadSuccess (res, file, fileList) {
      this.createImg(fileList)
    },
    handleRemove (file, fileList) {
      this.createImg(fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    mergeData (list) {
      this.drugForm.item = []
      list.forEach((item, index) => {
        let obj = {pId: '', pName: '', num: '', pSpec: '', pPack: '', price: '', total: '', startDate: '', pNum: '', endDate: '', warningDate: ''}
        obj.pId = item.id
        for (let key in item) {
          if (obj.hasOwnProperty(key)) {
            obj[key] = item[key]
          }
        }
        this.drugForm.item.push(obj)
      })
    },
    filterRow (row) {
      this.hasSelectData.forEach((item, index) => {
        if (item.id === row.id) {
          this.hasSelectData.splice(index, 1)
        }
      })
    },
    selectChange (selection, row) {
      if (selection.length) {
        selection.forEach(item => {
          if (item.id === row.id) {
            this.hasSelectData.push(row)
          } else {
            this.filterRow(row)
          }
        })
      } else {
        this.filterRow(row)
      }
    },
    showApply () {
      if (this.$refs['drugForm']) this.$refs['drugForm'].clearValidate()
      this.drugForm.cId = this.searchForm.cId
      this.drugForm.cName = this.$refs.cName.selectedLabel
      this.drugForm.uId = JSON.parse(localStorage.userInfo).uId
      this.drugForm.uName = JSON.parse(localStorage.userInfo).uAlias
      this.inputDialog = true
      this.$nextTick(() => {
        this.bindChange()
      })
    },
    bindChange () {
      let prices = this.$refs['price']
      let nums = this.$refs['num']
      let price = {}
      let num = {}
      let _this = this
      for (let i = 0; i < prices.length; i++) {
        prices[i].$el.addEventListener('input', function () {
          price.value = this.firstElementChild.value
          price.key = i
          if (num.key === i && num.value && price.value) {
            _this.drugForm.item[i].total = parseFloat(price.value) * parseInt(num.value)
          } else {
            _this.drugForm.item[i].total = 0
          }
        })
        nums[i].$el.addEventListener('input', function () {
          num.value = this.firstElementChild.value
          num.key = i
          if (price.key === i && price.value && num.value) {
            _this.drugForm.item[i].total = parseFloat(price.value) * parseInt(num.value)
          } else {
            _this.drugForm.item[i].total = 0
          }
        })
      }
    }
  },
  mounted () {
    this.getCustomerAll()
  }
}
</script>
<style scoped>
.item {
  flex: 0 0 15%;
  text-align: center;
  margin-top: 9px;
}
</style>
