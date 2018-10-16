<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form @submit.native.prevent v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules">

			<el-form-item class="margin-left-lg margin-top" label="用户头像">
				<img :src="data.picture" class="EditUser-img" />
				<p class="form_p_g">默认读取用户微信头像，无法进行修改</p>
			</el-form-item>

			<el-form-item class="margin-left-lg margin-top" label="微信昵称">
				<el-input class="form-input-h" v-model="data.nickname" placeholder="请输入" :disabled="true"></el-input>
				<p class="form_p_g">默认读取用户微信信息，无法进行修改</p>
			</el-form-item>

			<el-form-item class="margin-left-lg margin-top" label="性别">
				<el-input class="form-input-h" v-model="data.gender" placeholder="请输入" :disabled="true"></el-input>
				<p class="form_p_g">默认读取用户微信信息，无法进行修改</p>
			</el-form-item>

			<el-form-item class="margin-left-lg margin-top" label="地区">
				<el-input class="form-input-h" v-model="data.position" placeholder="请输入" :disabled="true"></el-input>
				<p class="form_p_g">默认读取用户微信信息，无法进行修改</p>
			</el-form-item>

			<el-form-item prop="phone" class="margin-left-lg margin-top" label="手机号">
				<el-input class="form-input-h" v-model="ruleForm.phone" placeholder="请输入"></el-input>
				<div class="EditUser-phone" v-if="ruleForm.phone">
					<i class="el-icon-erp-icon-check-circle el-icon--left EditUser-phone-i"></i>
					<span>已绑定手机</span>
				</div>
				<p class="form_p_g">手机号码将用于用户账号绑定，请填写用户有效手机号</p>
			</el-form-item>

			<el-form-item prop="name" class="margin-left-lg margin-top" label="姓名">
				<el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入"></el-input>
				<p class="form_p_g">填写用户的真实姓名</p>
			</el-form-item>

			<el-form-item prop="role_id" class="margin-left-lg margin-top" label="角色">
				<el-select v-model="ruleForm.role_id" placeholder="请选择" class="form_input_g">
					<el-option v-for="genre in RoleListsData" :key="genre.id" :label="genre.display_name" :value="genre.id">
					</el-option>
				</el-select>
				<p class="form_p_g">不同角色所拥有的功能不一样，请根据实际情况选择用户实际角色</p>
			</el-form-item>

			<el-form-item prop="company" class="margin-left-lg margin-top" label="公司">
				<el-input class="form-input-h" v-model="ruleForm.company" placeholder="请输入"></el-input>
				<p class="form_p_g">填写用户所在的企业名称，建议此处由用户自行填写</p>
			</el-form-item>

			<el-form-item prop="offer" class="margin-left-lg margin-top" label="职位">
				<el-input class="form-input-h" v-model="ruleForm.offer" placeholder="请输入"></el-input>
				<p class="form_p_g">填写用户职位名称，建议此处由用户自行填写</p>
			</el-form-item>

			<el-form-item class="margin-left-lg margin-top" label="推荐人">
				<el-input class="form-input-h" v-model="ruleForm.referee" placeholder="请输入"></el-input>
				<p class="form_p_g">填写用户推荐人的姓名，建议此处由用户自行填写</p>
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
				data: [],
				label_names: [],
				labelPosition: 'right',
				ruleForm: {
					phone: '',
					name: '',
					role_id: '',
					company: '',
					offer: '',
					referee: ''
				},
				allrole: [],
				rules: {
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					role_id: [{
						type: 'number',
						required: true,
						message: '请选择角色',
						trigger: 'change'
					}],
					company: [{
						required: true,
						message: '请输入公司名',
						trigger: 'blur'
					}],
					offer: [{
						required: true,
						message: '请输入职位',
						trigger: 'blur'
					}]
				},
				loading: false,
				resetdata: false

			}
		},
		computed: {
			...mapState({
				RoleListsData: state => state.Admin.RoleListsData
			})
		},
		methods: {
			...mapActions([
				'getRoleLists'
			]),
			//提交表单
			submitForm(formName) {
				let id = this.$route.params.id;
				let url = '';
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						// 判断是新建还是编辑，赋值对应的请求路径
						if(id) {
							url = '/admin/guest/' + id + '/update'
						}
						this.ruleForm.role_ids = [this.ruleForm.role_id]
						delete this.ruleForm.role_id
						axios.post(url, this.ruleForm)
							.then((res) => {
								this.loading = false;
								if(res.data.status) {
									this.$message.success(res.data.message);
									this.$router.push({
										name: 'user'
									});
								} else {
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
				this.$router.push({
					name: 'user',
					params: {
						tabActive: '1'
					}
				});

			},
			//获取数据 
			async getdata() {
				let id = this.$route.params.id;
				//判断当this.$route.params.id存在，说明就是进入编辑页面
				if(id) {
					this.loading = true
					const data = await api.getGuestDetail(id)
					await this.getRoleLists()
					this.data = data
					this.ruleForm.phone = data.phone
					this.ruleForm.name = data.name
					this.ruleForm.role_id = data.role.id
					this.ruleForm.company = data.company
					this.ruleForm.offer = data.offer
					this.ruleForm.referee = data.referee
					this.loading = false
				}
			}

		},

		mounted: function() {
			this.getdata();
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
	.EditUser {
		&-phone {
			display: inline-block;
			margin-left: 5px;
			color: rgba(36, 187, 34, 1);
			& span {
				font-size: 18px;
			}
		}
		&-img {
			width: 60px;
			border-radius: 50%;
		}
	}
	
	.form-input-h {
		width: 400px
	}
	
	.form_p_g {
		font-size: 14px;
		color: #888;
		clear: both
	}
	
	.form-tips {
		margin-left: 140px;
		font-size: 14px;
		color: #888
	}
	
	.tree-box {
		margin-top: 10px;
		border: 1px solid #E3E3E3;
		border-radius: 4px;
		width: 800px;
		padding: 10px;
		min-height: 220px
	}
</style>