<template>
	<div v-loading="loading">
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm margin-top-lg margin-left-lg">

			<el-form-item label="标题" prop="name">
				<el-input v-model="ruleForm.name" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">请为课程起一个响亮的标题</p>
			</el-form-item>

			<el-form-item label="副标题" prop="title">
				<el-input v-model="ruleForm.title" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">可以用简单明了的一句话来说明课程，不建议副标题过长</p>
			</el-form-item>

			<el-form-item label="分类" prop="nav_id">
				<el-select v-model="ruleForm.nav_id" placeholder="请选择">
					<el-option v-for="nav in NavListsData" :label="nav.name" :key="nav.id" :value="nav.id"></el-option>
				</el-select>
				<p class="form_p_g">设置课程所属的分类，以便管理课程</p>
			</el-form-item>

			<el-form-item label="标签" prop="genre_ids">
				<el-select v-model="ruleForm.genre_ids" multiple placeholder="请选择" class="form_input_g">
					<el-option v-for="genre in GenreListsData" :key="genre.id" :label="genre.name" :value="genre.id">
					</el-option>
				</el-select>
				<p class="form_p_g">标签用于搜索关键字，由课程管理员进行维护</p>
			</el-form-item>

			<el-form-item prop="pictrue" label="课程封面">
				<el-upload name="image" :headers="uploadheaders" class="avatar-uploader" :action="uploadimgurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="ruleForm.pictrue" :src="ruleForm.pictrue" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				<p class="form_p_g">你可以上传jpg, gif, png格式的文件, 图片尺寸至少为750x380。文件大小不能超过2M</p>
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
				loading: false,
				resetdata: false,
				ruleForm: {
					name: '',
					title: '',
					nav_id: '',
					genre_ids: [],
					type: 4,
					pictrue: '',
					status: 1
				},
				rules: {
					name: [{
						required: true,
						message: '请输入标题',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						message: '请输入副标题',
						trigger: 'blur'
					}],
					nav_id: [{
						type: 'number',
						required: true,
						message: '请选择栏目',
						trigger: 'change'
					}],
					genre_ids: [{
						type: 'array',
						required: true,
						message: '请选择分类',
						trigger: 'blur'
					}],
					pictrue: [{
						required: true,
						message: '请选择图片',
						trigger: 'blur'
					}]
				},
				//上传头像请求地址的头部信息
				uploadheaders: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + window.localStorage.getItem('jwt_token')
				},
				uploadimgurl: this.$uploadimgurl,
			}
		},
		computed: {
			...mapState({
				NavListsData: state => state.Admin.NavListsData,
				GenreListsData: state => state.Admin.GenreListsData,
				TeacherListsData: state => state.Admin.TeacherListsData
			})
		},
		methods: {
			...mapActions([
				'getNavLists',
				'getGenreLists',
				'getTeacherLists'
			]),
			submitForm(formName) {
				let id = this.$route.params.id;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let suburl = '';
						if(id) {
							suburl = '/admin/lesson/' + id + '/update'
						} else {
							suburl = '/admin/lesson'
						}
						this.loading = true;
						axios.post(suburl, this.ruleForm)
							.then((res) => {
								if(res.data.status) {
									this.$message.success(res.data.message);
									this.$router.push({
										name: 'teachtask'
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
			//获取栏目数据
			async getData() {
				if(this.$route.params.id) {
					this.loading = true
					const data = await api.getLessonDetail(this.$route.params.id)
					this.loading = false
					this.ruleForm.name = data.lesson.name
					this.ruleForm.title = data.lesson.title
					this.ruleForm.nav_id = data.lesson.nav.id
					this.ruleForm.pictrue = data.lesson.pictrue
					for(let i = 0; i < data.lesson.genres.length; i++) {
						this.ruleForm.genre_ids.push(data.lesson.genres[i].id); //栏目id
					}
				}
				await this.getNavLists()
				await this.getGenreLists()
				await this.getTeacherLists()
			},
			handleAvatarSuccess(res, file) {
				this.ruleForm.pictrue = res;
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
		},
		mounted() {
			this.getData()
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
	.form_p_g {
		color: #888
	}
	
	.form_input_g {
		width: 430px
	}
	
	.form_input_inner {
		width: 214px
	}
	
	.el-form-item__error {
		position: relative
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
</style>