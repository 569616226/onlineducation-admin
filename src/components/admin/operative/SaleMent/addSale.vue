<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

			<el-form-item prop="name" class="margin-left-lg margin-top must" label="会议名称">
				<el-input v-model="ruleForm.name" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">为会议起一个吸引人的标题！</p>
			</el-form-item>

			<el-form-item prop="title" class="margin-left-lg margin-top must" label="副标题">
				<el-input v-model="ruleForm.title" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">用简单明了的一句话来说明本次会议，不建议副标题过长，否则会影响阅读体验！</p>
			</el-form-item>

			<el-form-item prop="pic" class="margin-left-lg margin-top" label="会议封面">
				<el-upload name="image" :headers="uploadheaders" class="avatar-uploader" :action="uploadimgurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="ruleForm.pic" :src="ruleForm.pic" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				<p class="form_p_g">你可以上传jpg, gif, png格式的文件, 图片尺寸至少为750x380。文件大小不能超过2M</p>
			</el-form-item>

			<el-form-item prop="nav_id" class="margin-left-lg margin-top" label="分类">
				<el-select v-model="ruleForm.nav_id" placeholder="请选择">
					<el-option v-for="item,index in NavListsData" :key="index" :label="item.name" :value="item.id" v-if="item.type == 1"></el-option>
				</el-select>
				<p class="form_p_g">线下培训管理 默认选择分类为“培训预告”</p>
			</el-form-item>

			<el-form-item prop="geren_ids" class="margin-left-lg margin-top" label="标签">
				<el-select v-model="ruleForm.geren_ids" multiple placeholder="请选择">
					<el-option v-for="item,index in GenreListsData" :key="index" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
				<p class="form_p_g">标签用于搜索关键字，由课程管理员进行维护</p>
			</el-form-item>

			<el-form-item prop="time" class="margin-left-lg margin-top" label="会议时间">
				<el-date-picker v-model="ruleForm.start_at" type="datetime" placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss">
				</el-date-picker>
				<span class="addSale-time">至</span>
				<el-date-picker v-model="ruleForm.end_at" type="datetime" placeholder="选择结束时间" value-format="yyyy-MM-dd HH:mm:ss">
				</el-date-picker>
				<p class="form_p_g">选择活动的开始日式/时间和结束日期/时间</p>
			</el-form-item>
			
			<el-form-item prop="address" class="margin-left-lg margin-top must" label="会议地址">
				<el-input v-model="ruleForm.address" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">系统默认填写地址为公司地址，如需修改请再输入框内进行修改！</p>
			</el-form-item>

			<el-form-item prop="discrible" class="margin-left-lg margin-top" label="会议详情">
				<vue-html5-editor :content="ruleForm.discrible" :z-index="10" @change="updateData" :auto-height="true"></vue-html5-editor>
				<p class="form_p_g">在输入框内填写本次会议的详情内容，字数不限，支持图片上传！</p>
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
			const checkTime = (rule, value, callback) => {
				if(this.ruleForm.start_at === '') {
					callback(new Error('请选择开始时间'));
				} else if(this.ruleForm.end_at == '') {
					callback(new Error('请选择结束时间'));
				} else {
					callback();
				}
			};
			const checkGeren = (rule, value, callback) => {
				if(this.ruleForm.geren_ids.length == 0) {
					callback(new Error('请选择标签'));
				} else {
					callback();
				}
			};
			const checkNav = (rule, value, callback) => {
				if(this.ruleForm.nav_id === '') {
					callback(new Error('请选择分类'));
				} else {
					callback();
				}
			};
			return {
				teacher_names: [],
				radio: '1',
				labelPosition: 'right',
				ruleForm: {
					name: '',
					title: '',
					pic: '',
					nav_id: '',
					geren_ids: [],
					start_at: '',
					end_at: '',
					address: '广东省东莞市松山湖中科创新广场B座2楼东华供应链',
					discrible: ''
				},
				rules: {
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						message: '请输入副标题',
						trigger: 'blur'
					}],
					pic: [{
						required: true,
						message: '请选择图片',
						trigger: 'blur'
					}],
					nav_id: [{
						required: true,
						validator: checkNav,
						trigger: 'blur'
					}],
					geren_ids: [{
						required: true,
						validator: checkGeren,
						trigger: 'blur'
					}],
					time: [{
						required: true,
						validator: checkTime,
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '请输入地址',
						trigger: 'blur'
					}],
					discrible: [{
						required: true,
						message: '请填写内容',
						trigger: 'blur'
					}]
				},
				//上传头像请求地址的头部信息
				uploadheaders: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + window.localStorage.getItem('jwt_token')
				},
				uploadimgurl: this.$uploadimgurl,
				loading: false
			}
		},
		computed: {
			...mapState({
				NavListsData: state => state.Admin.NavListsData,
				GenreListsData: state => state.Admin.GenreListsData
			})
		},
		methods: {
			...mapActions([
				'getNavLists',
				'getGenreLists'
			]),
			//提交表单
			submitForm(formName) {
				let id = this.$route.params.id;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let suburl = '';
						if(id) {
							suburl = '/admin/train/' + id + '/update'
						} else {
							suburl = '/admin/train'
						}
						this.loading = true;
						axios.post(suburl, this.ruleForm)
							.then((res) => {
								if(res.data.status) {
									this.$message.success(res.data.message);
									this.$router.push({
										name: 'SaleMent'
									});
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
				this.ruleForm.pic = res;
			},
			beforeAvatarUpload(file) {
				let isJPGorPNG = false;
				if(file.type === 'image/jpeg' || file.type === 'image/png') {
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
			updateData(data) {
				this.ruleForm.discrible = data
			},
			//获取数据 
			async getdata() {
				let id = this.$route.params.id;
				//判断当this.$route.params.id存在，说明就是进入编辑页面
				if(id) {
					this.loading = true;
					axios.get('/admin/train/' + id)
						.then((res) => {
							this.loading = false;
							this.ruleForm.name = res.data.train.name
							this.ruleForm.title = res.data.train.title
							this.ruleForm.pic = res.data.train.pic
							this.ruleForm.nav_id = res.data.train.nav
							this.ruleForm.geren_ids = res.data.train.genres
							this.ruleForm.start_at = res.data.train.start_at
							this.ruleForm.end_at = res.data.train.end_at
							this.ruleForm.address = res.data.train.address
							this.ruleForm.discrible = res.data.train.discrible
						})
						.catch((error) => {
							console.log(error);
						});
				}
				await this.getNavLists()
				await this.getGenreLists()
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