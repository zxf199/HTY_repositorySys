<template>
  <div>
    <div class="parts-search">
      <h4>申请列表</h4>
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
    :data="tableData"
    border
    ref="multiple"
    @selection-change="handleSelChange"
    style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="收货单位"
        prop="consignee">
      </el-table-column>
      <el-table-column
        label="收货地址"
        prop="address">
      </el-table-column>
      <el-table-column
        label="单号"
        prop="num">
      </el-table-column>
      <el-table-column
        label="申请人"
        prop="uName">
      </el-table-column>
      <el-table-column
        label="审核人"
        prop="passUName">
      </el-table-column>
      <el-table-column
        label="审核意见"
        prop="passExt">
      </el-table-column>
      <el-table-column
        label="申请备注"
        prop="soExt">
      </el-table-column>
      <el-table-column
        label="收货人"
        prop="consigner">
      </el-table-column>
      <el-table-column
        label="申请日期"
        prop="startDate">
      </el-table-column>
      <el-table-column
        label="出库时间"
        prop="outDate">
      </el-table-column>
      <el-table-column
        label="状态"
        prop="soStatus">
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
        currentPage: 1
      },
      hasData: true
    }
  },
  methods: {
    getTableData () {
      this.$axios.post('/api/medi/getStockOutList', this.searchForm).then(res => {
        console.log(res)
      })
    },
    onSubmit () {
      console.log(123)
    },
    handleSelChange (val) {
      this.multiple = val
    },
    handleCurrentChange (val) {
      this.searchForm.currentPage = val
    },
    handleSizeChange (val) {
      this.searchForm.pageSize = val
    }
  },
  mounted () {
    this.getTableData()
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
