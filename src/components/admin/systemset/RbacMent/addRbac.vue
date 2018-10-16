<template>
    <div>
        <div class="admin_title">
            <i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
     </div>
         <el-form v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules">
          <el-form-item prop="display_name" class="margin-left-lg" label="权限名称">
            <el-input class="form-input-h" v-model="ruleForm.display_name" placeholder="请输入" ></el-input>
          </el-form-item>
          <p class="form-tips">为权限起个好听的名字吧！</p>
          <el-form-item prop="name" class="margin-left-lg margin-top" label="权限路由">
            <el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入" ></el-input>
          </el-form-item>
          <p class="form-tips">请填写权限的路由的地址</p>
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
          display_name: '',
          name:'',
        },
        rules: {
            display_name: [{
                required: true,
                message: '请输入权限名称',
                trigger: 'blur'
            }],
            name : [{
                required: true,
                message: '请输入权限路由',
                trigger: 'blur'
            }],
        },
        loading: false,
        resetdata: false
 
      }
    },
        methods: {
        //提交表单
          submitForm(formName) {
            let id = this.$route.params.id;
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                      let suburl ='';
                       if(id){
                       	 suburl = '/admin/permission/'+ id +'/update'
                       }else {
                        suburl = '/admin/permission/create'
                       }
                        this.loading = true;
                          axios.post(suburl,{
                            display_name:this.ruleForm.display_name,
                            name:this.ruleForm.name
                          })
                            .then((res) => {
                              if(res.data.status){
                                this.$message.success(res.data.message);
                                this.$router.push({name: 'rbacment'});
                              }else {
                                  this.$message.error(res.data.message);
                              }
                              this.loading = false;
                            })
                            .catch((error) => {
                              console.log(error);
                              this.loading = false;
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
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
            //获取数据 
            getdata() {
              let id = this.$route.params.id;
                //判断当this.$route.params.id存在，说明就是进入编辑页面
               if(id){
                  this.loading = true;
                   axios.get('/admin/permission/' + id)
                    .then((res) => {
                      this.ruleForm.name = res.data.permission.name;
                      this.ruleForm.display_name = res.data.permission.display_name;
                      this.loading = false;
                      
                    })
                    .catch((error) => {
                      console.log(error);
                      this.loading = false;
                    });
              }else {
                this.loading = false;
              }

            }

        },

        created: function() {
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