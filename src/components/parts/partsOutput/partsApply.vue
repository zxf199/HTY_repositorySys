<template>
  <div>
    <el-dialog
    title="申请"
    :visible.sync="inputDialog"
    width="30%"
    top="5vh">
      <el-form :model="partsForm" :rules="partsRules" ref="partsForm" label-width="100px">
        <el-form-item label="零件名称:" prop="pName">
          <el-input v-model="partsForm.pName" placeholder="请输入零件名称"></el-input>
        </el-form-item>
        <el-form-item label="型号:" prop="pType">
          <el-select v-model="partsForm.pType" placeholder="请选择零件型号">
            <el-option label="型号一" value="1"></el-option>
            <el-option label="型号二" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位:" prop="pUnit">
          <el-select v-model="partsForm.pUnit" placeholder="请选择单位">
            <el-option label="台" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量:" prop="pNum">
          <el-input v-model="partsForm.pNum" placeholder="请输入数量"></el-input>
        </el-form-item>
        <el-form-item label="采购单价:" prop="pPrice">
          <el-input v-model="partsForm.pPrice" placeholder="请输入采购单价"></el-input>
        </el-form-item>
        <el-form-item label="采购总价:" prop="pTotal">
          <el-input v-model="partsForm.pTotal" placeholder="请输入采购总价"></el-input>
        </el-form-item>
        <el-form-item label="供应商信息:" prop="supInfo">
          <el-input type="textarea" v-model="partsForm.supInfo" placeholder="请输入供应商信息"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="partsForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item class="sub-btn">
          <el-button type="primary" @click="submitForm('partsForm')">提交</el-button>
          <el-button @click="inputDialog = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="inputDialog=true">申请</el-button>
    </div>
    <div class="parts-search">
      <h4>申请记录</h4>
    </div>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="零件名称">
              <span>{{ props.row.pName }}</span>
            </el-form-item>
            <el-form-item label="型号">
              <span>{{ props.row.pType }}</span>
            </el-form-item>
            <el-form-item label="单位">
              <span>{{ props.row.pUnit }}</span>
            </el-form-item>
            <el-form-item label="数量">
              <span>{{ props.row.pNum }}</span>
            </el-form-item>
            <el-form-item label="采购单价">
              <span>{{ props.row.pPrice }}</span>
            </el-form-item>
            <el-form-item label="采购总价">
              <span>{{ props.row.pTotal }}</span>
            </el-form-item>
            <el-form-item label="供应商信息">
              <span>{{ props.row.supInfo }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="pName"
        label="零件名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="pNum"
        label="数量"
        width="180">
      </el-table-column>
      <el-table-column
        prop="pPrice"
        label="采购单价">
      </el-table-column>
      <el-table-column
        prop="date"
        label="领料日期">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page="1"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'partsApply',
  data () {
    return {
      partsForm: {
        pName: '',
        pType: '',
        pUnit: '',
        pNum: '',
        pPrice: '',
        pTotal: '',
        supInfo: '',
        remark: ''
      },
      partsRules: {
        pName: [
          { required: true, message: '请输入零件名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        pType: [
          { required: true, message: '请输入选择类型', trigger: 'change' }
        ],
        pUnit: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        pNum: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        pPrice: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        pTotal: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        supInfo: [
          { required: true, message: '请输入供应商信息', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ]
      },
      inputDialog: false,
      tableData: [{
        pName: '屏幕',
        pType: '23423',
        pUnit: '块',
        pNum: 2,
        pPrice: 12,
        pTotal: 1323,
        supInfo: '深圳富士康',
        date: '2018-12-20 17:45',
        remark: '很好用'
      }]
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('提交成功')
        } else {
          console.log('提交失败')
        }
      })
    }
  }
}
</script>
<style scoped>
h4 {
  margin: 0;
  padding: 0;
}
.parts-search {
  height: 50px;
  padding: 14px 20px;
  margin-top: 30px;
  border: 1px solid #EBEEF5;
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  box-sizing: border-box;
}
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
</style>
