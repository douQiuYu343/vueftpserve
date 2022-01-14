
<template>
  <el-page-header @back="goBack"/>
  <el-tabs type="border-card" :style="defaultHeight">
    <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
    >
      <div align="right">
        <el-button-group>
          <el-button type="info" @click="drawer = true" v-loading="loading1"> 上传 </el-button>
          <el-drawer v-model="drawer" title="I am the title" :with-header="false">
            <span>
             <el-upload
                 class="upload-demo"
                 action="http://127.0.0.1:25564/ftpApi/upload/headImage"
                 :on-preview="handlePreview"
                 :before-upload="beforeUpload"
                 :on-remove="handleRemove"
                 :before-remove="beforeRemove"
                 multiple
                 :limit="1"
                 :on-exceed="handleExceed"
                 :file-list="fileList"
                 :data="{ID:$store.getters.userName,FileName:this.FileName}">
                  <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </span>
          </el-drawer>
          <el-button type="info" @click="Change"> 重命名 </el-button>
          <el-button type="info" @click="Delete"> 删除 </el-button>
          <el-button type="info" @click="Look"> 查看 </el-button>
        </el-button-group>
      </div>
      <div align="left">
        <el-button-group>
        <el-row>
          <el-col :span="4.5"><el-button type="info" @click="ReBack" icon="Back"> 返回 </el-button></el-col>
          <el-col :span="19"><el-input v-model="FileName" placeholder="文件位置"/></el-col>
        </el-row>
        </el-button-group>
      </div>
      <div>
        <el-table :data="tableData"
                  v-loading="loading"
                  style="width: 100%"
                  :default-sort="{ prop: 'type', order: 'descending' }"
                  max-height="380">
          <el-table-column fixed prop="name" label="文件名" width="200" />
          <el-table-column prop="type" label="条目类型" width="120" />
          <el-table-column prop="size" label="大小" width="120" />
          <el-table-column prop="rights" label="权限" width="120" />
          <el-table-column prop="date" label="日期" width="200" />
          <el-table-column prop="owner" label="所有者" width="120" />
          <el-table-column prop="group" label="组名称" width="120"/>
          <el-table-column fixed="right" label="操作" width="120">
            <template v-slot="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handleClick1">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  </el-tabs>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "FristNetdisk",
  data() {
    return {
      fileList:[],
      loading:false,
      loading1:false,
      drawer:false,
      FileName:'',
      defaultHeight: {
        height: ""
      },//自适应高度返回
      labelPosition: 'left',
      formLabelAlign: {
        name: '',
        region: '',
        type: '',
      },
      tableData:[
        {
          name: '',
          type: '',
          size: '',
          rights: '',
          date: '',
          owner: '',
          group: '',
        },
      ],
      currentRow: null,
    }
  },
  methods: {
    changeType(){
      this.tableData.name='';
      this.tableData.type='';
      this.tableData.size='';
      this.tableData.rights='';
      this.tableData.date='';
      this.tableData.owner='';
      this.tableData.group='';
    },
    beforeUpload(file){
      console.log(file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    //文件轨迹操作
    ReBack(){
      var Str='';
      var reg;
      for(var i=this.FileName.length-1;i>=0;i--){
        if(i===0){
          this.FileName='';
          this.loading=true
          this.pwdCon()
        }else if(this.FileName[i]==='/'){
          reg = new RegExp('/'+Str);
          this.FileName=this.FileName.replace(reg,"");
          this.loading=true
          this.pwdCon()
          break;
        }else{
          Str=this.FileName[i]+Str;
        }
      }
    },
    ListFile(Value){
      this.loading=true
      if(Value.type==="文件夹"){
        this.FileName=this.FileName+'/'+Value.name
      }
    },
    pwdCon(){
      const self = this;
      self.axios({
        method:'post',
        url: 'http://127.0.0.1:25564/ftpApi/FtpListFound',
        data: {
          ID:this.$store.getters.userName,
          FileName:this.FileName,
          tableData:[
            {
              name: this.tableData.name,
              type: this.tableData.type,
              size: this.tableData.size,
              rights: this.tableData.rights,
              date: this.tableData.date,
              owner: this.tableData.owner,
              group: this.tableData.group,
            },
          ]
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
              if(res.data.tableData.length===2){
                this.tableData=[];
              }else{
                for(var i=0;i<res.data.tableData.length;i++) {
                  if(res.data.tableData[i].name==='.'||res.data.tableData[i].name==='..') {
                    res.data.tableData.splice(0,2)
                  }
                  if(res.data.tableData[i].type==='d'){
                    res.data.tableData[i].type="文件夹";
                  }else if(res.data.tableData[i].type==='-'){
                    res.data.tableData[i].type="文件";
                  }
                }
                this.tableData=res.data.tableData;
                this.loading=false
              }
            }
          })
          .catch( err => {
            console.log(err);
          })
    },
    //ftp服务器操作
    Upload(){
      this.loading1=true;
      const self = this;
      self.axios({
        method:'post',
        url: 'http://127.0.0.1:25564/ftpApi/ftpUpload',
        data: {
          ID:this.$store.getters.userName,
          FilePath:this.FileName
        }
      }).then( res => {
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
              this.loading1=false;
            }
          }).catch( err => {
            console.log(err);
          })
      this.loading1=false;
    },
    Download(){

    },
    Change(){

    },
    Look(){

    },
    Delete(){

    },
    //识别ftp列表
    loadLook(){
      const self = this;
      self.axios({
        method:'post',
        url: 'http://127.0.0.1:25564/ftpApi/FtpListLook',
        data: {
          ID:this.$store.getters.userName,
          tableData:[
            {
              name: this.tableData.name,
              type: this.tableData.type,
              size: this.tableData.size,
              rights: this.tableData.rights,
              date: this.tableData.date,
              owner: this.tableData.owner,
              group: this.tableData.group,
            },
          ]
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
              if(res.data.tableData.length===2){
                this.tableData=[];
              }else{
                for(var i=0;i<res.data.tableData.length;i++) {
                  if(res.data.tableData[i].name==='.'||res.data.tableData[i].name==='..') {
                    res.data.tableData.splice(0,2)
                  }
                  if(res.data.tableData[i].type==='d'){
                    res.data.tableData[i].type="文件夹";
                  }else if(res.data.tableData[i].type==='-'){
                    res.data.tableData[i].type="文件";
                  }
                }
                this.tableData=res.data.tableData;
                this.loading=false
              }
            }
          })
          .catch( err => {
            console.log(err);
          })
      this.loading=false;
    },
    //自适应高度触发函数
    getHeight() {
      this.defaultHeight.height = window.innerHeight - 190 + "px";
    },
    goBack() {
      this.$router.push('/Index')
    },
    handleClick(row){
      this.loading=true;
      this.ListFile(row);
      if(row.type==="文件夹"){
        console.log(row.name);
        const self = this;
        self.axios({
          method:'post',
          url: 'http://127.0.0.1:25564/ftpApi/FtpListFound',
          data: {
            ID:this.$store.getters.userName,
            FileName:this.FileName,
            tableData:[
              {
                name: row.name,
                type: this.tableData.type,
                size: this.tableData.size,
                rights: this.tableData.rights,
                date: this.tableData.date,
                owner: this.tableData.owner,
                group: this.tableData.group,
              },
            ]
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
                console.log()
                if(res.data.tableData.length===2){
                  this.tableData=[];
                }else{
                  for(var i=0;i<res.data.tableData.length;i++) {
                    if(res.data.tableData[i].name==='.'||res.data.tableData[i].name==='..') {
                      res.data.tableData.splice(0,2)
                    }
                    if(res.data.tableData[i].type==='d'){
                      res.data.tableData[i].type="文件夹";
                    }else if(res.data.tableData[i].type==='-'){
                      res.data.tableData[i].type="文件";
                    }
                  }
                  this.tableData=res.data.tableData;
                  this.loading=false
                }
              }
            })
            .catch( err => {
              console.log(err);
            })
        this.loading=false;
      }else if(row.type==="文件"){
        ElMessage({
          showClose: true,
          message: '这是文件',
          type: 'error',
        })
        this.loading=false
      }
    },
    handleClick1(){
      ElMessage({
        showClose: true,
        message: '暂时不能删除',
        type: 'error',
      })
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  },
  created() {
    //页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    //自动刷新识别ftp列表
    this.loading=true;
    this.loadLook();
  }
}
</script>

<style scoped>
:root {
  --el-color-primary: #409eff;
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #f56c6c;
  --el-color-error: #f56c6c;
  --el-color-info: #909399;
}

</style>