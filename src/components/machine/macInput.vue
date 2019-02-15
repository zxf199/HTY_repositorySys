<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="8">
        <!-- <h2 class="title">入库单</h2> -->
        <el-form :model="macForm" :rules="macRules" ref="macForm" label-width="85px">
          <el-form-item label="机器名称:" prop="eName">
            <el-input v-model="macForm.eName" placeholder="请输入机器名称"></el-input>
          </el-form-item>
          <el-form-item label="型号:" prop="eType">
            <el-select v-model="macForm.eType" placeholder="请选择机器型号">
              <el-option label="型号一" value="1"></el-option>
              <el-option label="型号二" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位:" prop="eUnit">
            <el-select v-model="macForm.eUnit" placeholder="请选择单位">
              <el-option label="台" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量:" prop="eNum">
            <el-input v-model="macForm.eNum" placeholder="请输入数量"></el-input>
          </el-form-item>
          <el-form-item label="成本单价:" prop="ePrice">
            <el-input v-model="macForm.ePrice" placeholder="请输入成本单价"></el-input>
          </el-form-item>
          <el-form-item label="成本总计:" prop="eTotal">
            <el-input v-model="macForm.eTotal" placeholder="请输入成本总计"></el-input>
          </el-form-item>
          <el-form-item label="入库日期:" required>
            <el-form-item prop="date">
              <el-date-picker type="date" placeholder="选择日期" v-model="macForm.date" style="width:100%;"></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="生产批次:" prop="eBatch">
            <el-input v-model="macForm.eBatch" placeholder="生产批次"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="macForm.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item class="sub-btn">
            <el-button type="primary" @click="submitForm('macForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'macInput',
  data () {
    return {
      macForm: {
        eName: '',
        eType: '',
        eUnit: '',
        eNum: '',
        ePrice: '',
        eTotal: '',
        eBatch: '',
        date: '',
        remark: ''
      },
      macRules: {
        eName: [
          { required: true, message: '请输入机器名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        eType: [
          { required: true, message: '请输入选择类型', trigger: 'change' }
        ],
        eUnit: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        eNum: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        ePrice: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        eTotal: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
        eBatch: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        date: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    subMitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resetForm(formName)
          console.log('提交成功')
        } else {
          console.log('提交失败')
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
