<template>
	<div v-loading="loading">
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<div class="member_first">
			<div class="ClearCache">
				<el-button type="primary" @click="ClearCache">清除缓存</el-button>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
				<el-form-item label="设置提前签到时间" prop="sign_start_time">
					<el-input class="form-input-h" v-model="ruleForm.sign_start_time" placeholder="请输入" @input="checkNo"></el-input>
					<span class="margin-left-xs">分钟</span>
					<p class="form_p_g">设置提前签到时间后，参会者可以在会议开启前进行扫码签到！</p>
				</el-form-item>
				<el-form-item class="text_reply">
					<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import api from '@/utils/api'
	export default {
		components: {

		},
		data() {
			return {
				data: [],
				ruleForm: {
					sign_start_time: ''
				},
				rules: {
					sign_start_time: [{
						type: 'number',
						required: true,
						message: '请填写签到时间',
						trigger: 'blur'
					}]
				},
				loading: false
			};
		},
		methods: {
			checkNo(value) {
				if(value) {
					this.$nextTick(() => {
						this.ruleForm.sign_start_time = this.$valid.onlyZeroNumber(value)
					});
				}
			},
			async ClearCache() {
				this.loading = true
				const data = await api.getClearCache()
				this.loading = false
				this.$message.success(data.message)
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let content = this.ruleForm.sign_start_time
						axios.post('/admin/setting/1/set_sign_start_time', {
								'sign_start_time': content
							})
							.then((res) => {
								if(res.data.status) {
									this.$message.success(res.data.message);
								} else {
									this.$message.error(res.data.message);
								}

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
			//获取数据 
			getdata() {
				this.loading = true;
				axios.get('/admin/setting/1/sign_start_time')
					.then((res) => {
						this.ruleForm.sign_start_time = res.data.sign_start_time
						this.loading = false;
					})
					.catch((error) => {
						console.log(error);
					});
			}
		},
		mounted() {
			this.getdata()
		}
	}
</script>
<style scoped>
	.member_first {
		padding: 60px
	}
	
	.text_reply {
		text-align: center
	}
	
	.form_p_g {
		color: #888
	}
	
	.form-input-h {
		width: 400px
	}
	
	.form_p_g {
		font-size: 14px;
		color: #888;
		clear: both
	}
	.ClearCache{
		padding: 0 1.4rem 3.4rem 1.4rem;
	}
</style>