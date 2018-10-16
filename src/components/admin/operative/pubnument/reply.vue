<template>
	<div>
		<div class="member_first">
			<el-form v-loading="loading" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="回复内容" prop="index_count">
					<vue-html5-editor :content="ruleForm.index_count" @change="updateData" :z-index="10" :auto-height="true"></vue-html5-editor>
					<p class="form_p_g">设置新用户关注公众号的欢迎词，字数不超过600字，按下Enter键换行</p>
				</el-form-item>
				<el-form-item class="text_reply">
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				data: [],
				ruleForm: {
					index_count: ''
				},
				rules: {
					index_count: [{
						required: true,
						message: '请填写回复内容',
						trigger: 'blur'
					}]
				},
				loading: false
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let content = this.ruleForm.index_count
						axios.post('/admin/setting/1/set_wechat_sub', {
								'wechat_sub': content
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
				axios.get('/admin/setting/1/get_wechat_sub')
					.then((res) => {
						this.ruleForm.index_count = res.data.wechat_sub
						this.loading = false;
					})
					.catch((error) => {
						console.log(error);
					});
			},
			updateData(data) {
				this.ruleForm.index_count = data
			}
		},
		watch: {

		},
		mounted() {
			this.getdata();
		}
	}
</script>
<style scoped>
.member_first{padding:60px}
.text_reply{text-align:center}
.form_p_g{color:#888}
</style>