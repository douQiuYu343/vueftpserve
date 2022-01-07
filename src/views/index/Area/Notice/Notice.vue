<template>
  <el-page-header @back="goBack"/>
  <el-card class="box-card" :style="defaultHeight">
    <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
    >
      <div class="demo-collapse">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="Consistency" name="1">
            <div>
              Consistent with real life: in line with the process and logic of real
              life, and comply with languages and habits that the users are used to;
            </div>
            <div>
              Consistent within interface: all elements should be consistent, such
              as: design style, icons and texts, position of elements, etc.
            </div>
          </el-collapse-item>
          <el-collapse-item title="Feedback" name="2">
            <div>
              Operation feedback: enable the users to clearly perceive their
              operations by style updates and interactive effects;
            </div>
            <div>
              Visual feedback: reflect current state by updating or rearranging
              elements of the page.
            </div>
          </el-collapse-item>
          <el-collapse-item title="Efficiency" name="3">
            <div>
              Simplify the process: keep operating process simple and intuitive;
            </div>
            <div>
              Definite and clear: enunciate your intentions clearly so that the
              users can quickly understand and make decisions;
            </div>
            <div>
              Easy to identify: the interface should be straightforward, which helps
              the users to identify and frees them from memorizing and recalling.
            </div>
          </el-collapse-item>
          <el-collapse-item title="Controllability" name="4">
            <div>
              Decision making: giving advices about operations is acceptable, but do
              not make decisions for the users;
            </div>
            <div>
              Controlled consequences: users should be granted the freedom to
              operate, including canceling, aborting or terminating current
              operation.
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import { ref } from 'vue'

export default {
  name: "Notice",
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
    activeName(){
      return ref('1')
    },
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