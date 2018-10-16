<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="$router.push({name: 'teachtask'})"></i> {{$route.meta.title}}
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm margin-top-lg margin-left-lg">
		<!-- 	<el-form-item label="课程类型" prop="tapcou">
				<el-select v-model="ruleForm.tapcou" placeholder="请选择">
					<el-option label="录播课程" value="tapcou"></el-option>
				</el-select>
				<p class="form_p_g">目前只支持录播的课程，其余的课程类型，会在后续版本中开发</p>
			</el-form-item> -->
			<el-form-item label="标题" prop="name">
				<el-input v-model="ruleForm.name" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">开启后，才能使用和设置相关会员的功能</p>
			</el-form-item>
			<el-form-item label="副标题" prop="title">
				<el-input v-model="ruleForm.title" class="form_input_g" placeholder="请输入"></el-input>
				<p class="form_p_g">开启后，才能使用和设置相关会员的功能</p>
			</el-form-item>
			<el-form-item label="栏目" prop="nav_id">
				<el-select v-model="ruleForm.nav_id" placeholder="请选择">
					<el-option v-for="nav in navlist" :label="nav.name" :key="nav.id" :value="nav.id"></el-option>
				</el-select>
				<p class="form_p_g">设置课程所属的栏目，以便管理课程</p>
			</el-form-item>
			<el-form-item label="收费模式" prop="type">
				<el-radio-group v-model="ruleForm.type" @change="charamount_sss">
					<el-radio label="1" value="1">免费课程</el-radio>
					<el-radio label="3" value="3">VIP课程</el-radio>
					<el-radio label="2" value="2">付费课程</el-radio>
				</el-radio-group>
				<el-form-item prop="charamount" v-if="charaxiy">
					<el-input v-model="ruleForm.price" onKeypress="return (/[\d.]/.test(String.fromCharCode(event.keyCode)))" class="form_input_inner" placeholder="0"></el-input>
					<span>元</span>
					<p class="form_p_g">只有付费课程才可以设置课程金额，其余两种课程暂不需要金额</p>
				</el-form-item>

			</el-form-item>
			<el-form-item label="分类" prop="genres">
				<el-select v-model="ruleForm.genres" multiple placeholder="请选择" class="form_input_g">
					<el-option v-for="genre in genrelist" :key="genre.id" :label="genre.name" :value="genre.id">
					</el-option>
				</el-select>
				<p class="form_p_g">用于按分类筛选课程、搜索关键字等，由课程管理员进行维护</p>
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
				loading:false,
				charaxiy: false,
				resetdata: false,
				ruleForm: {
					name: '',
					title: '',
					nav_id: '',
					type: '',
					price: 0,
					genres: []
				},
				//栏目数据
				navlist:[],
				//分类数据
				genrelist:[],
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
					// tapcou: [{
					// 	required: true,
					// 	message: '请选择课程类型',
					// 	trigger: 'change'
					// }],
					nav_id: [{
						type: 'number',
						required: true,
						message: '请选择栏目',
						trigger: 'change'
					}],
					type: [{
						required: true,
						message: '请选择收费模式',
						trigger: 'change'
					}],
					price: [{
						required: true,
						message: '请输入金额',
						trigger: 'change'
					}],
					genres: [{
						type: 'array',
						required: true,
						message: '请选择分类',
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						axios.post('/admin/lesson',this.ruleForm)
						.then((res) => {
							this.loading = false;
						})
						.catch((error) => {
							console.log(error);
						})
					} else {
						console.log('error submit!!')
						return false
					}
				})
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
			charamount_sss() {
				if(this.ruleForm.type == "2") {
					this.charaxiy = true
				} else {
					this.charaxiy = false
				}
			},
			//获取栏目数据
			getNavData() {
				axios.get('/admin/nav/lists')
                  .then((res) => {
                    this.navlist = res.data
                    this.loading = false;
                  })
                  .catch((error) => {
                    console.log(error);
                  });
			},
			//获取分类数据
			getGenreData() {
				axios.get('/admin/genre/lists')
              .then((res) => {
                this.genrelist = res.data
                this.loading = false;
              })
              .catch((error) => {
                console.log(error);
              });
			}
		},
		mounted() {
			this.getNavData(),
			this.getGenreData()
		},
		watch: {
			ruleForm: {
				handler(curVal,oldVal){
					this.resetdata = true
				},
				deep: true
			}
		}
	}
</script>
<style scoped>
.form_p_g{color:#888}
.form_input_g{width:430px}
.form_input_inner{width:214px}
.el-form-item__error{position:relative}
</style>