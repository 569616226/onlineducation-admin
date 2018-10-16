<template>
    <div>
        <div class="admin_title">
            <i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="$router.push({name: 'rolement'})"></i> {{$route.meta.title}}
     </div>
         <el-form v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules">
          <el-form-item prop="display_name" class="margin-left-lg" label="角色名">
            <el-input class="form-input-h" v-model="ruleForm.display_name" placeholder="请输入" ></el-input>
          </el-form-item>
          <p class="form-tips">给角色起个名字吧！</p>
          <el-form-item prop="name" class="margin-left-lg margin-top" label="标识">
            <el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入" ></el-input>
          </el-form-item>
          <p class="form-tips">为角色起个标识吧！</p>
          <el-form-item prop="rolement" class="margin-left-lg margin-top rolement" label="选择权限">
            <div class="tree-box">
                   <!--  :default-expanded-keys="[2, 3]" --><!-- 默认展开的的节点 -->
                 <el-tree
                  ref="tree"
                  :data="treedata"
                  show-checkbox
                  node-key="id"
                  :props="defaultProps">
                </el-tree>
            </div>
            
          </el-form-item>
          <el-form-item class="text-center margin-top-lg">
            <el-button :disabled="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button  @click="$router.push({name: 'rolement'})">返回</el-button>
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
          display_name:'',
        },
        rules: {
            display_name: [{
                required: true,
                message: '请输入角色名',
                trigger: 'blur'
            }],
            name : [{
                required: true,
                message: '请输入标识',
                trigger: 'blur'
            }],
            rolement : (rule, value, callback) =>{
                if(this.$refs.tree.getCheckedKeys() == ''){
                  return callback(new Error('请勾选权限'));
                }else {
                  callback();
                }
            }
        },
        //存放树形菜单的数据
        treedata: [],
        //存放勾选上的树形菜单的key值
        checks: [],
        // 树形菜单的字段配置
        defaultProps: {
          children: 'subPermissions',
          label: 'display_name'
        },
        loading : false,
      }
    },
        methods: {
        //提交表单
          submitForm(formName) {
            let id = this.$route.params.id;
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        let suburl = "";
                        if(id){
                          // 编辑
                          suburl = '/admin/role/'+ id +'/update'
                        }else {
                        // 新建
                          suburl = '/admin/role/store'
                        }
                         this.loading = true;
                         axios.post(suburl,{
                            display_name:this.ruleForm.display_name,
                            name:this.ruleForm.name,
                            permission_ids:this.$refs.tree.getCheckedKeys()
                          })
                          .then((res) => {
                              if(res.data.status){
                                this.$message.success(res.data.message);
                                this.$router.push({name: 'rolement'});
                              }else {
                                 this.$message.error(res.data.message);
                              }
                               this.loading = false;
                          })
                          .catch((error) => {
                            console.log(error);
                            this.loading = false;
                          })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 获取树形菜单的所有数据（没有勾选上的）
            gettree() {
              this.loading = true;
              axios.get('/admin/role/create')
              .then((res)=> {
                this.treedata = res.data.permissions;
                 this.loading = false;
              })
              .catch((error) => {
                console.log(error);
                this.loading = false;
              });
            },

            //获取数据 
            getdata() {
                let id = this.$route.params.id;
                //判断当this.$route.params.id存在，说明就是进入编辑页面
                if(id){
                     this.loading = true;
                     axios.get('/admin/role/' + id +'/edit')
                      .then((res)=> {
                        this.treedata = res.data.perms;
                        this.ruleForm.name = res.data.role.name;
                        this.ruleForm.display_name = res.data.role.display_name;
                        for(let i=0; i< res.data.role.permissions.length; i++){
                            this.checks.push(res.data.role.permissions[i].id)
                        };
                        // 通过key去设置勾选上的树形菜单
                         this.$refs.tree.setCheckedKeys(this.checks);
                        // this.treedata = response.data.permissions
                        this.loading = false;
                      })
                      .catch((error) => {
                        console.log(error);
                        this.loading = false;
                      });
                     
                }else {
                     this.gettree()
                }

              
               
            }
        },

        mounted: function() {
            this.getdata()
        }
    }
</script>
<style scoped>
.form-input-h{width:400px}
.form-tips{margin-left:140px;font-size:14px;color:#888}
.tree-box{margin-top:10px;border:1px solid #E3E3E3;border-radius:4px;width:800px;padding:10px;min-height:220px}
</style>
<style>
.rolement>label:before{content:'*';color:#fa5555;margin-right:4px}
</style>