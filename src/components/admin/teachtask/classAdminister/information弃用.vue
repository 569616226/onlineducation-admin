<template>
	<div v-loading="loading">
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" @submit.native.prevent label-width="120px" class="demo-ruleForm margin-top-lg margin-left-lg">
			

			<el-form-item label="标题" prop="name">
				<el-input v-model="ruleForm.name" :maxlength="20" class="form_input_g" placeholder="请输入" @input="checkname"></el-input>
				<p class="form_p_g">开启后，才能使用和设置相关会员的功能</p>
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
					<el-input v-model="ruleForm.price" :maxlength="7"  @input="checkNoprice" class="form_input_inner" placeholder="0.00"></el-input>
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
				<p class="form_p_g">你可以上传jpg, gif, png格式的文件, 图片建议尺寸为480x270。文件大小不能超过1M。</p>
			</el-form-item>


			<el-form-item label="你可以学到" prop="acquires">
				<el-input disabled v-for="(acquire,index) in ruleForm.learning" :key="acquire"  :value="acquire" class="form_input_for margin-bottom-sm cursor">
					<i class="el-icon-close el-input__icon" slot="suffix" @click="handleIconClick(index)"></i>
				</el-input>
				<el-input placeholder="请输入内容" v-model="acquire" class="form_input_g">
					<el-button slot="append" @click="acquireadd">添加</el-button>
				</el-input>
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
		data() {
			return {
				bid : this.$route.params.id,   //用于标记是不是编辑页面，bid存在就证明是编辑页面
				data:{}, //当前被编辑的课程信息
				navs: [],//栏目列表
				genres: [],//分类列表
				educations: [], //模板列表
				educations_content:'',//模板内容,
				teachers: [], //讲师列表
				sections: [], //章节列表
				acquire: '',  //存放添加的你可以学到什么的数据
				loading: false, 
				resetdata:'',
				//提交表单的数据
				ruleForm: {
					name: '',  //标题
					title: '', //副标题
					nav_id: null,//选中的栏目
					genre_ids: [],//选中的分类（可多选）
					type:null, //收费类型
					price:0, 	//课程价格，默认为0
					educational_id: null, //选中的购买模板
					is_frees: [],   //免费试看的章节（设置那些可以免费看的章节的id）(只有在编辑页面的时候才有)
					pictrue: '',  //课程封面
					learning: [], //你可以学到什么的数据集合
					// learning: [], 
					for:'',  //适用人群
					teacher_id:'',  //选中的讲师
					describle:'',   //课程介绍
					status: 1, //课程状态（1.未上架，2.已下架，3.已上架）默认为1
					
				},
				//上传图片封面请求地址的头部信息
				uploadheaders: {
					Accept:'application/json',
					Authorization:'Bearer ' + window.localStorage.getItem('jwt_token')
				},
				uploadimgurl:this.$uploadimgurl,
				charaxiy: false, //判断是否显示购买价格和购买模板的标记
				charvip: false,  //判断是否显示vip勾选章节的标记
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
					learning: [{
						type: 'array',
						required: true,
						message: '请输入你可以学到什么',
						trigger: 'submit'
					}],
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
						this.loading = true;
						let suburl = '';
						if(this.$route.params.id) {
							suburl = '/admin/lesson/'+ this.$route.params.id +'/update'
						}else {
							suburl = '/admin/lesson'
						}
						axios.post(suburl,this.ruleForm)
						.then((res) => {
							if(res.data.status) {
								this.$message.success(res.data.message);
								this.$router.push({name: 'teachtask'});
							}else {
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
			updateData: function (data) {
                // sync content to component
                this.ruleForm.for = data
            },
            updateDatad: function (data) {
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
					if(this.educations[i].id == this.ruleForm.educational_id){
						this.educations_content = this.educations[i].content;
					}
				}
			},
			free_video(index){
				if(this.sections[index].is_free){
					this.sections[index].is_free = 0
				}else{
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
					window.history.go(-1)
				}
			},
			handleAvatarSuccess(res, file) {
				// this.ruleForm.pictrue = URL.createObjectURL(file.raw);
				this.ruleForm.pictrue = res;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg' || 'image/png';
				const isLt1M = file.size / 1024 / 1024 < 1;

				if(!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if(!isLt1M) {
					this.$message.error('上传头像图片大小不能超过 1MB!');
				}
				return isJPG && isLt1M;
			},
			acquireadd() {
				let that = this
				if(this.acquire == ''){
					this.$message.warning('不能为空')
				}else {
					this.ruleForm.learning.push(that.acquire);
					this.acquire = ''
				}
				
			},
			handleIconClick(index){
				this.ruleForm.learning.splice(index, 1)
			},
			//被编辑的当前课程信息
			getNowdata(id) {
				if(id){
					return axios.get('/admin/lesson/'+ id);
				}else {
					return '';
				}
				
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
			//获取课程下的章节列表（只有在编辑页面才有）(需要传入被编辑的课程的id)
			getSectionlist(id) {
				if(id){
					return axios.get('/admin/lesson/'+ id +'/section/lists');
				}else {
					return  '';
				}
				// 
			},
			// 执行axios并发回调
			getAll(id) {
				this.loading = true;
				axios.all([this.getNowdata(this.$route.params.id),this.getNavlist(), this.getGenrelist(), this.getTemplatelist(),this.getTeacherlist(),this.getSectionlist(id)])
					  .then(axios.spread((nowdata,navs, genres,educations,teachers,sections) => {
					    // 多个请求现在都执行完成
					    // 编辑页面的时候赋值
					    if(nowdata != ''){
					    	this.ruleForm.name = nowdata.data.name;   //标题
					    	this.ruleForm.title = nowdata.data.title;   //副标题
					    	this.ruleForm.nav_id = nowdata.data.nav.id;   //栏目id
					    	for(let i = 0; i < nowdata.data.genres.length; i++){
					    		this.ruleForm.genre_ids.push(nowdata.data.genres[i].id); //栏目id
					    	};
					    	 //收费类型
					    	if(nowdata.data.type == '免费课程') {
					    		this.ruleForm.type = 1
					    	}
					    	if(nowdata.data.type == '付费课程') {
				    			this.ruleForm.type = 2
					    	}
					    	if(nowdata.data.type == 'vip课程') {
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
					    	// this.ruleForm.type = nowdata.data.type; 
					    	// alert(this.ruleForm.type)
					    	this.ruleForm.price = nowdata.data.price; //课程价格
					    	if(nowdata.data.educational) {
					    		this.ruleForm.educational_id = nowdata.data.educational.id  //模板id
					    	}
					    	for(let i = 0; i < nowdata.data.sections.length; i++){
					    		if(nowdata.data.sections[i].is_free == 1){
					    			this.ruleForm.is_frees.push(nowdata.data.sections[i].id); //章节id
					    		}
					    	};
					    	this.ruleForm.pictrue = nowdata.data.pictrue;  //封面图片地址
					    	for(let i = 0; i < nowdata.data.learning.length; i++){
				    			this.ruleForm.learning.push(nowdata.data.learning[i]); //可以学到什么
					    	};
					    	this.ruleForm.for = nowdata.data.for;   //适用人群
					    	this.ruleForm.teacher_id = nowdata.data.teacher.id;  //教师id
					    	this.ruleForm.describle = nowdata.data.describle    //课程描述、
					    	this.ruleForm.status = nowdata.data.status     //目前调试接口，要传，等后台修改之后，就可以删掉
					    }
					    // console.log('栏目列表',navs);
					    this.navs = navs.data;
					    // console.log('分类列表',genres);
					    this.genres = genres.data;
					    // console.log('模板列表',educations);
					    this.educations = educations.data;
					     // console.log('讲师列表',teachers);
					    this.teachers = teachers.data;
					    // console.log('章节列表',sections);
					    this.sections = sections.data;


					    this.loading = false;
					  }))
			}
		},
		mounted(){
			let id = this.$route.params.id;
			this.getAll(id);
			// this.getGenreslist()
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
<style>
	/*富文本样式*/
	.vue-html5-editor>.toolbar>ul>li .fa-arrows-alt, .vue-html5-editor>.toolbar>ul>li .fa-info{
		display: none;
	}
	.manage_first {
		height: 110px;
		padding: 20px;
		border: 1px solid #e3e3e3;
		border-radius: 4px;
	}
	
	.manage_second {
		height: 90px;
		padding: 10px 0px 0px 5px;
		border-bottom: 1px solid #e3e3e3;
	}
	
	.manage_first>.el-col>img {
		height: 70px;
	}
	
	.manage_first_right {
		line-height: 70px;
		text-align: right;
	}
	
	.manage_first_title {
		display: inline-block;
		vertical-align: top;
		margin-top: .5rem;
		margin-left: .5rem;
	}
	
	.manage_first_title>h1 {
		font-size: 18px;
		display: inline-block;
	}
	
	.manage_first_title>span {
		border-radius: 2px;
		color: #ffffff;
		padding: 5px;
		margin-left: .5rem;
		vertical-align: super;
	}
	
	.manage_first_title>p {
		color: #999999;
		font-size: 14px;
		margin-top: .5rem;
	}
	
	.manage_first_title>h3 {
		font-size: 17px;
		font-weight: initial;
	}
	
	.form_p_g {
		color: #888888;
	}
	
	.form_input_g {
		width: 430px;
	}
	
	.form_input_for {
		width: 430px;
		display: block;
	}
	
	.form_input_inner {
		width: 214px;
	}
	
	.el-form-item__error {
		position: relative;
	}
	
	.avatar-uploader_inofor .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader_inofor .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon_inofor {
		font-size: 28px;
		color: #8c939d;
		width: 278px;
		height: 278px;
		line-height: 278px;
		text-align: center;
	}
	
	.avatar_inofor {
		width: 480px;
		height: 270px;
		display: block;
	}
	.course_first {
		height: 46px;
		line-height: 46px;
		border: 1px solid #e3e3e3;
		border-radius: 2px;
		padding: 0 20px;
		font-size: 16.0px;
		background: #F5F5F5;
	}
	.cursor .el-input.is-disabled .el-input__icon {
		cursor: pointer;
	}
	.form_p_g {
		color: #888888;
	}
	
	.form_input_g {
		width: 430px;
	}
	
	.form_input_inner {
		width: 214px;
	}
	
	.el-form-item__error {
		position: relative;
	}
	
	
	.freelook {
		width: 450px;
		height: 250px;
		overflow-x: hidden;
		border: 1px solid #e3e3e3;
	}
	
	.el-checkbox {
		display: block;
		padding: 5px 10px;
		border-bottom: 1px solid #e3e3e3;
	}
	
	.el-checkbox+.el-checkbox {
		margin-left: 0;
	}
	
	.freelook_span {
		font-size: 12px;
		color: #fff;
		margin-left: 4rem;
		padding: 5px;
		border-radius: 4px;
		background-color: #ffac30;
	}
	.box-card {
		width: 60%; 
	}
	.box-card * {
		margin:0;
		padding: 0;
		line-height: 1;
	}
	.box-card .el-card__body {
		padding: 20px;
	}
	.el-card {
		box-shadow: none;
	}
</style>