<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

			<el-form-item prop="path" class="margin-left-lg margin-top" label="广告图片">
				<el-upload name="image" class="avatar-uploader" :headers="uploadheaders" :action="uploadimgurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="ruleForm.path" :src="ruleForm.path" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				<p class="form_p_g">只能上传jpg/png文件，且不超过1MB，图片尺寸要在750*380像素</p>
			</el-form-item>

			<el-form-item prop="name" class="margin-left-lg margin-top" label="图片说明">
				<el-input v-model="ruleForm.name" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">为图片起个名字吧！</p>
			</el-form-item>

			<el-form-item prop="order" class="margin-left-lg margin-top" label="排序">
				<el-input v-model="ruleForm.order" :maxlength="3" class="form_input_g" placeholder="请输入数字排序" @input="checkNo"></el-input>
				<p class="form_p_g">输入数字序号，序号越前，广告的顺序越前</p>
			</el-form-item>

			<el-form-item prop="url" class="margin-left-lg margin-top" label="广告链接">
				<el-radio v-model="radio" label="1" @change="adaurl">跳转内部课程</el-radio>
				<el-radio v-model="radio" label="2" @change="adaurl">跳转新链接</el-radio>
				<p>
					<el-input v-if="radio == 1" ref="inpurlname" v-model="urlname" class="form_input_g" placeholder="请选择链接关联的课程"></el-input>
					<data-tables v-if="radio == 1" class="class_data" v-loading="loading" :data="classdata" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters" highlight-current-row @current-change="ClassurlChange">
						<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
							<el-col :span="24" class="text-align-right bg_f5">
								<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索标题关键字">
								</el-input>
							</el-col>
						</el-row>
						<el-table-column prop="name" label="课程名" key="name" sortable="custom">
						</el-table-column>
						<el-table-column prop="created_at" label="发布时间" key="created_at" sortable="custom">
						</el-table-column>
					</data-tables>
					<p v-if="radio == 1" class="form_p_g">您可以选择广告相关的课程！</p>
				</p>
				<p>
					<el-input v-if="radio == 2" v-model="ruleForm.url" class="form_input_g" placeholder="请输入视频网址链接"></el-input>
					<p v-if="radio == 2" class="form_p_g">在输入框中填写广告图点击跳转的链接！链接前缀需要添加http://</p>
				</p>
			</el-form-item>

			<el-form-item class="text-center margin-top-lg">
				<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
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
				radio: '1',
				urlname:'',   //存放勾选上的课程的
				ruleForm: {
					id: '',
					name: '',
					order: '',
					url: '',
					type: '1',
					path: '',
				},
				rules: {
					path: [{
						required: true,
						message: '请选择图片',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入图片说明',
						trigger: 'blur'
					}],
					order: [{
						required: true,
						message: '请输入排序'
					}],
					url: [{
						required: true,
						message: '请填写链接',
						trigger: 'change'
					}]
				},
				loading: false,
				//上传头像请求地址的头部信息
				uploadheaders: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + window.localStorage.getItem('jwt_token')
				},
				uploadimgurl: this.$uploadimgurl,
				resetdata: false,
				tableProps: {
					border: false, //去掉边框
					stripe: false //去掉斑马纹
				},
				customFilters: [{
					vals: '',
					props: ['name'],
				}],
				paginationDef: {
					pageSize: 5,
					pageSizes: [5, 10, 15]
				},
				classdata: []
			}
		},
		methods: {
			//提交表单
			submitForm(formName) {
				let id = this.$route.params.id;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let suburl = '';
						if(id) {
							suburl = '/admin/advert/' + id + '/update'
						} else {
							suburl = '/admin/advert'
						}
						this.loading = true;
						axios.post(suburl, this.ruleForm)
							.then((res) => {
								if(res.data.status) {
									this.$message.success(res.data.message);
									this.$router.push({
										name: 'adalert'
									});
								} else {
									this.$message.error(res.data.message);
								}
								this.loading = false;
								console.log(res);
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
				this.ruleForm.path = res;
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
			checkNo(value) {
				if(value) {
					this.$nextTick(() => {
						this.ruleForm.order = this.$valid.onlynumber(value)
					});
				}
			},
			adaurl(val) {
				this.ruleForm.url = ''
				this.urlname = ''
				this.ruleForm.type = val
			},
			ClassurlChange(val) {
				let order = typeof val
				if(order == 'object' && val != null) {
					this.ruleForm.url = val.id.toString();
					this.urlname = val.name;
				}
			},
			//获取数据 
			getdata() {
				let id = this.$route.params.id
				//判断当this.$route.params.id存在，说明就是进入编辑页面
				if(id) {
					this.loading = true
					axios.get('/admin/advert/' + id)
						.then((res) => {
							this.loading = false;
							this.ruleForm = res.data
							this.radio = res.data.type.toString();
							this.getclass()
						})
						.catch((error) => {
							console.log(error)
						})
				} else {
					this.loading = false
				}
			},
			//获取课程信息
			getclass() {
				this.loading = true;
				axios.get('/admin/lesson/up_lesson_list')
					.then((res) => {
						this.loading = false;
						this.classdata = res.data;
						for(let i in res.data){
							if(res.data[i].id == this.ruleForm.url){
								this.urlname = res.data[i].name;
							}
						}
					})
					.catch((error) => {
						console.log(error)
					})
			}
		},

		mounted: function() {
			if(this.$route.params.id){
				this.getdata()
			}else {
				this.getclass()
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
.avatar-uploader{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden;display:inline-flex}
.avatar-uploader:hover{border-color:#409EFF}
.avatar-uploader-icon{font-size:28px;color:#8c939d;width:178px;height:178px;line-height:178px;text-align:center}
.avatar{width:375px;height:190px;display:block}
.class_data{width:630px;margin-top:1rem;border:1px solid #e3e3e3;border-radius:4px}
.bg_f5{background:#F5F7F9;padding:12px 18px}
.class_data .el-table td,.class_data .el-table th{padding:12px 18px}
</style>