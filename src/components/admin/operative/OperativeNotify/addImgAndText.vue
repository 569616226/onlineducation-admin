<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">

			<el-form-item prop="title" class="margin-left-lg margin-top" label="消息标题">
				<el-input class="form-input-h" v-model="ruleForm.title" placeholder="请输入"></el-input>
				<p class="form_p_g">请给消息起个引人注目的名字吧！</p>
			</el-form-item>

			<el-form-item prop="label_id" class="margin-left-lg margin-top" label="选择接收人">
				<el-select v-model="ruleForm.label_id" placeholder="请选择">
					<el-option v-for="item in labels" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
				<p class="form_p_g">请选择接受消息的用户类型！</p>
			</el-form-item>
			
			<el-form-item label="选择图片" prop="picture" class="margin-left-lg margin-top" >
				<el-upload name="image" :headers="uploadheaders" v-model="ruleForm.picture" class="avatar-uploader_inofor el-upload_inofor" :action="uploadimgurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="ruleForm.picture" :src="ruleForm.picture" class="avatar_inofor">
					<i v-else class="el-icon-plus avatar-uploader-icon_inofor"></i>
				</el-upload>
				<p class="form_p_g">你可以上传jpg , png格式的文件, 图片建议尺寸为480x270。文件大小不能超过1M。</p>
			</el-form-item>

			<el-form-item prop="content" class="margin-left-lg margin-top noborder" label="消息内容">
				<vue-html5-editor :content="ruleForm.content" :z-index="10" @change="updateData" :auto-height="true"></vue-html5-editor>
				<p class="form_p_g">请输入消息的内容！</p>
			</el-form-item>

			<el-form-item prop="url" class="margin-left-lg margin-top" label="广告链接">
				<el-radio v-model="radio" label="1" @change="adaurl">跳转内部课程</el-radio>
				<el-radio v-model="radio" label="2" @change="adaurl">跳转新链接</el-radio>
				<p>
					<el-input v-if="radio == 1" v-model="ruleForm.urlname" class="form_input_g" placeholder="请选择链接关联的课程"></el-input>
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
				radio: '1',
				ruleForm: {
					title: '',
					label_id: '',
					content: '',
					url: '',
					picture:'',
					urlname:''
				},
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
				classdata: [],
				rules: {
					title: [{
						required: true,
						message: '请输入消息标题',
						trigger: 'blur'
					}],
					label_id: [{
						type:'number',
						required: true,
						message: '请选择接收人',
						trigger: 'blur'
					}],
					content: [{
						required: true,
						message: '请选择接收人',
						trigger: 'blur'
					}],
					picture: [{
						required: true,
						message: '请选择图片',
						trigger: 'blur'
					}],
					url: [{
						required: true,
						message: '请填写链接',
						trigger: 'change'
					}]
				},
				//上传图片封面请求地址的头部信息
				uploadheaders: {
					Accept:'application/json',
					Authorization:'Bearer ' + window.localStorage.getItem('jwt_token')
				},
				uploadimgurl:this.$uploadimgurl,
				//用户标签列表
				labels : [],
				loading: false,
				resetdata: false
			}
		},
		components: {
		},
		methods: {
			//提交表单
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						axios.post('/admin/message/send_messages',this.ruleForm)
						.then((res) => {
							if(res.data.status){
								this.$message.success(res.data.message);
								this.$router.push({name:'operative'});
							}else {
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
			adaurl(val) {
				this.ruleForm.url = '';
				this.ruleForm.urlname = '';
				this.ruleForm.type = val;
			},
			ClassurlChange(val) {
				let order = typeof val
				if(order == 'object' && val != null) {
					console.log(val)
					this.ruleForm.url = 'http://mobile.edu.elinkport.com/#/details/' +val.id.toString();
					this.ruleForm.urlname = val.name;
				}
			},
			handleAvatarSuccess(res, file) {
				// this.ruleForm.picture = URL.createObjectURL(file.raw);
				this.ruleForm.picture = res;
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
			// 更新富文本内容，实现双向数据绑定
			updateData: function (data) {
                // sync content to component
                this.ruleForm.content = data
            },
			// 获取用户标签列表
			getUserLabel() {
				// this.labels
				axios.get('/admin/label/lists')
				.then((res) => {
					this.labels = res.data;
				})
				.catch((error) => {
					console.log('消息管理中获取用户标签列表报错',error);
				})
			},
			//获取课程信息
			getclass() {
				this.loading = true;
				axios.get('/admin/lesson/up_lesson_list')
					.then((res) => {
						this.loading = false;
						this.classdata = res.data
					})
					.catch((error) => {
						console.log(error)
					})
			}
		},

		mounted: function() {
			this.getUserLabel();
			this.getclass();
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
<style>
.form-input-h{width:400px}
.form_p_g{color:#888}
.noborder .vue-html5-editor>.toolbar{display:none}
.avatar-uploader_inofor .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}
.avatar-uploader_inofor .el-upload:hover{border-color:#409EFF}
.avatar-uploader-icon_inofor{font-size:28px;color:#8c939d;width:278px;height:278px;line-height:278px;text-align:center}
.avatar_inofor{width:480px;height:270px;display:block}
.course_first{height:46px;line-height:46px;border:1px solid #e3e3e3;border-radius:2px;padding:0 20px;font-size:16px;background:#F5F5F5}
.cursor .el-input.is-disabled .el-input__icon{cursor:pointer}
.form_input_g{width:430px}
.form_input_inner{width:214px}
.el-form-item__error{position:relative}
.class_data{width:630px;margin-top:1rem;border:1px solid #e3e3e3;border-radius:4px}
.bg_f5{background:#F5F7F9;padding:12px 18px}
.class_data .el-table td,.class_data .el-table th{padding:12px 18px}
</style>