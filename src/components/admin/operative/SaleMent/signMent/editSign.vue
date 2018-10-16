<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm"></i> {{$route.meta.title}}
		</div>
		<el-form v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

			<el-form-item prop="referee" class="margin-left-lg margin-top must" label="邀请人">
				<el-input v-model="ruleForm.referee" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">您可以修改用户的邀请人信息</p>
			</el-form-item>

			<el-form-item prop="company" class="margin-left-lg margin-top must" label="公司名">
				<el-input v-model="ruleForm.company" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">您可以修改用户的公司名称</p>
			</el-form-item>
			
			<el-form-item prop="offer" class="margin-left-lg margin-top must" label="职位名称">
				<el-input v-model="ruleForm.offer" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">您可以修改用户的职位名称</p>
			</el-form-item>

			<el-form-item class="text-center margin-top-lg">
				<el-button :disabled="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
				<el-button @click="resetForm('ruleForm')">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import api from '@/utils/api'
	export default {
		data() {
			return {
				labelPosition: 'right',
				ruleForm: {
					referee: '',
					company: '',
					offer: ''
				},
				loading: false,
				rules: {
					referee: [{
						message: '请输入名称',
						trigger: 'blur'
					}],
					company: [{
						message: '请输入公司名',
						trigger: 'blur'
					}],
					offer: [{
						message: '请输入职位名称',
						trigger: 'blur'
					}]
				},
			}
		},
		computed: {
			
		},
		methods: {
			//提交表单
			submitForm(formName) {
				let id = this.$route.params.id;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let suburl = '';
						if(id) {
							suburl = '/admin/sign/' + id + '/update'
						}
						axios.post(suburl, this.ruleForm)
							.then((res) => {
								if(res.data.status) {
									this.$message.success(res.data.message);
									window.history.go(-1)
								} else {
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
			resetForm() {
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
			async getdata() {
				let id = this.$route.params.id;
				//判断当this.$route.params.id存在，说明就是进入编辑页面
				if(id) {
					this.loading = true;
					axios.get('/admin/sign/' + id)
						.then((res) => {
							this.loading = false
							this.ruleForm.referee = res.data.sign.referee
							this.ruleForm.company = res.data.sign.company
							this.ruleForm.offer = res.data.sign.offer
						})
						.catch((error) => {
							console.log(error);
						});
				}
			}
		},
		mounted() {
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
<style lang="less" scoped>
	.addSale{
		&-time{
			display: inline-block;
			padding: 0 1rem;
		}
	}
	.form-input-h {
		width: 400px
	}
	
	.form_input_g {
		width: 430px
	}
	
	.form_p_g {
		color: #888
	}
	
	.avatar-uploader {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		display: inline-block;
		line-height: 1
	}
	
	.avatar-uploader:hover {
		border-color: #409EFF
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 319px;
		height: 178px;
		line-height: 178px;
		text-align: center
	}
	
	.avatar {
		width: 319px;
		height: 178px;
		display: block
	}
	
	.class_data {
		width: 630px;
		margin-top: 1rem;
		border: 1px solid #e3e3e3;
		border-radius: 4px
	}
	
	.bg_f5 {
		background: #F5F7F9;
		padding: 12px 18px
	}
	
	.class_data .el-table td,
	.class_data .el-table th {
		padding: 12px 18px
	}
</style>