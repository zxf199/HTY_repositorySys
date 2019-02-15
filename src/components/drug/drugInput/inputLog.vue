<template>
  <div>
    <div class="parts-search">
      <h4>申请记录</h4>
      <el-form :inline="true" :model="searchForm" class="searchForm">
        <el-form-item label="发票">
          <el-select v-model="searchForm.invoice " placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status " placeholder="请选择" size="small">
            <el-option
              v-for="item in status"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
    :data="tableData"
    border
    ref="productTable"
    style="width: 100%">
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
        prop="poPhotoList"
        label="发票">
        <template slot-scope="scope">
          <div class="poPhoto" v-for="(item, index) in scope.row.poPhotoList" :key="index">
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
        prop="poName"
        label="状态">
        <template slot-scope="scope">
          <el-button :type="scope.row.infoBg" size="small">{{scope.row.poName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="passExt"
        label="审核意见">
      </el-table-column>
      <el-table-column
        prop="putDate"
        label="申请时间">
      </el-table-column>
      <el-table-column
      label="操作"
      width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewDetail(scope.row)">详情</el-button>
        </template>
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
    <el-dialog
    title="申请单"
    :visible.sync="showDetail"
    width="52%"
    top="5vh">
      <el-form :model="drugForm" :inline="true" ref="drugForm">
        <el-form-item label="厂家:">
          <el-input v-model="drugForm.cName" readonly></el-input>
        </el-form-item>
        <el-form-item label="付款方:">
          <el-input v-model="drugForm.payer" readonly></el-input>
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
            <el-input v-model="item.price" ref="price"></el-input>
          </el-form-item>
          <el-form-item label="数量:" :prop="'item.' + index + '.num'" :rules="{required: true, message: '数量不能为空', trigger: 'blur'}">
            <el-input v-model="item.num" ref="num"></el-input>
          </el-form-item>
          <el-form-item label="采购总价:">
            <el-input v-model="item.total" readonly></el-input>
          </el-form-item>
          <el-form-item label="生产日期:">
            <el-form-item>
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="item.startDate" readonly></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="批号:">
            <el-input v-model="item.pNum" readonly></el-input>
          </el-form-item>
          <el-form-item label="有效期:">
            <el-form-item>
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="item.endDate" readonly></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="预警日期:">
            <el-form-item>
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"  type="date" readonly v-model="item.warningDate"></el-date-picker>
            </el-form-item>
          </el-form-item>
        </div>
        <hr>
        <el-form-item label="是否有发票:">
            <el-switch v-model="drugForm.invoice" :disabled="logStatus"></el-switch>
        </el-form-item>
        <el-form-item label="发票:" v-if="drugForm.invoice"  prop="poPhoto" :rules="{required: true, message: '发票不能为空', trigger: 'blur'}">
        <el-upload
        :action="upUrl"
        :data="token"
        ref="poPhotos"
        multiple
        list-type="picture-card"
        :file-list="poPhotos"
        :on-success="uploadSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="viewBigImage">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-input v-model="drugForm.poPhoto" v-show="false"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" v-model="drugForm.poExt" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div align="center" v-if="drugForm.poStatus===1||drugForm.poStatus===4">
        <el-button type="primary" @click="subEdited('drugForm')">提交</el-button>
        <el-button @click="showDetail=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'inputLog',
  data () {
    return {
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        invoice: null,
        status: null
      },
      upUrl: 'http://upload-z2.qiniup.com',
      token: {
        token: 'y9w95CXDnMcbv66ZJdZLkymjXTqgpRUHzR8X564f:NXhu6AWxiFpOppzD0eoY6ZYxDOE=:eyJzY29wZSI6ImJ1Y2tldGltZyIsImRlYWRsaW5lIjoxNTQ1ODgzODUxMjM0MjN9'
      },
      drugForm: {
        cName: '',
        cId: '',
        payer: '',
        uName: '',
        uId: '',
        invoice: true,
        poPhoto: '',
        poPhotoList: '',
        poExt: '',
        poStatus: '',
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
      showDetail: false,
      total: 0,
      tableData: [],
      options: [
        {
          key: 1,
          value: '有'
        },
        {
          key: 2,
          value: '无'
        }
      ],
      status: [{
        key: 1,
        value: '待审核'
      },
      {
        key: 2,
        value: '通过'
      },
      {
        key: 3,
        value: '作废'
      },
      {
        key: 4,
        value: '驳回'
      }],
      viewBigImg: false,
      viewBigImage: false,
      dialogImageUrl: '',
      poPhotos: [],
      bigImgSrc: '',
      logStatus: false
    }
  },
  methods: {
    getTableData () {
      this.$axios.post('/api/medi/getProductOutList', this.searchForm).then(res => {
        if (res.status === 200) {
          let data = res.data
          this.total = data.totalNum
          if (data.items && data.items.length) {
            data.items.forEach(item => {
              item.poPhotoList = this.doImg(item.poPhoto)
              item.invoice = item.invoice === 1 ? '有' : '无'
              if (item.poStatus === 1) {
                item.poName = '待审核'
                item.infoBg = 'info'
              } else if (item.poStatus === 2) {
                item.poName = '通过'
                item.infoBg = 'success'
              } else if (item.poStatus === 3) {
                item.poName = '作废'
                item.infoBg = 'danger'
              } else {
                item.poName = '驳回'
                item.infoBg = 'warning'
              }
            })
            this.tableData = data.items
          }
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
      this.getTableData()
    },
    changeCurrent (val) {
      this.searchForm.currentPage = val
      this.getTableData()
    },
    onSubmit () {
      this.getTableData()
    },
    viewDetail (row) {
      this.showDetail = true
      this.drugForm = Object.assign({}, this.drugForm, row)
      this.filterImg(this.drugForm.poPhotoList)
      if (this.drugForm.invoice === '有') this.drugForm.invoice = true
      else this.drugForm.invoice = false
      this.drugForm.uName = row.uAlias
      this.filterStatus(this.drugForm.poStatus)
      this.getDetailInfo(row.id).then((res) => {
        this.filterPrice(res)
        this.$nextTick(() => {
          if ((this.drugForm.poStatus === 3 || this.drugForm.poStatus === 2) && document.querySelector('.el-icon-delete')) document.querySelector('.el-icon-delete').style.display = 'none'
          this.bindChange(res)
        })
      })
    },
    async getDetailInfo (id) {
      let data = await this.$axios.post('/api/medi/getProductOutItemById', {id: id}).then(res => {
        if (res.data.code === 200) {
          this.drugForm.item = res.data.data
          return res.data.data
        }
      })
      return data
    },
    filterImg (poPhoto) {
      this.poPhotos = []
      if (poPhoto && poPhoto.length) {
        poPhoto.forEach((item, index) => {
          let obj = {}
          obj.name = index
          obj.url = item
          this.poPhotos.push(obj)
        })
      }
    },
    filterStatus (poStatus) {
      if (poStatus === 3 || poStatus === 2) this.logStatus = true
      else this.logStatus = false
    },
    filterPrice (data) {
      data.forEach(item => {
        item.price /= 100
        item.total /= 100
      })
    },
    filterData (res) {
      let price = []
      let num = []
      res.forEach((item, i) => {
        let obj = {}
        let obj1 = {}
        obj.key = i
        obj.value = item.price
        obj1.key = i
        obj1.value = item.num
        price.push(obj)
        num.push(obj1)
      })
      return {
        price,
        num
      }
    },
    bindChange (res) {
      let prices = this.$refs['price']
      let nums = this.$refs['num']
      let {price, num} = this.filterData(res)
      let _this = this
      for (let i = 0; i < prices.length; i++) {
        prices[i].$el.addEventListener('input', function () {
          price[i].value = this.firstElementChild.value
          if (num[i].key === i && num[i].value && price[i].value) {
            _this.drugForm.item[i].total = parseFloat(price[i].value) * parseInt(num[i].value)
          } else {
            _this.drugForm.item[i].total = 0
          }
        })
        nums[i].$el.addEventListener('input', function () {
          num[i].value = this.firstElementChild.value
          if (price[i].key === i && price[i].value && num[i].value) {
            _this.drugForm.item[i].total = parseFloat(price[i].value) * parseInt(num[i].value)
          } else {
            _this.drugForm.item[i].total = 0
          }
        })
      }
    },
    createImg (fileList) {
      let list = []
      try {
        fileList.forEach(item => {
          if (item.hasOwnProperty('response')) {
            let {response: {key}} = item
            list.push(this.$img + key)
          } else {
            list.push(item.url)
          }
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
      this.viewBigImage = true
    },
    subEdited (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.drugForm)
          if (data.invoice) data.invoice = 1
          else {
            data.invoice = 2
            data.poPhoto = ''
          }
          this.filterOverPrice(data.item)
          this.$axios.post('/api/medi/updateProductOut', data).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: res.data.data
              })
              this.showDetail = false
              this.getTableData()
            } else {
              this.$message.error('参数有误')
            }
          })
        }
      })
    },
    filterOverPrice (data) {
      data.forEach(item => {
        item.price *= 100
        item.total *= 100
      })
    },
    showBigImg (item) {
      this.bigImgSrc = item
      this.viewBigImg = true
    }
  },
  mounted () {
    this.searchForm.uId = JSON.parse(localStorage.userInfo).uId
    this.getTableData()
  }
}
</script>
<style scoped>
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
