<template>
  <el-page-header @back="goBack"/>
  <el-tabs type="border-card" :style="defaultHeight">
    <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
    >

    </el-form>
  </el-tabs>
</template>

<script>
export default {
  name: "FastNetdisk",
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
  methods: {
    //自适应高度触发函数
    getHeight() {
      this.defaultHeight.height = window.innerHeight - 190 + "px";
    },
    goBack() {
      this.$router.push('/Index')
    }
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