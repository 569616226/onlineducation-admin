<template>
    <div>
        <div class="admin_title">
            <i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
     </div>
         <el-form @submit.native.prevent v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules">
          <el-form-item prop="name" class="margin-left-lg" label="模板标题">
            <el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入" ></el-input>
          </el-form-item>
          <p class="form-tips">为模板起个名字吧！</p>
          <el-form-item prop="content" class="margin-left-lg margin-top" label="模板内容">
            <vue-html5-editor :content="ruleForm.content" :z-index="10" @change="updateData" :auto-height="true"></vue-html5-editor>
          </el-form-item>
          <p class="form-tips">告知用户购买本课程会有什么样的须知！</p>
          
          <el-form-item class="text-center margin-top-lg">
            <el-button type="primary" :disabled="loading" @click="submitForm('ruleForm')">提交</el-button>
            <el-button  @click="resetForm('ruleForm')">返回</el-button>
          </el-form-item>
        </el-form>
     </div>
</template>

<script>
    export default {
         data() {
      return {
        labelPosition: 'right',
        ruleForm: {
          name: '',
          content:'',
        },
        rules: {
            name: [{
                required: true,
                message: '请输入模板标题',
                trigger: 'blur'
            }],
            content : [{
                required: true,
                message: '请输入模板内容',
                trigger: 'blur'
            }]
        },
        loading: false,
        resetdata: false
        
      }
    },
        methods: {
        //提交表单
          submitForm(formName) {
                let id = this.$route.params.id 
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        if(id){
                          this.loading = true;
                          axios.post('/admin/education/'+ id +'/update',{
                            name:this.ruleForm.name,
                            content:this.ruleForm.content
                          })
                          .then(res =>{
                            if(res.data.status){
                              this.$message({
                                message: res.data.message,
                                type: 'success'
                              });
                              this.$router.push({name:'eduset'});
                            }else {
                               this.$message.error(res.data.message);
                            }
                              this.loading = false;
                          })
                          .catch(res =>{
                            console.log(res)
                            this.loading = false;
                          })
                        }else {
                          this.loading = true;
                           axios.post('/admin/education/create',{
                            name:this.ruleForm.name,
                            content:this.ruleForm.content
                          })
                          .then(res =>{
                            if(res.data.status){
                              this.$message({
                                message: res.data.message,
                                type: 'success'
                              });
                              this.$router.push({name:'eduset'});
                            }else {
                              this.$message.error(res.data.message);
                            }
                            this.loading = false;
                          })
                          .catch(res =>{
                              console.log(res);
                              this.loading = false;
                               this.$message.error(res.data.message);
                          })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
              //this.$refs[formName].resetFields();
              if(this.resetdata) {
                this.$confirm('真的要退出此次编辑？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(() => {
                  window.history.go(-1)
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  })
                })
              } else {
                window.history.go(-1)
              }

            },
            // 更新富文本内容，实现双向数据绑定
            updateData: function (data) {
                // sync content to component
                this.ruleForm.content = data
            },
            //获取数据 
            getdata() {
                let id = this.$route.params.id 
                //判断当this.$route.params.id存在，说明就是进入编辑页面
                if(id){
                    this.loading = true;
                    axios.get('/admin/education/' + id)
                    .then(res => {
                       this.ruleForm = res.data;
                       this.loading = false;
                    })
                    .catch(res => {
                      console.log(res);
                    })
                    
                }
            }
        },

        mounted: function() {
            this.getdata();
        },
         watch: {
          ruleForm: {
            handler(curVal,oldVal){
              this.resetdata = true
            },
            deep: true
          }
        }
    }
</script>
<style scoped>
.form-input-h{width:400px}
.form-tips{margin-left:140px;font-size:14px;color:#888}
.tree-box{margin-top:10px;border:1px solid #E3E3E3;border-radius:4px;width:800px;padding:10px;min-height:220px}
</style>