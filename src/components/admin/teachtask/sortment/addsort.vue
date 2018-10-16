<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form @submit.native.prevent v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

			<el-form-item prop="name" class="margin-left-lg margin-top must" label="分类名称">
				<el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入"></el-input>
				<p class="form_p_g">为分类起个更通俗易懂的名字吧！</p>
			</el-form-item>

			<el-form-item class="text-center margin-top-lg">
				<!-- <button @click="submitForm('ruleForm')">提交</button> -->
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
				labelPosition: 'right',
				genre_names:[],
				ruleForm: {},
				rules: {
					 name : (rule, value, callback) => {
		              if(!value){
		                return callback(new Error('分类名称不能为空'));
		              }
		              // setTimeout(() => {
		               if(this.genre_names.indexOf(value) != -1){
		                  callback(new Error('分类已存在'))
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
				let suburl = "";
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(id){
							suburl = '/admin/genre/' + id + '/update'
						}else {
							suburl = '/admin/genre'
						}
						this.loading = true;
						axios.post(suburl,{name:this.ruleForm.name})
						.then((res) => {
							if(res.data.status){
								this.$message.success(res.data.message);
								this.$router.push({name:'sortment'});
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
			//获取数据 
			getdata() {
				let id = this.$route.params.id;
				//判断当this.$route.params.id存在，说明就是进入编辑页面
				if(id) {
					this.loading = true;
					axios.get('/admin/genre/' + id)
						.then((res) => {
							this.ruleForm = res.data.genre
							this.genre_names = res.data.genre_names
							this.loading = false;
						})
						.catch((error) => {
							console.log(error);
							this.loading = false;
						});
				} else {
					this.loading = true;
					axios.get('/admin/genre/names')
                    .then((res) => {
                      this.genre_names = res.data
                      this.loading = false;
                    })
                    .catch((error) => {
                      console.log(error);
                      this.loading = false;
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
.form_p_g{color:#888}
</style>