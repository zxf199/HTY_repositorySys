<template>
  <div>
    <div class="parts-search">
      <h4>申请列表</h4>
      <el-form :inline="true" :model="searchForm" class="searchForm">
        <el-form-item>
          <el-select v-model="searchForm.soStatus" placeholder="请选择" size="small">
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
    style="width: 100%">
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
        prop="soName"
        label="状态">
        <template slot-scope="scope">
          <el-button :type="scope.row.infoBg" size="small">{{scope.row.soName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="soExt"
        label="申请备注">
      </el-table-column>
      <el-table-column
        prop="passExt"
        label="审核备注">
      </el-table-column>
      <el-table-column
        prop="outDate"
        label="预计发货时间">
      </el-table-column>
      <el-table-column
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="viewDetail(scope.row)" type="text" size="small">详情</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination
      class="block"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="searchForm.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
    <el-dialog
      title="申请单"
      :visible.sync="detailVisible"
      width="51%"
      center>
      <el-form :model="detailForm" ref="detailForm" :inline="true">
        <div v-for="(item,index) in detailForm.items" :key="index">
          <el-form-item label="名称:">
            <el-input type="text" v-model="item.pName" placeholder="请输入名称" readonly></el-input>
          </el-form-item>
          <el-form-item label="批次:" :prop="'items.' + index + '.pNum'" :rules="{required: true, message: '批次不能为空', trigger: 'change'}">
            <el-input type="text" v-model="item.pNum" placeholder="请输入数量"></el-input>
            <!-- <el-autocomplete
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
            </el-autocomplete> -->
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
          <el-input type="text" v-model="detailForm.num" placeholder="请输入单号"></el-input>
        </el-form-item>
        <el-form-item label="收货人:" prop="consigner" :rules="[{ required: true, message: '请输入收货人', trigger: 'blur' }]">
          <el-input type="text" v-model="detailForm.consigner" placeholder="请输入收货人"></el-input>
        </el-form-item>
        <el-form-item label="出库时间:" required>
          <el-form-item prop="outDate" :rules="[{ required: true, message: '请选择出库时间', trigger: 'change'}]">
            <el-date-picker type="date" placeholder="出库时间" v-model="detailForm.outDate" style="width:100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="收货单位:" prop="consignee" :rules="[{ required: true, message: '请输入收货单位', trigger: 'blur' }]">
          <el-input type="textarea" v-model="detailForm.consignee" placeholder="请输入收货单位"></el-input>
        </el-form-item>
        <el-form-item label="收货地址:" prop="address" :rules="[{ required: true, message: '请输入收货地址', trigger: 'blur' }]">
          <el-input type="textarea" v-model="detailForm.address" placeholder="请输入收货地址"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" v-model="detailForm.soExt" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
        <el-button @click="detailVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'outputLog',
  data () {
    return {
      tableData: [],
      total: 0,
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        soStatus: ''
      },
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
      detailVisible: false,
      detailForm: {
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
  methods: {
    getTableData () {
      this.$axios.post('/api/medi/getStockOutList', this.searchForm).then(res => {
        if (res.data.items && res.data.items.length) {
          let items = res.data.items
          items.forEach(item => {
            if (item.soStatus === 1) {
              item.soName = '待审核'
              item.infoBg = 'info'
            } else if (item.soStatus === 2) {
              item.soName = '通过'
              item.infoBg = 'success'
            } else if (item.soSattus === 3) {
              item.soName = '作废'
              item.infoBg = 'danger'
            } else if (item.soSattus === 4) {
              item.soName = '驳回'
              item.infoBg = 'warning'
            }
          })
          this.tableData = items
          this.total = res.data.totalNum
        } else {
          this.tableData = []
        }
      })
    },
    handleSizeChange (val) {
      this.searchForm.pageSize = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.searchForm.currentPage = val
      this.getTableData()
    },
    viewDetail (rowData) {
      this.getItems(rowData)
    },
    getItems (rowData) {
      this.$axios.post('/api/medi/getStockOutItems', {id: rowData.id}).then(res => {
        for (let key in this.detailForm) {
          this.detailForm[key] = rowData[key]
        }
        if (res.data.data && res.data.data.length) {
          this.detailForm.items = res.data.data
        }
        this.detailVisible = true
      })
    },
    onSubmit () {
      this.getTableData()
    }
  },
  mounted () {
    this.getTableData()
  }
}
</script>
<style scoped>
</style>
