<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

			<el-form-item prop="name" class="margin-left-lg margin-top must" label="价格名称">
				<el-input v-model="ruleForm.name" :maxlength="20" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">为VIP方案起个通俗易懂的名称！</p>
			</el-form-item>

			<el-form-item prop="describle" class="margin-left-lg margin-top" label="副标题">
				<el-input v-model="ruleForm.describle" :maxlength="20" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">可以在副标题里填写促销消息或方案的简短介绍，不建议过长！</p>
			</el-form-item>


			<el-form-item prop="price" class="margin-left-lg margin-top" label="金额">
				<el-input v-model="ruleForm.price" :maxlength="7" class="form_input_g_jin" @input="checkNoprice"  placeholder="请输入"></el-input>
				<span>元</span>
				<p class="form_p_g">请输入合理的VIP销售方案价格金额！只能输入数字和小数点</p>
			</el-form-item>
			<el-form-item prop="expiration" class="margin-left-lg margin-top" label="开通时长">
				<el-input v-model="ruleForm.expiration" :maxlength="4" class="form_input_g_jin" @input="checkNoturn" placeholder="请输入" ></el-input>
				<span>月</span>
				<p class="form_p_g">请输入VIP价格方案开通的月数</p>
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
				labelPosition: 'right',
				vip_names: [],
				ruleForm: {
					name: '',
					describle: '',
					price: '',
					expiration: ''
				},
				rules: {
					 name : (rule, value, callback) => {
		              if(!value){
		                return callback(new Error('价格名称不能为空'));
		              }
		              // setTimeout(() => {
		               if(this.vip_names.indexOf(value) != -1){
		                  callback(new Error('价格名称已存在'))
		                } else {
		                  callback();
		                }
		              // }, 1000);
		            },
					describle: [{
						required: true,
						message: '请输入副标题',
						trigger: 'blur'
					}],
					price: [{
						required: true,
						message: '请输入金额'
					}],
					expiration: [{
						required: true,
						message: '请输入开通时长'
					}]
				},
				loading: false
			}
		},
		methods: {
			//提交表单
			submitForm(formName) {
				// alert(typeof(this.ruleForm.price))
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let suburl = "";
						if(this.$route.params.id) {
							suburl = '/admin/vip/' + this.$route.params.id + '/update';
						}else {
							suburl = '/admin/vip';
						}
						this.loading = true;
						axios.post(suburl,{
							name:this.ruleForm.name,
							describle:this.ruleForm.describle,
							price:this.ruleForm.price,
							expiration:this.ruleForm.expiration
						})
						.then((res) => {
							if(res.data.status) {
								this.$message.success(res.data.message);
								this.$router.push({name: 'vipment',params:{tabActive:'2'}});
								this.loading = false;
							}
							
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
			resetForm(formName) {
				//this.$refs[formName].resetFields();
				if(this.resetdata) {
					this.$confirm('真的要退出此次编辑？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(() => {
						this.$router.push({name: 'vipment',params:{tabActive:'2'}});
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						})
					})
				} else {
					this.$router.push({name: 'vipment',params:{tabActive:'2'}});
				}
			},
			getdata() {
				this.loading = true;
				axios.get('/admin/vip/' +this.$route.params.id)
				.then((res) => {
					this.ruleForm = res.data.vip;
					this.vip_names = res.data.vip_names;
					this.loading = false;
				})
				.catch((error) => {
					console.log(error)
					this.loading = false;
				})
			},
			checkNoprice(value) {
				if(value) {
					this.$nextTick(() => {
						this.ruleForm.price = this.$valid.nolyNorD(value)
					});
				}
			},
			checkNoturn(value) {
				if(value) {
					this.$nextTick(() => {
						this.ruleForm.expiration = this.$valid.onlynumber(value)
					});
				}
			}
		},

		mounted: function() {
			if(this.$route.params.id) {
				this.getdata();
			}else{
				 this.loading = true;
                  axios.get('/admin/vip/names')
                    .then((res) => {
                      this.vip_names = res.data
                      this.loading = false;
                    })
                    .catch((error) => {
                      console.log(error);
                    }); 
			}
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
.form_input_g_jin{width:200px}
</style>