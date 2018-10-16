<template>
    <div>
        <div class="admin_title">
            <i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="$router.push({name: 'accment'})"></i> {{$route.meta.title}}
     </div>
         <el-form v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules">
          <el-form-item prop="nickname" class="margin-left-lg" label="姓名">
            <el-input class="form-input-h" v-model="ruleForm.nickname" placeholder="请输入" ></el-input>
          </el-form-item>
          <p class="form-tips">输入账号使用者的姓名！</p>
          <el-form-item prop="name" class="margin-left-lg margin-top must" label="账号">
            <el-input class="form-input-h" @input="checkNo" :maxlength="20" v-model="ruleForm.name" placeholder="请输入" ></el-input>
          </el-form-item>
          <p class="form-tips">建议账号为英文</p>
          <el-form-item prop="password" class="margin-left-lg margin-top" label="账号密码">
            <el-input class="form-input-h" v-model="ruleForm.password" placeholder="请输入" ></el-input>
          </el-form-item>
          <p class="form-tips">密码不少于6位，建议密码由英文+数字组成</p>
          <el-form-item class="margin-left-lg margin-top" label="选择角色" prop="role">
          <el-select v-model="ruleForm.role" placeholder="请选择">
              <div v-for="role in allrole">
                <el-option :label="role.display_name" :value="role.id">{{ role.display_name }}</el-option>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item class="text-center margin-top-lg">
            <el-button type="primary" :disabled="loading" @click="submitForm('ruleForm')">提交</el-button>
            <el-button  @click="$router.push({name: 'accment'})">返回</el-button>
          </el-form-item>
        </el-form>
     </div>
</template>

<script>
    export default {
         data() {
      return {
        user_names:[],   //存放已经存在的账号（用于校验重复创建相同账号的方法）
        labelPosition: 'right',
        ruleForm: {
          nickname: '',
          name:'',
          password:'',
          role:[]
        },
        allrole:[],
        rules: {
            nickname: [{
                required: true,
                message: '请输入姓名',
                trigger: 'blur'
            }],
            name : (rule, value, callback) => {
              if(!value){
                return callback(new Error('账号不能为空'));
              }
              // setTimeout(() => {
                if (value.length < 4 || value.length > 20) {
                  callback(new Error('请输入4到20位的账号'))
                }else if(this.user_names.indexOf(value) != -1){
                  callback(new Error('账号已存在'))
                } else {
                  callback();
                }
              // }, 1000);
            },
            password : [{
                min: 6,
                max: 20,
                message: '请输入6-20位的密码',
                trigger: 'blur'
            }],
            role : [{
                type: 'number',
                required: true,
                message: '请选择角色',
                trigger: 'change'
            }]
        },
        loading: false
 
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
                            url = '/admin/user/' + id + '/update'
                        }else {
                            url = '/admin/user/store'
                        }
                        axios.post(url,{
                            name:this.ruleForm.name,
                            nickname:this.ruleForm.nickname,
                            password:this.ruleForm.password,
                            role_id:this.ruleForm.role
                          })
                          .then((res) => {
                            this.loading = false;
                            if(res.data.status){
                                this.$message({
                                  message: res.data.message,
                                  type: 'success'
                                });
                                this.$router.push({name: 'accment'});
                              }else {
                                  this.$message.error(res.data.message);
                              }
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
            //获取数据 
            getdata() {
              let id = this.$route.params.id;
                //判断当this.$route.params.id存在，说明就是进入编辑页面
                 axios.get('/admin/role/lists')
                  .then((res) => {
                    this.allrole = res.data
                    this.loading = false;
                  })
                  .catch((error) => {
                    console.log(error);
                  });
               if(id){
                  this.loading = true;
                   axios.get('/admin/user/' + id + '/edit')
                    .then((res) => {
                      this.ruleForm.name = res.data.user.name;
                      this.ruleForm.nickname = res.data.user.nickname;
                      this.ruleForm.role = res.data.user.role[0].id;
                      this.user_names = res.data.user_names
                      this.loading = false;
                    })
                    .catch((error) => {
                      console.log(error);
                    });
              }else {
                   this.loading = true;
                   axios.get('/admin/user/names')
                    .then((res) => {
                      this.user_names = res.data
                      this.loading = false;
                    })
                    .catch((error) => {
                      console.log(error);
                    }); 
              }
            },
            checkNo(value) {
            if(value) {
              this.$nextTick(() => {
                this.ruleForm.name = this.$valid.noCork(value)
              });
            }
          },

        },

        mounted: function() {
            this.getdata();
        }
    }
</script>
<style scoped>
.form-input-h{width:400px}
.form-tips{margin-left:140px;font-size:14px;color:#888}
.tree-box{margin-top:10px;border:1px solid #E3E3E3;border-radius:4px;width:800px;padding:10px;min-height:220px}
</style>