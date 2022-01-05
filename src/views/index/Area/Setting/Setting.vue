<template>
  <el-page-header @back="goBack" />
    <el-tabs type="border-card" :style="defaultHeight">
      <el-tab-pane label="个人信息">
        <el-form
            :label-position="labelPosition"
            label-width="100px"
            :model="formLabelAlign"
        >
          <el-form-item label="用户名：">
            <div align="left">
              {{$store.getters.userName}}
            </div>
          </el-form-item>
          <el-form-item label="绑定邮箱">
            <div align="left">
              {{}}
            </div>
          </el-form-item>
          <el-form-item label="Activity form">
            <el-input v-model="formLabelAlign.type"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Config">Config</el-tab-pane>
      <el-tab-pane label="Role">Role</el-tab-pane>
      <el-tab-pane label="Task">Task</el-tab-pane>
    </el-tabs>
</template>

<script>
export default {
  name: "Setting",
  data(){
    return{
      defaultHeight: {
        height: ""
      },//自适应高度返回
      labelPosition: 'left',
      formLabelAlign: {
        name: '',
        region: '',
        type: '',
      },
    }
  },
  methods:{
    goBack(){
      this.$router.push('/Index')
    },
    //自适应高度触发函数
    getHeight() {
      this.defaultHeight.height = window.innerHeight - 180 + "px";
    },
  },
  created() {
    //页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  }
}
</script>

<style scoped>

</style>