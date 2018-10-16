<template>
	<div v-loading="loading">
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form  v-loading="addloading" :model="ruleForm" :rules="rules" ref="ruleForm" @submit.native.prevent label-width="120px" class="demo-ruleForm margin-top-lg margin-left-lg">

			<el-form-item label="标题" prop="name">
				<el-input v-model="ruleForm.name" :maxlength="20" class="form_input_g" placeholder="请输入" @input="checkname"></el-input>
				<p class="form_p_g">为课程起一个好名字！！！</p>
			</el-form-item>

			<el-form-item label="副标题" prop="title">
				<el-input v-model="ruleForm.title" :maxlength="20" class="form_input_g" placeholder="请输入" @input="checktitle"></el-input>
				<p class="form_p_g">可以用简单明了的一句话来说明课程，不建议副标题过长</p>
			</el-form-item>

			<el-form-item label="栏目" prop="nav_id">
				<el-select v-model="ruleForm.nav_id" placeholder="请选择">
					<div v-for="nav in navs">
						<el-option :label="nav.name" :key="nav.id" :value="nav.id"></el-option>
					</div>
				</el-select>
				<p class="form_p_g">设置课程所属的栏目，以便管理课程</p>
			</el-form-item>

			<el-form-item label="分类" prop="genre_ids">
				<el-select v-model="ruleForm.genre_ids" multiple placeholder="请选择" class="form_input_g">
					<el-option v-for="genre in genres" :key="genre.id" :label="genre.name" :value="genre.id">
					</el-option>
				</el-select>
				<p class="form_p_g">用于按分类筛选课程、搜索关键字等，由课程管理员进行维护</p>
			</el-form-item>

			<el-form-item label="收费模式" prop="type">
				<el-radio-group v-model="ruleForm.type" @change="charamount_sss">
					<el-radio :label="1">免费课程</el-radio>
					<el-radio :label="3">VIP课程</el-radio>
					<el-radio :label="2">付费课程（精品课程）</el-radio>
				</el-radio-group>
				<el-form-item prop="price" v-if="charaxiy">
					<el-input v-model="ruleForm.price" :maxlength="7" @input="checkNoprice" class="form_input_inner" placeholder="0.00"></el-input>
					<span>元</span>
					<p class="form_p_g">只有付费课程才可以设置课程金额，其余两种课程暂不需要金额</p>
				</el-form-item>
			</el-form-item>

			<el-form-item label="购买须知" prop="educational_id" v-if="charaxiy">
				<el-select v-model="ruleForm.educational_id" placeholder="请选择" @change="notebuygo">
					<el-option v-for="education in educations" :key="education.name" :label="education.name" :value="education.id">
					</el-option>
				</el-select>
				<span class="margin-left-sm form_p_g">*选择购买须知模版后，会自动读取模版数据到输入框里</span>
				<!-- <vue-editor v-model="ruleForm.noteeditor" class="margin-top-sm"></vue-editor> -->
				<el-card v-if="educations_content" class="box-card margin-top-sm">
					<div v-html="educations_content"></div>
				</el-card>
				<p class="form_p_g">只有付费课程才可以设置课程售价和填写购买须知，免费课程和VIP课程无需填写</p>
			</el-form-item>

			<div v-if="bid">
				<el-form-item label="免费试看" prop="is_frees" v-if="charaxiy || charvip">
					<el-checkbox-group v-model="ruleForm.is_frees" class="freelook">
						<el-checkbox v-for="(section,index) in sections" :key="section.id" :label="section.id" @change="free_video(index)">{{ index + 1 }}、{{section.name}}<span class="freelook_span" v-if="section.is_free == 1">免费</span></el-checkbox>
					</el-checkbox-group>
					<p class="form_p_g">为了更好的让用户尝新，可以设置指定的节进行免费试看</p>
				</el-form-item>
			</div>
			<el-form-item label="课程封面" prop="pictrue">
				<el-upload name="image" :headers="uploadheaders" v-model="ruleForm.pictrue" class="avatar-uploader_inofor el-upload_inofor" :action="uploadimgurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="ruleForm.pictrue" :src="ruleForm.pictrue" class="avatar_inofor">
					<i v-else class="el-icon-plus avatar-uploader-icon_inofor"></i>
				</el-upload>
				<p class="form_p_g">你可以上传jpg, png格式的文件, 图片建议尺寸为750x440。文件大小不能超过1M。</p>
			</el-form-item>
			<!-- learnInput用于绑定输入框的数组   这里的ruleForm.learning只用于循环长度，在提交的时候将learnInput赋值给ruleForm.learning -->
			<el-form-item label="你可以学到" prop="learning" class="learninginp">
				<el-input v-for="(acquire,index) in ruleForm.learning" :key="acquire" v-model="learnInput[index]" class="form_input_for margin-bottom-sm cursor">
					<i class="el-icon-close el-input__icon" v-if="learnInput.length > 1" slot="suffix" @click="handleIconClick(index)"></i>
				</el-input>
				<el-button @click="acquireadd">添加新内容</el-button>
				<p class="form_p_g">请用简单明了的话介绍学习本课程能掌握的知识点</p>
			</el-form-item>

			<el-form-item label="适用人群" prop="for">
				<vue-html5-editor :content="ruleForm.for" @change="updateData" :z-index="10" :auto-height="true"></vue-html5-editor>
				<!-- <vue-editor v-model="ruleForm.for"></vue-editor> -->
				<p class="form_p_g">请用简单明了的话介绍课程适用的人群</p>
			</el-form-item>

			<el-form-item label="选择授课老师" prop="teacher_id">
				<el-select v-model="ruleForm.teacher_id" placeholder="请选择" class="form_input_g">
					<el-option v-for="teacher in teachers" :key="teacher.id" :label="teacher.name" :value="teacher.id">
					</el-option>
				</el-select>
				<p class="form_p_g">请选择课程的授课老师</p>
			</el-form-item>

			<el-form-item label="课程介绍" prop="describle">
				<vue-html5-editor :content="ruleForm.describle" :z-index="10" @change="updateDatad" :auto-height="true"></vue-html5-editor>
				<!-- <vue-editor v-model="ruleForm.describle"></vue-editor> -->
				<p class="form_p_g">请填写课程的简介</p>
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
		props: ['sections', 'loading','data'],
		data() {
			return {
				lesson_names:[],	//判断课程名是否重复用的
				learnInput:[''],   //绑定你可以学到什么的数组数据
				learnTF:false,		//判断你可以学到什么的数据中是否有为空的，如果其中有一个为空那么都为true，全部都填写过了就为false
				addloading:false,
				bid: this.$route.params.id, //用于标记是不是编辑页面，bid存在就证明是编辑页面
				navs: [], //栏目列表
				genres: [], //分类列表
				educations: [], //模板列表
				educations_content: '', //模板内容,
				teachers: [], //讲师列表
				acquire: '', //存放添加的你可以学到什么的数据
				resetdata: '',
				//提交表单的数据
				ruleForm: {
					name: '', //标题
					title: '', //副标题
					nav_id: null, //选中的栏目
					genre_ids: [], //选中的分类（可多选）
					type: null, //收费类型
					price: 0, //课程价格，默认为0
					educational_id: null, //选中的购买模板
					is_frees: [], //免费试看的章节（设置那些可以免费看的章节的id）(只有在编辑页面的时候才有)
					pictrue: '', //课程封面
					learning: [''], //你可以学到什么的数据集合
					// learning: [], 
					for: '', //适用人群
					teacher_id: '', //选中的讲师
					describle: '', //课程介绍
					status: 1, //课程状态（1.未上架，2.已下架，3.已上架）默认为1

				},
				//上传图片封面请求地址的头部信息
				uploadheaders: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + window.localStorage.getItem('jwt_token')
				},
				uploadimgurl: this.$uploadimgurl,
				charaxiy: false, //判断是否显示购买价格和购买模板的标记
				charvip: false, //判断是否显示vip勾选章节的标记
				rules: {
					name : (rule, value, callback) => {
			              if(!value){
			                return callback(new Error('课程名称不能为空'));
			              }
			              // setTimeout(() => {
			               if(this.lesson_names.indexOf(value) != -1){
			                  callback(new Error('课程已存在'))
			                } else {
			                  callback();
			                }
			              // }, 1000);
			        },
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
					type: [{
						type: 'number',
						required: true,
						message: '收费模式',
						trigger: 'blur'
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
					}],
					learning: (rule, value, callback) =>{
						// alert()
						for(let i = 0; i < this.ruleForm.learning.length; i++){
							if(this.learnInput[i] == '' || this.learnInput[i] == undefined){
								this.learnTF = true;
								break;
							}else {
								this.learnTF = false;
							}
						}
		                if(this.learnTF){
		                	return callback(new Error('请填写你可以学到什么'));
		                }else {
		                   callback();
		                }
		            },
					for: [{
						required: true,
						message: '请输入适用人群内容',
						trigger: 'blur'
					}],
					teacher_id: [{
						type: 'number',
						required: true,
						message: '请选择授课老师',
						trigger: 'blur'
					}],
					describle: [{
						required: true,
						message: '请输入内容',
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						if(this.$route.params.id){
							this.$parent.loading = true;
						}else {
							this.addloading = true;
						}
						let suburl = '';
						if(this.$route.params.id) {
							suburl = '/admin/lesson/' + this.$route.params.id + '/update'
						} else {
							suburl = '/admin/lesson'
						}
						this.ruleForm.learning = [];
						// 将输入框上绑定的值赋给ruleForm.learning，作为提交数据,并且去掉为空的数据
						for(let i = 0; i < this.learnInput.length; i++) {
							if(this.learnInput[i] != ''){
								this.ruleForm.learning.push(this.learnInput[i]);
							} 
						};
						console.log(this.ruleForm)
						axios.post(suburl, this.ruleForm)
							.then((res) => {
								if(res.data.status) {
									this.$message.success(res.data.message);
									this.$router.push({
										name: 'teachtask'
									});
								} else {
									this.$message.warning(res.data.message);
								}
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 标题不允许空格
			checkname(value) {
				if(value) {
					this.$nextTick(() => {
						this.ruleForm.name = this.$valid.noK(value)
					});
				}
			},
			// 副标题不允许空格
			checktitle(value) {
				if(value) {
					this.$nextTick(() => {
						this.ruleForm.title = this.$valid.noK(value)
					});
				}
			},
			checkNoprice(value) {
				if(value) {
					this.$nextTick(() => {
						this.ruleForm.price = this.$valid.nolyNorD(value)
					});
				}
			},
			// 更新富文本内容，实现双向数据绑定
			updateData: function(data) {
				// sync content to component
				this.ruleForm.for = data
			},
			updateDatad: function(data) {
				// sync content to component
				this.ruleForm.describle = data
			},

			charamount_sss() {
				if(this.ruleForm.type == 2) {
					this.charaxiy = true
				} else {
					this.charaxiy = false
				}
				if(this.ruleForm.type == 3) {
					this.charvip = true
				} else {
					this.charvip = false
				}
			},
			//选择完模板后，将对应的模板id传入模板去获取对应的模板内容
			notebuygo() {
				for(let i in this.educations) {
					if(this.educations[i].id == this.ruleForm.educational_id) {
						this.educations_content = this.educations[i].content;
					}
				}
			},
			free_video(index) {
				if(this.sections[index].is_free) {
					this.sections[index].is_free = 0
				} else {
					this.sections[index].is_free = 1
				}
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
					if(this.$route.params.id) {
						this.$parent.man_one = true
						this.$parent.man_two = false
						this.$parent.man_three = false
					}else{
						window.history.go(-1)
					}
				}
			},
			handleAvatarSuccess(res, file) {
				// this.ruleForm.pictrue = URL.createObjectURL(file.raw);
				this.ruleForm.pictrue = res;
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
			// 点击添加之后增加往ruleForm.learning增加一个空置，等同于增加一个空的输入框  增加的输入框上的v-modal用于绑定数值
			acquireadd() {
				// alert(this.ruleForm.learning.length)
				for(let i = 0; i < this.ruleForm.learning.length; i++){
					// alert(this.learnInput[i])
					if(this.learnInput[i] == '' || this.learnInput[i] == undefined){
						this.learnTF = true;
						break;
					}else {
						this.learnTF = false;
					}
				}
				// alert(this.learnTF)
				if(this.learnTF){
					this.$message.warning("请填写完后再添加")
				}else {
					this.ruleForm.learning.push('');
					// this.learnInput.push('');
				}
			 
				// console.log(this.learnInput);
			},
			handleIconClick(index) {
				this.ruleForm.learning.splice(index, 1);
				this.learnInput.splice(index, 1);
			},
			//获取栏目列表
			getNavlist() {
				return axios.get('/admin/nav/lists')
			},
			//获取分类列表
			getGenrelist() {
				return axios.get('/admin/genre/lists')
			},
			//获取购买模板列表
			getTemplatelist() {
				return axios.get('/admin/education/lists')
			},
			//获取讲师列表
			getTeacherlist() {
				return axios.get('/admin/teacher/lists')
			},
			//获取课程名称列表（用于检验是否课程名重复）
			getLessonNames() {
				return axios.get('/admin/lesson/names')
			},
			// 执行axios并发回调
			getAll(id) {
				if(this.$route.params.id){
					this.$parent.loading = true;
				}else {
					this.addloading = true;
				}
				axios.all([this.getNavlist(), this.getGenrelist(), this.getTemplatelist(), this.getTeacherlist(),this.getLessonNames()])
					.then(axios.spread((navs, genres, educations, teachers,lesson_names) => {
						// 多个请求现在都执行完成
						// 编辑页面的时候赋值
						if(this.$route.params.id) {
							this.ruleForm.name = this.data.name; //标题
							this.ruleForm.title = this.data.title; //副标题
							this.ruleForm.nav_id = this.data.nav.id; //栏目id
							for(let i = 0; i < this.data.genres.length; i++) {
								this.ruleForm.genre_ids.push(this.data.genres[i].id); //栏目id
							};
							//收费类型
							if(this.data.type == '免费课程') {
								this.ruleForm.type = 1
							}
							if(this.data.type == '付费课程') {
								this.ruleForm.type = 2
								this.ruleForm.price = this.data.price; //课程价格
							}
							if(this.data.type == 'VIP课程') {
								this.ruleForm.type = 3
							}
							if(this.ruleForm.type == 2) {
								this.charaxiy = true
							} else {
								this.charaxiy = false
							}
							if(this.ruleForm.type == 3) {
								this.charvip = true
							} else {
								this.charvip = false
							}
							// this.ruleForm.type = this.data.type; 
							// alert(this.ruleForm.type)
							if(this.data.educational) {
								this.ruleForm.educational_id = this.data.educational.id //模板id
							}
							for(let i = 0; i < this.data.sections.length; i++) {
								if(this.data.sections[i].is_free == 1) {
									this.ruleForm.is_frees.push(this.data.sections[i].id); //章节id
								}
							};
							this.ruleForm.pictrue = this.data.pictrue; //封面图片地址

							this.ruleForm.learning.length = this.data.learning.length;
							this.learnInput = this.data.learning;
						
							this.ruleForm.for = this.data.for; //适用人群
							this.ruleForm.teacher_id = this.data.teacher.id; //教师id
							this.ruleForm.describle = this.data.describle //课程描述、
							this.ruleForm.status = this.data.status //目前调试接口，要传，等后台修改之后，就可以删掉
						}else{
							// console.log(this.lesson_names)
							this.lesson_names = lesson_names.data
						}
						// console.log('栏目列表',navs);
						this.navs = navs.data;
						// console.log('分类列表',genres);
						this.genres = genres.data;
						// console.log('模板列表',educations);
						this.educations = educations.data;
						// console.log('讲师列表',teachers);
						this.teachers = teachers.data;

						this.$parent.loading = false;
						this.addloading = false;
					}))
			}
		},
		mounted() {
			if(this.data){
				this.lesson_names = this.data.lesson_names;
			}
			let id = this.$route.params.id;
			this.getAll(id);
			// this.getGenreslist()
			// console.log(this.lesson_names)
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
.vue-html5-editor>.toolbar>ul>li .fa-arrows-alt,.vue-html5-editor>.toolbar>ul>li .fa-info{display:none}
.manage_first{height:110px;padding:20px;border:1px solid #e3e3e3;border-radius:4px}
.manage_second{height:90px;padding:10px 0 0 5px;border-bottom:1px solid #e3e3e3}
.manage_first>.el-col>img{height:70px}
.manage_first_right{line-height:70px;text-align:right}
.manage_first_title{display:inline-block;vertical-align:top;margin-top:.5rem;margin-left:.5rem}
.manage_first_title>h1{font-size:18px;display:inline-block}
.manage_first_title>span{border-radius:2px;color:#fff;padding:5px;margin-left:.5rem;vertical-align:super}
.manage_first_title>p{color:#999;font-size:14px;margin-top:.5rem}
.manage_first_title>h3{font-size:17px;font-weight:initial}
.form_p_g{color:#888}
.form_input_g{width:430px}
.form_input_for{width:430px;display:block}
.form_input_inner{width:214px}
.el-form-item__error{position:relative}
.avatar-uploader_inofor .el-upload{border:1px dashed #d9d9d9;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}
.avatar-uploader_inofor .el-upload:hover{border-color:#409EFF}
.avatar-uploader-icon_inofor{font-size:28px;color:#8c939d;width:278px;height:278px;line-height:278px;text-align:center}
.avatar_inofor{width:480px;height:270px;display:block}
.course_first{height:46px;line-height:46px;border:1px solid #e3e3e3;border-radius:2px;padding:0 20px;font-size:16px;background:#F5F5F5}
.cursor .el-input.is-disabled .el-input__icon{cursor:pointer}
.form_p_g{color:#888}
.form_input_g{width:430px}
.form_input_inner{width:214px}
.el-form-item__error{position:relative}
.freelook{width:450px;height:250px;overflow-x:hidden;border:1px solid #e3e3e3}
.el-checkbox{display:block;padding:5px 10px;border-bottom:1px solid #e3e3e3}
.el-checkbox+.el-checkbox{margin-left:0}
.freelook_span{font-size:12px;color:#fff;margin-left:4rem;padding:5px;border-radius:4px;background-color:#ffac30}
.box-card{width:60%}
.box-card *{margin:0;padding:0;line-height:1}
.box-card .el-card__body{padding:20px}
.el-card{box-shadow:none}
.learninginp>label:before{content:'*';color:#fa5555;margin-right:4px}
</style>