<template>
  <div>
    <div>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addAllInfo">录入资料</el-button>
    </div>
    <div class="parts-search">
      <h4>产品信息</h4>
      <el-form :inline="true" :model="searchForm" class="searchForm">
        <el-form-item label="名称">
          <el-input type="text" v-model="searchForm.pName" placeholder="请输入名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="厂家">
          <el-select v-model="searchForm.cId" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.cId"
              :label="item.cName"
              :value="item.cId">
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
    style="width: 100%">
      <el-table-column
        prop="pName"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="pSpec"
        label="规格">
      </el-table-column>
      <el-table-column
        prop="pPack"
        label="包装规格">
      </el-table-column>
      <el-table-column
        prop="pType"
        label="类别">
      </el-table-column>
      <el-table-column
        prop="cName"
        label="供货方/厂家">
      </el-table-column>
      <el-table-column
        prop="pLicense"
        label="生产许可证号">
      </el-table-column>
      <el-table-column
        prop="cNumber"
        label="厂家/注册证号">
      </el-table-column>
      <el-table-column
        prop="pStatus"
        label="状态">
      </el-table-column>
      <el-table-column
      label="操作"
      width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editInfo(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page="searchForm.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.pageSize"
        @size-change="changeSize"
        @current-change="changeCurrent"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="产品资料"
      :visible.sync="applyDialog"
      width="40%"
      top="5vh"
      @closed="closeDialog"
      center>
      <div>
        <el-tabs v-model="currentName" type="card" @tab-click="currentTabs">
          <el-tab-pane label="基本信息" name="baseInfo" :disabled="noBase[0]">
            <el-form :model="baseInfo" :rules="baseRules" ref="baseInfo" label-width="120px">
              <el-form-item label="产品名称" prop="pName">
                <el-input v-model="baseInfo.pName"></el-input>
              </el-form-item>
              <el-form-item label="规格" prop="pSpec">
                <el-input v-model="baseInfo.pSpec"></el-input>
              </el-form-item>
              <el-form-item label="包装规格" prop="pPack">
                <el-input v-model="baseInfo.pPack"></el-input>
              </el-form-item>
              <el-form-item label="类别" prop="pType">
                <el-input v-model="baseInfo.pType"></el-input>
              </el-form-item>
              <el-form-item label="供货方/厂家" prop="cId">
                <el-select v-model="baseInfo.cId" filterable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.cId"
                    :label="item.cName"
                    :value="item.cId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产许可证" prop="pLicense">
                <el-input v-model="baseInfo.pLicense"></el-input>
              </el-form-item>
              <el-form-item label="厂家/注册证号" prop="cNumber">
                <el-input v-model="baseInfo.cNumber"></el-input>
              </el-form-item>
              <el-form-item label="是否可用">
                <el-switch v-model="baseInfo.pStatus"></el-switch>
              </el-form-item>
              <el-form-item class="isCenter">
                <el-button type="primary" @click="subInfo('baseInfo',baseInfo,1)">提交</el-button>
                <el-button @click="applyDialog=false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="证书" name="cardInfo" class="defaultHeight" :disabled="noBase[1]">
            <el-form :inline="true" :model="cardInfo" ref="cardInfo">
              <div v-for="(item,index) in cardInfo.dataInfo" :key="index">
                <el-form-item label="名称" :prop="'dataInfo.'+index+'.pdName'" :rules="{required: true,message: '名称不能为空', trigger: 'blur'}">
                  <el-input v-model="item.pdName"></el-input>
                </el-form-item>
                <el-form-item label="有效期" required>
                  <el-form-item :prop="'dataInfo.'+index+'.endDate'" :rules="{required: true, message: '有效期不能为空', trigger: 'change'}">
                    <el-date-picker type="date" placeholder="选择日期" v-model="item.endDate" style="width:100%;"></el-date-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="图片" :prop="'dataInfo.'+index+'.pdPhoto'" :rules="{required: true,message: '图片不能为空', trigger: 'blur'}">
                  <el-upload
                    ref="pd-photo"
                    :action="upUrl"
                    :data="token"
                    multiple
                    :file-list="item.photos"
                    list-type="picture-card"
                    :on-success="uploadSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <div @click="upIndex=index"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <el-dialog :visible.sync="viewImg" append-to-body>
                    <img width="100%" :src="viewImgUrl">
                  </el-dialog>
                  <el-input v-model="item.pdPhoto" v-show="false"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="备注" prop="pdExt">
                  <el-input type="textarea" v-model="item.pdExt"></el-input>
                </el-form-item>
                <el-button type="danger" small class="isDelete" @click="deleteData(cardInfo.dataInfo,index)" v-if="overShow(index)">删除</el-button>
              </div>
              <el-form-item class="isCenter" v-if="cardInfo.dataInfo.length">
                <el-button type="primary" @click="subInfo('cardInfo',cardInfo.dataInfo,2)">提交</el-button>
                <el-button @click="applyDialog=false">取消</el-button>
              </el-form-item>
            </el-form>
            <el-button circle icon="el-icon-plus" type="success" class="addBtn" @click="addInfo"></el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'productInfo',
  data () {
    return {
      searchForm: {
        pName: '',
        cId: '',
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      applyDialog: false,
      upUrl: 'http://upload-z2.qiniup.com',
      token: {
        token: 'y9w95CXDnMcbv66ZJdZLkymjXTqgpRUHzR8X564f:NXhu6AWxiFpOppzD0eoY6ZYxDOE=:eyJzY29wZSI6ImJ1Y2tldGltZyIsImRlYWRsaW5lIjoxNTQ1ODgzODUxMjM0MjN9'
      },
      options: [],
      currentName: 'baseInfo',
      baseInfo: {
        pName: '',
        pSpec: '',
        pPack: '',
        pType: '',
        cId: '',
        pLicense: '',
        cNumber: '',
        pStatus: true
      },
      baseRules: {
        pName: [
          {required: true, message: '产品名称不能为空', trigger: 'blur'},
          {min: 2, max: 20, message: '产品名称长度只能为2至20个字符', trigger: 'blur'}
        ],
        pSpec: [
          {required: true, message: '规格不能为空', trigger: 'blur'},
          {min: 2, max: 20, message: '规格长度只能为2至20个字符', trigger: 'blur'}
        ],
        pPack: [
          {required: true, message: '包装规格不能为空', trigger: 'blur'},
          {min: 2, max: 20, message: '包装规格长度只能为2至20个字符', trigger: 'blur'}
        ],
        pType: [
          {required: true, message: '类别不能为空', trigger: 'blur'},
          {min: 2, max: 20, message: '类别长度只能为2至20个字符', trigger: 'blur'}
        ],
        cId: [
          {required: true, message: '供货方不能为空', trigger: 'change'}
        ],
        pLicense: [
          {required: true, message: '生产许可证不能为空', trigger: 'blur'},
          {min: 2, max: 20, message: '生产许可证长度只能为2至20个字符', trigger: 'blur'}
        ],
        cNumber: [
          {required: true, message: '注册证号不能为空', trigger: 'blur'},
          {min: 2, max: 20, message: '注册证号长度只能为2至20个字符', trigger: 'blur'}
        ]
      },
      cId: '',
      noBase: [false, true],
      cardInfo: {
        dataInfo: [
          {
            pdName: '营业执照',
            endDate: '',
            pdPhoto: '',
            photos: [],
            pdExt: ''
          },
          {
            pdName: '质量标准',
            endDate: '',
            pdPhoto: '',
            photos: [],
            pdExt: ''
          },
          {
            pdName: '检验报告',
            endDate: '',
            pdPhoto: '',
            photos: [],
            pdExt: ''
          }
        ]
      },
      compactInfo: [],
      isEdit: false,
      viewImg: false,
      viewImgUrl: '',
      upIndex: 0,
      tableData: []
    }
  },
  methods: {
    subInfo (formName, info, index) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.subDataInfo(info, index).then((msg) => {
            if (msg) {
              this.$message.error(msg)
            } else {
              if (!this.isEdit) {
                if (index === 1) {
                  this.currentName = 'cardInfo'
                  this.noBase = [true, false]
                }
                if (index === 2) {
                  this.currentName = 'baseInfo'
                  this.noBase = [false, true]
                  this.applyDialog = false
                }
              }
              this.$refs[formName].resetFields()
            }
          })
        } else {
          console.log('提交失败')
        }
      })
    },
    async subDataInfo (info, index) {
      let url = ''
      if (index === 1) {
        url = this.isEdit ? '/api/medi/updateProduct' : '/api/medi/insertProduct'
        if (info.pStatus) info.pStatus = 1
        else info.pStatus = 2
      } else {
        url = this.isEdit ? '/api/medi/updateProductDate' : '/api/medi/insertProductData'
        info.forEach(item => {
          item.pId = this.cId
        })
      }
      let msg = await this.$axios.post(url, info).then(res => {
        if (res.data.code === 200) {
          if (index === 1) this.cId = res.data.data.id
          if (index === 2) {
            this.$refs['pd-photo'].forEach(item => {
              item.clearFiles()
            })
          }
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          return false
        } else {
          return res.data.msg
        }
      })
      return msg
    },
    onSubmit () {
      this.reqTableData()
    },
    createImg (fileList) {
      let list = []
      try {
        fileList.forEach(item => {
          let {response: {key}} = item
          list.push(key)
        })
        this.cardInfo.dataInfo[this.upIndex].pdPhoto = list.join(',')
      } catch (err) {
        console.log(err)
      }
    },
    handleRemove (file, fileList) {
      this.createImg(fileList)
    },
    uploadSuccess (res, file, fileList) {
      this.createImg(fileList)
    },
    handlePictureCardPreview (file) {
      this.viewImgUrl = file.url
      this.viewImg = true
    },
    showApply () {
      this.applyDialog = true
    },
    addAllInfo () {
      this.applyDialog = true
      this.isEdit = false
      this.noBase = [false, true]
    },
    overShow (index) {
      if (index >= 3) return true
      else return false
    },
    addInfo () {
      this.cardInfo.dataInfo.push({
        pdName: '',
        endDate: '',
        pdPhoto: '',
        photos: [],
        pdExt: ''
      })
    },
    deleteData (info, index) {
      if (this.isEdit) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          info.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          console.log(1)
        })
      } else info.splice(index, 1)
    },
    reqTableData (data = this.searchForm) {
      this.$axios.post('/api/medi/getProductList', data).then(res => {
        if (res.data.items && res.data.items.length) {
          let data = res.data.items
          data.forEach(item => {
            item.pStatus = item.pStatus === 1 ? '可用' : '禁用'
          })
          this.total = res.data.totalNum
          this.tableData = data
        }
      })
    },
    changeSize (val) {
      this.searchForm.pageSize = val
      this.reqTableData()
    },
    changeCurrent (val) {
      this.searchForm.currentPage = val
      this.reqTableData()
    },
    closeDialog () {
      this.currentName = 'baseInfo'
      this.$refs[this.currentName].resetFields()
    },
    currentTabs (val) {
      this.currentName = val.name
      if (val.name === 'cardInfo') {
        this.getCardInfo(this.cId)
      } else {
        this.getBaseInfo(this.cId)
      }
    },
    editInfo (row) {
      this.applyDialog = true
      this.isEdit = true
      this.noBase = [false, false]
      this.getBaseInfo(row)
      this.cId = row.id
    },
    getBaseInfo (row) {
      this.$axios.post('/api/medi/getProductById', {id: row.id}).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          if (data.pStatus === 1) data.pStatus = true
          else data.pStatus = false
          this.baseInfo = data
        }
      })
    },
    getCardInfo (id) {
      this.$axios.post('/api/medi/getProductDataById', {id: id}).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          data.forEach((item, i) => {
            item.photos = []
            if (item.pdPhoto.indexOf(',') === -1) {
              item.photos.push({url: this.$img + item.pdPhoto, name: i})
            } else {
              let imgList = item.pdPhoto.split(',')
              for (let j = 0; j < imgList.length; j++) {
                let img = {name: '', url: ''}
                img.url = this.$img + imgList[j]
                img.name = i + '' + j
                item.photos.push(img)
              }
            }
          })
          this.cardInfo.dataInfo = data
          this.$nextTick(() => {
            let deletes = [...document.querySelectorAll('span i.el-icon-delete')]
            deletes.forEach(item => {
              item.style.display = 'none'
            })
          })
        }
      })
    }
  },
  mounted () {
    this.options = this.$store.getters.getCustomerInfo
    this.reqTableData()
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
.isCenter {
  width: 100%;
  text-align: center;
}
.addBtn {
  position: fixed;
  right: 38%;
  bottom: 30%;
}
.defaultHeight {
  min-height: 638px;
}
.isDelete {
  margin-left: 20%;
}
</style>
