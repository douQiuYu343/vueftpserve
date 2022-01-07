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
      <el-tab-pane label="password">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Role">Role</el-tab-pane>
      <el-tab-pane label="Task">Task</el-tab-pane>
    </el-tabs>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "Setting",
  data(){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return{
      ruleForm: {
        pass: '',
        checkPass: '',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },
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
    changeType(){
      this.ruleForm.checkPass="";
    },

    goBack(){
      this.$router.push('/Index')
    },
    //自适应高度触发函数
    getHeight() {
      this.defaultHeight.height = window.innerHeight - 190 + "px";
    },
    //password restart
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const self = this;
          self.axios({
            method:'post',
            url: 'http://192.168.1.23:25564/api/user/passRe',
            data: {
              ID: self.$store.getters.userName,
              Password: self.ruleForm.checkPass
            }
          })
              .then( res => {
                if(res.data===-1){
                  ElMessage({
                    showClose: true,
                    message: 'password change error',
                    type: 'error',
                  })
                }else if(res.data===1){
                  ElMessage({
                    showClose: true,
                    message: 'OK',
                    type: 'success',
                  })
                }})
              .catch( err => {
                console.log(err);
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
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