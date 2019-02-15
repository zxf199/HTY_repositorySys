<template>
  <div>
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="macTypeDialog=true">添加机型</el-button>
    <el-dialog
      title="提示"
      :visible.sync="macTypeDialog"
      width="40%"
      top="5vh"
      center>
      <div class="macName">
        <span>机型名称:</span><el-input v-model="title[1]" placeholder="请输入机型名称" style="width: 25%;"></el-input>
      </div>
      <el-transfer
      style="display:inline-block;"
      v-model="value"
      @change="handleChange"
      :titles="title"
      :data="data">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="macTypeDialog=false">确 定</el-button>
        <el-button @click="macTypeDialog=false">取 消</el-button>
      </span>
    </el-dialog>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'partList',
  data () {
    const generateData = _ => {
      const data = []
      const parts = ['柜体', '屏幕', '主机', '驱动板', '24V电源', '12V电源', '插板4孔3插型',
        '电源线', '电子锁', '落物感应', 'USB延长线4帧', '弹簧', '马达', '卡盘', '履带', '断路器',
        '机身广告帖子', '天线、GPS线', '4G模组', '物联卡', 'HDMI线3m']
      parts.forEach((part, index) => {
        data.push({
          label: part,
          key: index
        })
      })
      return data
    }
    return {
      data: generateData(),
      value: [],
      title: ['零件列表'],
      macTypeDialog: false,
      tableData: []
    }
  },
  methods: {
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    }
  }
}
</script>
<style scoped>
.macName {
  margin-bottom: 15px;
}
.macName span {
  margin-right: 10px;
}
</style>
