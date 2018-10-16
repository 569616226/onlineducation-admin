<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

			<el-form-item prop="avatar" class="margin-left-lg margin-top" label="讲师头像">
				<el-upload  name="image" :headers="uploadheaders" class="avatar-uploader" :action="uploadimgurl" :show-file-list="false"  :on-success="handleAvatarSuccess"  :before-upload="beforeAvatarUpload">
					<img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload> 
				<p class="form_p_g">只能上传jpg/png文件，且不超过1MB，图片建议尺寸要在250x250px。</p>
			</el-form-item>

			<el-form-item prop="name" class="margin-left-lg margin-top must" label="讲师姓名">
				<el-input v-model="ruleForm.name" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">请输入教师的姓名！</p>
			</el-form-item>
			
			<el-form-item prop="office" class="margin-left-lg margin-top" label="讲师头衔">
				<el-input v-model="ruleForm.office" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">请输入教师的头衔！</p>
			</el-form-item>
			
			<el-form-item prop="describle" class="margin-left-lg margin-top" label="教师介绍">
				<!-- <vue-editor v-model="ruleForm.describle"></vue-editor> -->
				<vue-html5-editor :content="ruleForm.describle" :z-index="10" @change="updateData" :auto-height="true"></vue-html5-editor>
				<p class="form_p_g">为教师填写吸引人的介绍！</p>
			</el-form-item>

			<el-form-item class="text-center margin-top-lg">
				<el-button :disabled="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
				<el-button @click="resetForm('ruleForm')">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				teacher_names:[],
				radio: '1',
				labelPosition: 'right',
				ruleForm: {
					avatar: ''
				},
				rules: {
					avatar: [{
						required: true,
						message: '请选择图片',
						trigger: 'blur'
					}],
					name : (rule, value, callback) => {
		              if(!value){
		                return callback(new Error('教师姓名不能为空'));
		              }
		              // setTimeout(() => {
		               if(this.teacher_names.indexOf(value) != -1){
		                  callback(new Error('教师已存在'))
		                } else {
		                  callback();
		                }
		              // }, 1000);
		            },
					office: [{
						required: true,
						message: '请输入头衔',
						trigger: 'blur'
					}],
					describle: [{
						required: true,
						message: '请填写介绍内容',
						trigger: 'blur'
					}]
				},
				//上传头像请求地址的头部信息
				uploadheaders: {
					Accept:'application/json',
					Authorization:'Bearer ' + window.localStorage.getItem('jwt_token')
				},
				uploadimgurl:this.$uploadimgurl,
				loading: false
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
                       	 suburl = '/admin/teacher/'+ id +'/update'
                       }else {
                        suburl = '/admin/teacher'
                       }
                       this.loading = true;
					   axios.post(suburl,this.ruleForm)
						 .then((res) => {
						 	if(res.data.status) {
						 		this.$message.success(res.data.message);
						 		this.$router.push({name: 'instment'});
						 	}else {
						 		this.$message.error(res.data.message);
						 	}
						 	this.loading = false;
						 })
						 .catch((error) => {
						 	console.log(error)
						 })
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
			handleAvatarSuccess(res, file) {
				this.ruleForm.avatar = res;
				// this.ruleForm.avatar = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
				let isJPGorPNG = false;
				if(file.type === 'image/jpeg' || file.type === 'image/png'){
					isJPGorPNG = true;
				}
				const isLt1M = file.size / 1024 / 1024 < 1;
				if(!isJPGorPNG) {
					this.$message.error('上传图片只能是 JPG或者PNG 格式!');
				}
				if(!isLt1M) {
					this.$message.error('上传图片大小不能超过 1MB!');
				}
				return isJPGorPNG && isLt1M;
			},
			// 更新富文本内容，实现双向数据绑定
			updateData: function (data) {
                this.ruleForm.describle = data
            },
			//获取数据 
            getdata() {
              let id = this.$route.params.id;
                //判断当this.$route.params.id存在，说明就是进入编辑页面
               if(id){
                  this.loading = true;
                   axios.get('/admin/teacher/' + id)
                    .then((res) => {
                	  this.loading = false;
                      this.ruleForm = res.data.teacher;
                      this.teacher_names = res.data.teacher_names;
                    })
                    .catch((error) => {
                      console.log(error);
                    });
              }else {
            	  this.loading = true;
                  axios.get('/admin/teacher/names')
                    .then((res) => {
                      this.teacher_names = res.data
                      this.loading = false;
                    })
                    .catch((error) => {
                      console.log(error);
                    });
              }

            }
		},

		mounted: function() {
			this.getdata()
		},
		watch: {
			ruleForm: {
				handler(curVal, oldVal) {
					this.resetdata = true
				},
				deep: true
			}
		}
	}
</script>
<style scoped>
.form-input-h{width:400px}
.form_input_g{width:430px}
.form_p_g{color:#888}
.avatar-uploader{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden;display:inline-block;line-height:1}
.avatar-uploader:hover{border-color:#409EFF}
.avatar-uploader-icon{font-size:28px;color:#8c939d;width:178px;height:178px;line-height:178px;text-align:center}
.avatar{width:178px;height:178px;display:block}
.class_data{width:630px;margin-top:1rem;border:1px solid #e3e3e3;border-radius:4px}
.bg_f5{background:#F5F7F9;padding:12px 18px}
.class_data .el-table td,.class_data .el-table th{padding:12px 18px}
</style>