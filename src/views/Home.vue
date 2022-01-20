<template>
    <el-container>
      <el-header class="header-font">滁州儒林外国语学校文件服务器Web客户端</el-header>
      <el-main
          :style="defaultHeight"
      ><div align="center">
        <el-row>
          <el-col>
            <el-card shadow="always">
              <el-form
                  ref="ruleForm"
                  :model="ruleForm"
                  status-icon
                  :rules="rules"
                  label-width="100px"
                  class="demo-ruleForm"

              >
                <el-form-item label="ID：" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="pass">
                  <el-input
                      v-model="ruleForm.pass"
                      type="password"
                      autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="login"
                  >登录</el-button
                  >
                  <el-button @click="resetForm('ruleForm')">清空</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </div>
      </el-main>
    </el-container>
</template>

<script>
// @ is an alias to /src
import { ElMessage } from 'element-plus'

export default {
  name: 'Home',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码！密码！'))
      } else {
        if (this.ruleForm.name !== '') {
          this.$refs.ruleForm.validateField('name')
        }
        callback()
      }
    }
    const nameValue = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('还没有填写用户ID呢！！！'))
      } else {
        callback()
      }
    }
    return {
      defaultHeight: {
        height: ""
      },
      ruleForm: {
        pass: '',
        name: '',
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        name: [{ validator: nameValue, trigger: 'blur' }],
      },
    }
  },
  methods: {
    changeType(){
      this.ruleForm.name="";
      this.ruleForm.pass="";
    },
    //登录
    login(){
      const self = this;
      if (self.ruleForm.name !== "" && self.ruleForm.pass !== "") {
        self.axios({
          method:'post',
          url: '/api/user/login',
          data: {
            ID: self.ruleForm.name,
            Password: self.ruleForm.pass
          }
        })
            .then( res => {
              if(res.data===-1){
                ElMessage({
                  showClose: true,
                  message: '用户不存在',
                  type: 'error',
                })
              }else if(res.data===1){
                ElMessage({
                  showClose: true,
                  message: '用户存在，但密码不正确',
                  type: 'error',
                })
              }else {
                console.log(res.data);
                console.log(res.data.ID);
                console.log(res.data.token);
                localStorage.setItem('token',res.data.token);
                // 将登录名使用vuex传递到Home页面
                this.$store.commit('handleUserName',res.data.ID);
                console.log(this.$store.state.user_name)
                console.log(this.$store.getters.userName)
                this.$router.push('/Index');
              }
            })
            .catch( err => {
              console.log(err);
            })
      } else{
        ElMessage({
          showClose: true,
          message: '请填写信息！',
          type: 'warning',
        })
      }
    },
    getHeight() {
      this.defaultHeight.height = window.innerHeight - 90 + "px";
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
  created() {
    //页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  }
}
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);
  text-align: center;
}

body > .el-container {
  margin-bottom: 10px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
.header-font{
  font-family: 方正小标宋简体;
  font-size: 30px;
  color: aqua;
}

.el-row{
  width: 400px;
  text-align: center;
}
</style>