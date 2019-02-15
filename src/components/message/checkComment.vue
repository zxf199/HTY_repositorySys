<template>
  <div class="comments">
    <el-radio @change="setCommentsVal" v-model="commentsVal" label="2">通过</el-radio>
    <el-radio @change="setCommentsVal" v-model="commentsVal" label="4">驳回</el-radio>
    <el-radio @change="setCommentsVal" v-model="commentsVal" label="3">作废</el-radio>
    <div style="margin-top: 20px;">
      审核意见: <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入审核意见"
        @change="setComments"
        v-model="comments">
      </el-input>
    </div>
  </div>
</template>
<script>
export default {
  name: 'checkComment',
  data () {
    return {
      commentsVal: '2',
      comments: ''
    }
  },
  methods: {
    setCommentsVal (val) {
      sessionStorage.commentsVal = val
    },
    setComments (val) {
      sessionStorage.comments = val
    }
  },
  mounted () {
    sessionStorage.commentsVal = this.commentsVal
  }
}
</script>
<style>
.el-textarea {
  width: 80%;
  vertical-align: top;
}
.comments {
  text-align: center;
}
</style>
