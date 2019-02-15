<template>
  <div>
    <div class="parts-search">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="零件名称">
          <el-input v-model="searchForm.pName" placeholder="零件名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="入库日期">
          <el-date-picker size="small" type="date" placeholder="选择日期" v-model="searchForm.date" style="width:100%;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
    :data="tableData3"
    style="width: 100%">
      <el-table-column
        prop="partsNo"
        label="物料编码"
        width="135">
      </el-table-column>
      <el-table-column
        prop="pName"
        label="材料名称"
        width="137">
      </el-table-column>
      <el-table-column label="期初仓库库存">
        <el-table-column
          prop="pNum"
          label="数量"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pPrice"
          label="价格"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pTotal"
          label="金额"
          width="75">
        </el-table-column>
      </el-table-column>
      <el-table-column label="本月采购入库">
        <el-table-column
          prop="pNum"
          label="数量"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pPrice"
          label="价格"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pTotal"
          label="金额"
          width="75">
        </el-table-column>
      </el-table-column>
      <el-table-column label="本月出库">
        <el-table-column
          prop="pNum"
          label="数量"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pPrice"
          label="价格"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pTotal"
          label="金额"
          width="75">
        </el-table-column>
      </el-table-column>
      <el-table-column label="本年采购入库">
        <el-table-column
          prop="pNum"
          label="数量"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pPrice"
          label="价格"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pTotal"
          label="金额"
          width="75">
        </el-table-column>
      </el-table-column>
      <el-table-column label="本年出库">
        <el-table-column
          prop="pNum"
          label="数量"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pPrice"
          label="价格"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pTotal"
          label="金额"
          width="75">
        </el-table-column>
      </el-table-column>
      <el-table-column label="月末库存">
        <el-table-column
          prop="pNum"
          label="数量"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pPrice"
          label="价格"
          width="75">
        </el-table-column>
        <el-table-column
          prop="pTotal"
          label="金额"
          width="75">
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'staticData',
  data () {
    return {
      searchForm: {
        pName: '',
        data: ''
      },
      tableData3: []
    }
  },
  methods: {
    onSubmit () {
      console.log(123)
    }
  }
}
</script>
<style scoped>
.parts-search {
  height: 50px;
  padding-top: 10px;
  text-align: center;
  border: 1px solid #EBEEF5;
  border-bottom: none;
  border-radius: 3px 3px 0 0;
}
</style>
