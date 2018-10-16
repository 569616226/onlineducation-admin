<template>
    <div>
        <div class="admin_title">
            <i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
     </div>
         <el-form @submit.native.prevent v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules">
          <el-form-item prop="name" class="margin-left-lg must" label="组名">
            <el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入" ></el-input>
          </el-form-item>
          <p class="form-tips">请给组起个名字！</p>
          <el-form-item class="text-center margin-top-lg">
            <el-button :disabled="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button  @click="resetForm('ruleForm')">返回</el-button>
          </el-form-item>
        </el-form>
     </div>
</template>

<script>
    export default {
         data() {
      return {
        label_names:[],    
        labelPosition: 'right',
        ruleForm: {
          name:'',
        },
        allrole:[],
        rules: {
            name : (rule, value, callback) => {
              if(!value){
                return callback(new Error('组名不能为空'));
              }
              // setTimeout(() => {
               if(this.label_names.indexOf(value) != -1){
                  callback(new Error('组名已存在'))
                } else {
                  callback();
                }
              // }, 1000);
            }
        },
        loading: false,
        resetdata: false
 
      }
    },
        methods: {
        //提交表单
          submitForm(formName) {
            let id = this.$route.params.id;
            let url = '';
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.loading = true;
                        // 判断是新建还是编辑，赋值对应的请求路径
                        if(id){
                            url = '/admin/label/' + id + '/update'
                        }else {
                            url = '/admin/label'
                        }
                        axios.post(url,{
                           name:this.ruleForm.name
                          })
                          .then((res) => {
                            this.loading = false;
                            if(res.data.status){
                                this.$message.success(res.data.message);
                                 this.$router.push({name: 'user',params:{tabActive:'2'}});
                              }else {
                                  this.$message.error(res.data.message);
                              }
                          })
                          .catch((error) => {
                            console.log(error);
                          });
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
                  this.$router.push({name: 'user',params:{tabActive:'2'}});
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  })
                })
              } else {
                this.$router.push({name: 'user',params:{tabActive:'2'}});
                // window.history.go(-1)
              }

            },
            //获取数据 
            getdata() {
              let id = this.$route.params.id;
                //判断当this.$route.params.id存在，说明就是进入编辑页面
               if(id){
                  this.loading = true;
                   axios.get('/admin/label/' + id )
                    .then((res) => {
                      this.ruleForm.name = res.data.label.name;
                      this.label_names = res.data.label_names;
                      this.loading = false;
                    })
                    .catch((error) => {
                      console.log(error);
                    });
              }else {
                this.loading = true;
                  axios.get('/admin/label/names')
                    .then((res) => {
                      this.label_names = res.data
                      this.loading = false;
                    })
                    .catch((error) => {
                      console.log(error);
                    }); 
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