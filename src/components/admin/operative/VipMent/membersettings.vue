<template>
	<div>
		<p class="member_p">会员到期提醒</p>
		<div class="member_first">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="提醒周期" prop="vip_send_seting">
					<el-select v-model="ruleForm.vip_send_seting" placeholder="请选择">
						<el-option label="提前5天" :value="5"></el-option>
						<el-option label="提前3天" :value="3"></el-option>
					</el-select>
					<p class="gray">根据设置的提醒周期，系统将自动推送到期提醒消息，具体分案如下：</p>
					<p class="gray">选择<提前5天>：会在到期前5天/3天/1天会发送提醒消息；</p>
					<p class="gray">选择<提前3天>：会在到期前3天/1天会发送提醒消息；</p>
				</el-form-item>
				<el-form-item>
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
				ruleForm: {
					vip_send_seting:null
				},
				rules: {
					vip_send_seting: [{
						type:'number',
						required: true,
						message: '请选择提醒周期',
						trigger: 'change'
					}]
				}
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						axios.post('/admin/setting/1/set_vip_send_time',{
							vip_send_seting: this.ruleForm.vip_send_seting
						})
						.then((res) => {
							if(res.data.status){
								this.$message.success(res.data.message);
							}else {
								this.$message.warning(res.data.message);
							}
						})
						.catch((error) => {
							console.log('提交会员提醒设置报错',error);
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			getdata() {
				axios.get('/admin/setting/1/get_vip_send_time')
				.then((res) => {
					this.ruleForm.vip_send_seting = res.data.vip_send_seting
				})
				.catch((error) => {
					console.log('会员到期提醒设置',error);
				});
			}
		},
		mounted() {
			this.getdata();
		}
	}
</script>
<style scoped>
.member_p{font-size:16px;color:#101010;border:1px solid #e3e3e3;border-radius:2px;background-color:#F5F5F5;padding:15px 30px}
.member_first{padding:60px}
</style>