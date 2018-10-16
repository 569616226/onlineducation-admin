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
			
			<el-form-item prop="content" class="margin-left-lg margin-top noborder" label="消息内容">
				<vue-html5-editor :content="ruleForm.content" :z-index="10" @change="updateData" :auto-height="true"></vue-html5-editor>
				<p class="form_p_g">请输入消息的内容！</p>
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
				ruleForm: {
					title: '',
					label_id: '',
					content: ''
				},
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
					}]
				},
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
					window.history.go(-1);
				}

			},
			// 更新富文本内容，实现双向数据绑定
			updateData: function (data) {
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
		},

		mounted: function() {
			this.getUserLabel();
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
</style>