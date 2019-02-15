<template>
  <div>
    <div>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addAllInfo">录入资料</el-button>
    </div>
    <div class="parts-search">
      <h4>客户信息</h4>
      <el-form :inline="true" :model="searchForm" class="searchForm">
        <el-form-item label="名称">
          <el-input type="text" v-model="searchForm.cName" placeholder="请输入名称" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
    :data="tableData"
    border
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    style="width: 100%">
      <el-table-column
        prop="cName"
        label="公司名称">
      </el-table-column>
      <el-table-column
        prop="cAddress"
        label="地址">
      </el-table-column>
      <el-table-column
        prop="corp"
        label="法人">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="成立时间">
      </el-table-column>
      <el-table-column
        prop="cCode"
        label="信用代码">
      </el-table-column>
      <el-table-column
        prop="cStatus"
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
      title="客户资料"
      :visible.sync="applyDialog"
      @close="closeDialog"
      width="40%"
      top="5vh"
      center>
      <div>
        <el-tabs v-model="currentName" type="card" @tab-click="currentSelTab">
          <el-tab-pane label="基本信息" name="baseInfo" :disabled="hasBase[0]">
            <el-form :model="baseInfo" :rules="baseRules" ref="baseInfo" label-width="100px">
              <el-form-item label="公司名称" prop="cName">
                <el-input v-model="baseInfo.cName"></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="cAddress">
                <el-input v-model="baseInfo.cAddress"></el-input>
              </el-form-item>
              <el-form-item label="法人" prop="corp">
                <el-input v-model="baseInfo.corp"></el-input>
              </el-form-item>
              <el-form-item label="成立时间" required>
                <el-form-item prop="createDate">
                  <el-date-picker type="date" placeholder="选择日期" v-model="baseInfo.createDate" style="width:100%;"></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item label="信用代码" prop="cCode">
                <el-input v-model="baseInfo.cCode"></el-input>
              </el-form-item>
              <el-form-item label="是否可用" prop="cStatus">
                <el-switch v-model="baseInfo.cStatus"></el-switch>
              </el-form-item>
              <el-form-item class="isCenter">
                <el-button type="primary" @click="subInfo('baseInfo',1)">提交</el-button>
                <el-button @click="cancelSub('baseInfo')">取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="资料" name="dataInfo" class="defaultHeight" :disabled="hasBase[1]">
            <el-form :inline="true" :model="dataInfo" ref="dataInfo">
              <div v-for="(item,index) in dataInfo.info" :key="index">
                <el-form-item label="名称" :prop="'info.'+index+'.cdName'" :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
                  <el-input v-model="item.cdName"></el-input>
                </el-form-item>
                <el-form-item label="有效期" required>
                  <el-form-item :prop="'info.'+index+'.endDate'" :rules="{required: true, message: '有效期不能为空', trigger: 'change'}">
                    <el-date-picker type="date" placeholder="选择日期" v-model="item.endDate" style="width:100%;"></el-date-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="图片" :prop="'info.'+index+'.cdPhoto'" :rules="{required: true, message: '图片不能为空', trigger: 'blur'}">
                  <el-upload
                    :action="upUrl"
                    :data="token"
                    ref="cd-photo"
                    multiple
                    :file-list="item.photos"
                    list-type="picture-card"
                    :on-success="dataInfoSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="removeDataImg">
                    <div @click="upIndex=index"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <el-dialog :visible.sync="viewImg" append-to-body>
                    <img width="100%" :src="viewImgUrl">
                  </el-dialog>
                  <el-input type="text" v-model="item.cdPhoto" v-show="false"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="备注">
                  <el-input type="textarea" v-model="item.cdExt"></el-input>
                </el-form-item>
                <el-button type="danger" small class="isDelete" @click="deleteData(dataInfo.info,index)" v-if="overShow(index)">删除</el-button>
                <hr>
              </div>
              <el-form-item class="isCenter">
                <el-button type="primary" @click="subInfo('dataInfo',2)">提交</el-button>
                <el-button @click="cancelSub('dataInfo')">取消</el-button>
              </el-form-item>
            </el-form>
            <el-button circle icon="el-icon-plus" type="success" class="addBtn" @click="addInfo(dataInfo.info,1)"></el-button>
          </el-tab-pane>
          <el-tab-pane label="合同" name="compactInfo" class="defaultHeight" :disabled="hasBase[2]">
            <el-form :inline="true" :model="compactInfo" ref="compactInfo">
              <div v-for="(item,index) in compactInfo.info" :key="index">
                <el-form-item label="名称" :prop="'info.'+index+'.cpName'" :rules="{required: true,message: '名称不能为空',trigger: 'blur'}">
                  <el-input v-model="item.cpName"></el-input>
                </el-form-item>
                <el-form-item label="起始日期" required>
                  <el-form-item :prop="'info.'+index+'.startDate'" :rules="{required: true,message: '起始日期不能为空',trigger: 'change'}">
                    <el-date-picker type="date" placeholder="选择日期" v-model="item.startDate" style="width:100%;"></el-date-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="有效期" required>
                  <el-form-item :prop="'info.'+index+'.endDate'" :rules="{required: true,message: '有效期不能为空',trigger: 'change'}">
                    <el-date-picker type="date" placeholder="选择日期" v-model="item.endDate" style="width:100%;"></el-date-picker>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="图片" :prop="'info.'+index+'.cpPhoto'" :rules="{required: true,message: '图片不能为空',trigger: 'blur'}">
                  <el-upload
                    list-type="picture-card"
                    :action="upUrl"
                    :data="token"
                    :file-list="item.photos"
                    multiple
                    ref="cp-photo"
                    :on-success="compactInfoSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="removeCompactImg">
                    <div @click="upIndex=index"><i class="el-icon-plus"></i></div>
                  </el-upload>
                  <el-dialog :visible.sync="viewImg" append-to-body>
                    <img width="100%" :src="viewImgUrl">
                  </el-dialog>
                  <el-input type="text" v-model="item.cpPhoto" v-show="false"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" v-model="item.cpExt"></el-input>
                </el-form-item>
                <el-button type="danger" small class="isDelete" @click="deleteData(compactInfo.info,index)">删除</el-button>
              </div>
              <el-form-item class="isCenter" v-if="compactInfo.info.length">
                <el-button type="primary" @click="subInfo('compactInfo',3)">提交</el-button>
                <el-button @click="cancelSub('compactInfo')">取消</el-button>
              </el-form-item>
            </el-form>
            <el-button circle icon="el-icon-plus" type="success" class="addBtn" @click="addInfo(compactInfo.info,2)"></el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'clientInfo',
  data () {
    return {
      searchForm: {
        cName: '',
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      applyDialog: false,
      currentName: 'baseInfo',
      cId: '',
      hasBase: [false, true, true],
      baseInfo: {
        cName: '',
        cAddress: '',
        corp: '',
        createDate: '',
        cCode: '',
        cStatus: true
      },
      baseRules: {
        cName: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ],
        cAddress: [
          { required: true, message: '公司地址不能为空', trigger: 'blur' },
          { min: 3, max: 45, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ],
        corp: [
          { required: true, message: '法人不能为空', trigger: 'blur' },
          { min: 3, max: 45, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ],
        cCode: [
          { required: true, message: '信用代码不能为空', trigger: 'blur' },
          { min: 3, max: 45, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ],
        createDate: [
          { required: true, message: '成立时间不能为空', trigger: 'change' }
        ]
      },
      dataInfo: {
        info: [{
          cId: '',
          cdName: '营业执照',
          cdPhoto: '',
          photos: [],
          endDate: '',
          cdExt: ''
        },
        {
          cId: '',
          cdName: '类别证书',
          cdPhoto: '',
          photos: [],
          endDate: '',
          cdExt: ''
        }]
      },
      compactInfo: {
        info: [{
          cId: '',
          cpName: '',
          startDate: '',
          endDate: '',
          cpPhoto: '',
          photos: [],
          cpExt: ''
        }]
      },
      upUrl: 'http://upload-z2.qiniup.com',
      token: {
        token: 'y9w95CXDnMcbv66ZJdZLkymjXTqgpRUHzR8X564f:NXhu6AWxiFpOppzD0eoY6ZYxDOE=:eyJzY29wZSI6ImJ1Y2tldGltZyIsImRlYWRsaW5lIjoxNTQ1ODgzODUxMjM0MjN9'
      },
      upIndex: 0,
      fileLists: [],
      isEdit: false,
      viewImg: false,
      viewImgUrl: '',
      tableData: [],
      loading: true
    }
  },
  methods: {
    subInfo (formName, index) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createCustomer(this[formName], index).then((msg) => {
            if (msg) {
              this.$message.error(msg.msg)
            } else {
              this.reqData()
              if (!this.isEdit) {
                if (index === 1) {
                  this.currentName = 'dataInfo'
                  this.hasBase = [true, false, true]
                }
                if (index === 2) {
                  this.currentName = 'compactInfo'
                  this.hasBase = [true, true, false]
                }
                if (index === 3) {
                  this.currentName = 'baseInfo'
                  this.applyDialog = false
                  this.hasBase = [false, true, true]
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
    async createCustomer (data, index) {
      let url = ''
      if (index === 1) {
        url = this.isEdit ? '/api/medi/updateCustomerById' : '/api/medi/createCustomer'
        if (data.cStatus) data.cStatus = 1
        else data.cStatus = 2
      } else if (index === 2) {
        url = this.isEdit ? '/api/medi/updateCustomerDataByCId' : '/api/medi/createCustomerData'
      } else {
        url = this.isEdit ? '/api/medi/updateCustomerPact' : '/api/medi/createCustomerPact'
      }
      if (data.info) {
        data = data.info
        data.forEach(item => {
          item.cId = this.cId
        })
      }
      let msg = await this.$axios.post(url, data).then(res => {
        if (res.data.code === 200) {
          if (index === 2 && !this.isEdit) {
            this.$refs['cd-photo'].forEach(item => {
              item.clearFiles()
            })
          }
          if (index === 3 && !this.isEdit) {
            this.$refs['cp-photo'].forEach(item => {
              item.clearFiles()
            })
          }
          if (res.data.data && res.data.data.cId) this.cId = res.data.data.cId
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          return false
        } else {
          return res.data
        }
      })
      return msg
    },
    cancelSub (formName) {
      this.$refs[formName].resetFields()
      this.applyDialog = false
      this.hasBase = true
      this.fileLists = []
    },
    closeDialog () {
      this.currentName = 'baseInfo'
      this.$refs[this.currentName].resetFields()
      this.hasBase = true
      this.fileLists = []
    },
    currentSelTab (val) {
      this.currentName = val.name
      if (this.isEdit) {
        if (val.name === 'dataInfo') {
          this.getDataInfo(this.cId)
        } else if (val.name === 'compactInfo') {
          this.getCompactInfo(this.cId)
        }
      }
    },
    changeSize (val) {
      this.searchForm.pageSize = val
      this.reqData()
    },
    changeCurrent (val) {
      this.searchForm.currentPage = val
      this.reqData()
    },
    onSubmit () {
      let data = this.searchForm
      if (data.cName) {
        delete data.currentPage
        this.reqData(data)
      } else {
        this.reqData()
      }
    },
    reqData (data = this.searchForm) {
      this.$axios.post('/api/medi/getCustomerList', data).then(res => {
        if (res.status === 200) {
          let data = res.data
          this.loading = false
          this.total = data.totalNum
          data.items.forEach(item => {
            item.cStatus = item.cStatus === 1 ? '可用' : '禁用'
          })
          this.tableData = data.items
        }
      })
    },
    createImg (data, fileList) {
      let list = []
      try {
        fileList.forEach(file => {
          if (file.response.key) {
            let {response: {key}} = file
            list.push(key)
          }
        })
        if (data.info[this.upIndex].hasOwnProperty('cdPhoto')) data.info[this.upIndex].cdPhoto = list.join(',')
        if (data.info[this.upIndex].hasOwnProperty('cpPhoto')) data.info[this.upIndex].cpPhoto = list.join(',')
      } catch (err) {
        console.log(err)
      }
    },
    removeDataImg (file, fileList) {
      this.filelists = fileList
      this.createImg(this.dataInfo, fileList)
    },
    removeCompactImg (file, fileList) {
      this.filelists = fileList
      this.createImg(this.compactInfo, fileList)
    },
    dataInfoSuccess (res, file, fileList) {
      this.filelists = fileList
      this.createImg(this.dataInfo, fileList)
    },
    compactInfoSuccess (res, file, fileList) {
      this.filelists = fileList
      this.createImg(this.compactInfo, fileList)
    },
    handlePictureCardPreview (file) {
      this.viewImgUrl = file.url
      this.viewImg = true
    },
    showApply () {
      this.applyDialog = true
    },
    handleSelect (index, val) {
      this.applyList[index].dBatch = val.val
    },
    addAllInfo () {
      this.applyDialog = true
      this.isEdit = false
      this.hasBase = [false, true, true]
    },
    overShow (index) {
      if (index >= 2) return true
      else return false
    },
    addInfo (info, index) {
      if (index === 1) {
        info.push({
          cId: '',
          cdName: '',
          cdPhoto: '',
          photos: [],
          endDate: '',
          cdExt: ''
        })
      } else {
        info.push({
          cId: '',
          cpName: '',
          startDate: '',
          endDate: '',
          cpPhoto: '',
          photos: [],
          cpExt: ''
        })
      }
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
    editInfo (row) {
      this.applyDialog = true
      this.isEdit = true
      this.hasBase = [false, false, false]
      this.getBaseInfo(row)
    },
    getBaseInfo (row) {
      this.$axios.post('/api/medi/getCustomerById', {id: row.cId}).then(res => {
        if (res.data.code === 200) {
          this.cId = row.cId
          this.baseInfo = res.data.data
          if (this.baseInfo.cStatus === 1) {
            this.baseInfo.cStatus = true
          } else {
            this.baseInfo.cStatus = false
          }
        }
      })
    },
    getDataInfo (cId) {
      this.$axios.post('/api/medi/getCustomerDataByCId', {id: cId}).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.length) {
            this.editClientInfo(res, 'cdPhoto', this.dataInfo)
          }
        }
      })
    },
    getCompactInfo (cId) {
      this.$axios.post('/api/medi/getCustomerPactByCId', {id: cId}).then(res => {
        if (res.data.code === 200) {
          this.editClientInfo(res, 'cpPhoto', this.compactInfo)
        }
      })
    },
    editClientInfo (res, photo, infos) {
      let info = res.data.data
      for (let i = 0; i < info.length; i++) {
        info[i].photos = []
        if (info[i][photo].indexOf(',') === -1) {
          info[i].photos.push({url: this.$img + info[i][photo], name: i})
        } else {
          let imgList = info[i][photo].split(',')
          for (let j = 0; j < imgList.length; j++) {
            let img = {name: '', url: ''}
            img.url = this.$img + imgList[j]
            img.name = i + '' + j
            info[i].photos.push(img)
          }
        }
      }
      infos.info = info
      this.$nextTick(() => {
        let deletes = [...document.querySelectorAll('span i.el-icon-delete')]
        deletes.forEach(item => {
          item.style.display = 'none'
        })
      })
    }
  },
  mounted () {
    this.reqData()
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
