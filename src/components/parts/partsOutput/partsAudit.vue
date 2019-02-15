<template>
  <div>
    <div class="parts-search">
      <el-form :inline="true" :model="searchForm">
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
      </el-form>
      <div>
        <el-button type="success" :disabled="hasData">审核</el-button>
        <el-button type="warning" :disabled="hasData">驳回</el-button>
      </div>
    </div>
    <el-table
    :data="tableData5"
    border
    ref="multiple"
    @selection-change="handleSelChange"
    style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称:">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="型号:">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="数量:">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="单位:">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="采购单价:">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="采购总价:">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="供应商信息:">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="状态:">
              <span>{{ props.row.status }}</span>
            </el-form-item>
            <el-form-item label="备注:">
              <span>{{ props.row.category }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="id">
      </el-table-column>
      <el-table-column
        label="数量"
        prop="name">
      </el-table-column>
      <el-table-column
        label="采购单价"
        prop="desc">
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'partsAudit',
  data () {
    return {
      tableData5: [{
        id: '屏幕',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '2000',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '弹簧',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '150',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '扫码头',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '500',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '扫码头',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '500',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '扫码头',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '500',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '扫码头',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '500',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '扫码头',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '500',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '扫码头',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '500',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '扫码头',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '500',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '扫码头',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '500',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '扫码头',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '500',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }, {
        id: '扫码头',
        name: '2',
        category: '江浙小吃、小吃零食',
        desc: '500',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        status: '待审核'
      }],
      pageSize: '',
      total: '',
      currentPage: 1,
      multiple: [],
      searchForm: {
        type: ''
      },
      hasData: true
    }
  },
  methods: {
    onSubmit () {
      console.log(123)
    },
    handleSelChange (val) {
      this.multiple = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    handleSizeChange (val) {
      this.pageSize = val
    }
  },
  watch: {
    multiple: function (val) {
      if (val && val.length) {
        this.hasData = false
      } else {
        this.hasData = true
      }
    }
  },
  mounted () {
    this.total = this.tableData5.length
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
</style>
