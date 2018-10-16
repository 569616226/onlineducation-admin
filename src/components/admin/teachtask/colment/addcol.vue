<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="resetForm('ruleForm')"></i> {{$route.meta.title}}
		</div>
		<el-form @submit.native.prevent v-loading="loading" class="margin-top-lg" :label-position="labelPosition" label-width="130px" :model="ruleForm" ref="ruleForm" :rules="rules">
			<el-form-item prop="imageUrl" class="margin-left-lg" label="分类图标">
				<el-upload name="image" :headers="uploadheaders" class="avatar-uploader" :action="uploadimgurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				<p class="form_p_g">只能上传jpg/png文件，且不超过1MB，图片尺寸要在250x250px。</p>
			</el-form-item>

			<el-form-item prop="coltitle" class="margin-left-lg margin-top must" label="分类标题">
				<el-input class="form-input-h" v-model="ruleForm.coltitle" placeholder="请输入"></el-input>
				<p class="form_p_g">为分类起个响亮的名字吧！</p>
			</el-form-item>
			
			<el-form-item class="margin-left-lg margin-top" label="分类类型" prop="type">
				<el-radio-group v-model="ruleForm.type">
					<el-radio :label="0">课程分类</el-radio>
					<el-radio :label="1">会销分类</el-radio>
				</el-radio-group>
				<p class="form_p_g">选择分类的类型后，在编辑分类，选择首页推荐会依据现在的类型显示对应类别的数据</p>
			</el-form-item>

			<el-form-item class="margin-left-lg margin-top" label="视频排序" prop="videosort">
				<el-radio-group v-model="ruleForm.videosort">
					<el-radio :label="1">最新更新时间排序</el-radio>
					<el-radio :label="2">播放视频次数排序</el-radio>
				</el-radio-group>
				<p class="form_p_g">更新时间：按最新更新时间排序；播放次数：按最多播放次数排序</p>
			</el-form-item>

			<el-form-item class="margin-left-lg margin-top" label="首页推荐" prop="openIndex">
				<el-radio-group v-model="ruleForm.openIndex">
					<el-radio :label="0">开启</el-radio>
					<el-radio :label="1">关闭</el-radio>
				</el-radio-group>
				<p class="form_p_g">启动后，可以设置分类在首页推荐的课程/活动</p>
				<div v-if="ruleForm.type == 0">
					<div class="colrecom_form" v-for="(item,index) in ruleForm.show_data">
						<img :src="item.pictrue" />
						<p>{{item.name}}</p>
						<i class="el-icon-error cursor" @click="deleteshowvideo(item,index)"></i>
					</div>
					<div v-if="ruleForm.openIndex == 0 && video_select">
						<div class="colrecom_form_add cursor" @click="addclassvideo">
							<i class="el-icon-plus avatar-uploader-icon"></i>
							<p>添加课程</p>
						</div>
						<p class="form_p_g">选择在首页展示的关联分类的课程/活动，为了保证良好的用户体验，建议每个栏目推荐的视频不多余4个</p>
					</div>
				</div>
				<div v-if="ruleForm.type == 1">
					<div class="colrecom_form" v-for="(item,index) in ruleForm.show_data_h">
						<img :src="item.pic" />
						<p>{{item.name}}</p>
						<i class="el-icon-error cursor" @click="deleteshowvideo_h(item,index)"></i>
					</div>
					<div v-if="ruleForm.openIndex == 0 && video_select">
						<div class="colrecom_form_add cursor" @click="addclassvideo_h">
							<i class="el-icon-plus avatar-uploader-icon"></i>
							<p>选择活动</p>
						</div>
					</div>
				</div>
			</el-form-item>

			<el-form-item class="text-center margin-top-lg">
				<el-button :disabled="loading" type="primary" @click="submitForm('ruleForm')">提交</el-button>
				<el-button @click="resetForm('ruleForm')">返回</el-button>
			</el-form-item>
		</el-form>
		<!--选择视频-->
		<el-dialog title="选择视频" :visible.sync="previewcol" class="previewcol">
			<div class="select_show_video">
				<el-input placeholder="请输入内容" @keyup.enter.native="search_fi()" v-model="search_video" class="input-with-select input_search_video margin-bottom-sm">
					<el-button @click="search_fi()" slot="append">搜索</el-button>
				</el-input>
				<span class="span_search_video"><span class="red">**</span>只显示与标签相关联的视频</span>
				<div class="colrecom_form cursor" v-for="(item,index) in data.slice(nowG,nowG+6)" @click="clickshowvideo(item,index)">
					<img :src="item.pictrue" />
					<p>{{item.name}}</p>
				</div>
				<p class="form_p_g"></p>
				<div class="block show_page">
					<el-pagination @current-change="handleCurrentChange" :current-page.sync="nowPage" :page-size="pagesize_v" layout="prev, pager, next, total" :total="total_v">
					</el-pagination>
					<!-- :current-page="nowPage" 当前页面 -->
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="previewcol = false">关 闭</el-button>
			</div>
		</el-dialog>
		<!--选择活动-->
		<el-dialog title="选择活动" :visible.sync="previewcol_h" class="previewcol">
			<div class="select_show_video">
				<el-input placeholder="请输入内容" @keyup.enter.native="search_fi_h()" v-model="search_video_h" class="input-with-select input_search_video margin-bottom-sm">
					<el-button @click="search_fi_h()" slot="append">搜索</el-button>
				</el-input>
				<span class="span_search_video">
					<span class="red">**</span>显示已上架的所有活动</span>
				<div class="colrecom_form cursor" v-for="(item,index) in data_h.slice(nowG_h,nowG_h+6)" @click="clickshowvideo_h(item,index)">
					<img :src="item.pic" />
					<p>{{item.name}}</p>
				</div>
				<p class="form_p_g"></p>
				<div class="block show_page">
					<el-pagination @current-change="handleCurrentChange_h" :current-page.sync="nowPage_h" :page-size="pagesize_v_h" layout="prev, pager, next, total"
						:total="total_v_h">
					</el-pagination>
					<!-- :current-page="nowPage" 当前页面 -->
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="previewcol_h = false">关 闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 初始数据(用于搜索对比的)
				datafirst: [],
				// 搜索或者翻页后的操作数据
				data: [],
				// 初始数据(用于搜索对比的)
				datafirst_h: [],
				// 搜索或者翻页后的操作数据
				data_h: [],
				labelPosition: 'right',
				nav_names: [],
				ruleForm: {
					imageUrl: '',
					coltitle: '',
					show_data: [], //选择了推荐的栏目课程的信息集合
					show_data_h: [],
					lesson_ids: [], //选择了推荐的栏目课程的id集合,
					trains_ids: [],
					videosort: null,
					openIndex: null,
					type: null
				},
				rules: {
					imageUrl: [{
						required: true,
						message: '请选择栏目图标',
						trigger: 'blur'
					}],
					coltitle: (rule, value, callback) => {
						if(!value) {
							return callback(new Error('栏目名称不能为空'));
						}else {
							callback();
						}
					},
					videosort: [{
						type: 'number',
						required: true,
						message: '请选择视频排序',
						trigger: 'blur'
					}],
					type: [{
						type: 'number',
						required: true,
						message: '请选择类型',
						trigger: 'blur'
					}],
					openIndex: [{
						type: 'number',
						required: true,
						message: '请选择首页推荐',
						trigger: 'blur'
					}]
				},
				loading: false,
				previewcol: false,
				resetdata: false,
				video_select: false,
				//上传头像请求地址的头部信息
				uploadheaders: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + window.localStorage.getItem('jwt_token')
				},
				uploadimgurl: this.$uploadimgurl,
				search_video: '',
				// 分页功能
				pagesize_v: 6, //每页个数   number类型
				total_v: 0, //总个数	 number类型
				nowPage: 1, //当前页数
				nowG: 0, //当前页面的第一个是全部数据中的第几个（默认是第一个）
				previewcol_h: false,
				search_video_h: '',
				// 分页功能
				pagesize_v_h: 6, //每页个数   number类型
				total_v_h: 0, //总个数	 number类型
				nowPage_h: 1, //当前页数
				nowG_h: 0, //当前页面的第一个是全部数据中的第几个（默认是第一个）
			}
		},
		methods: {
			//搜索
			search_fi() {
				this.data = [];
				for(var i in this.datafirst) {
					if(this.datafirst[i].name.toLowerCase().indexOf(this.search_video.toLowerCase()) !== -1) {
						this.data.push(this.datafirst[i])
					}
				}
				this.total_v = this.data.length;
				this.nowPage = 1; //搜索完之后把当前页数跳转到第一页
			},
			handleCurrentChange(val) {
				this.nowG = (val - 1) * 6;
			},
			//搜索活动
			search_fi_h() {
				this.data_h = [];
				for (var i in this.datafirst_h) {
					if (this.datafirst_h[i].name.toLowerCase().indexOf(this.search_video_h.toLowerCase()) !== -1) {
						console.log(i, ":", this.datafirst_h[i]);
						this.data.push(this.datafirst_h[i])
					}
				}
				this.total_v_h = this.data_h.length;
				this.nowPage_h = 1; //搜索完之后把当前页数跳转到第一页
			},
			handleCurrentChange_h(val) {
				this.nowG_h = (val - 1) * 6;
			},
			//获取编辑页面基础数据 
			getdata() {
				this.loading = true;
				let id = this.$route.params.id;
				axios.get('/admin/nav/' + id)
					.then((res) => {
						console.log(res)
						this.ruleForm.imageUrl = res.data.nav.pictrue; //当前栏目的图片
						this.ruleForm.coltitle = res.data.nav.name; //当前栏目的名称
						this.ruleForm.videosort = res.data.nav.order_type; //当前栏目设置的顺序类型
						this.ruleForm.openIndex = res.data.nav.is_hide; //首页推荐开关
						this.ruleForm.type = res.data.nav.type;
						if(res.data.nav.lessons){
							this.datafirst = res.data.nav.lessons;
							this.data = res.data.nav.lessons;
							this.total_v = this.datafirst.length;
							this.ruleForm.show_data = res.data.nav.lessons_is_nav;
						}else{
							// 赋值活动列表数据
							this.datafirst_h = res.data.nav.trains;
							this.data_h = res.data.nav.trains;
							// 赋值分页个数
							this.total_v_h = this.datafirst_h.length;
							this.ruleForm.show_data_h = res.data.nav.trains_is_nav
						}
						this.nav_names = res.data.nav_names
						this.loading = false;

					})
					.catch((error) => {
						console.log('获取编辑页面基础数据报错', error);
					})
				//判断当this.$route.params.id存在，说明就是进入编辑页面

			},
			//提交表单
			submitForm(formName) {
				let id = this.$route.params.id;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let suburl = ''
						if(id) {
							suburl = '/admin/nav/' + id + '/update'
						} else {
							suburl = '/admin/nav'
						}
						this.loading = true;
						if(this.ruleForm.type == 0){
							for(let g = 0; g < this.ruleForm.show_data.length; g++) {
								this.ruleForm.lesson_ids.push(this.ruleForm.show_data[g].id);
							}
						}else{
							for (let i = 0; i < this.ruleForm.show_data_h.length; i++) {
								this.ruleForm.trains_ids.push(this.ruleForm.show_data_h[i].id);
							}
						}
						axios.post(suburl, {
								name: this.ruleForm.coltitle,
								pictrue: this.ruleForm.imageUrl,
								order_type: this.ruleForm.videosort,
								type: this.ruleForm.type,
								nav_lesson_ids: this.ruleForm.lesson_ids,
								nav_train_ids: this.ruleForm.trains_ids,
								is_hide: this.ruleForm.openIndex
							})
							.then((res) => {
								if(res.data.status) {
									this.$message.success(res.data.message);
									this.$router.push({
										name: 'colment'
									});
								} else {
									this.$message.warning(res.data.message);
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

			//判断如果是编辑页面就显示选择推荐视频的区域，新建则不显示
			videoselect() {
				let id = this.$route.params.id;
				if(id) {
					this.video_select = true
				} else {
					this.video_select = false
				}
			},
			handleAvatarSuccess(res, file) {
				// this.ruleForm.imageUrl = URL.createObjectURL(file.raw);
				this.ruleForm.imageUrl = res;
			},
			beforeAvatarUpload(file) {
				let isJPGorPNG = false;
				if(file.type === 'image/jpeg' || file.type === 'image/png') {
					isJPGorPNG = true;
				}
				const isLt1M = file.size / 1024 / 1024 < 1;
				if(!isJPGorPNG) {
					this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
				}
				if(!isLt1M) {
					this.$message.error('上传头像图片大小不能超过 1MB!');
				}
				return isJPGorPNG && isLt1M;
			},
			addclassvideo() {
				this.previewcol = true
			},
			addclassvideo_h() {
				this.previewcol_h = true
			},
			clickshowvideo(row, index) {
				// 点击添加到推荐的数据组中
				this.ruleForm.show_data.push(row);
				// 把未推荐的数据组中去掉点击选中的数据
				this.datafirst.splice(this.nowG + index, 1);
				// 重置条数
				this.total_v = this.datafirst.length;
				this.previewcol = false
			},
			clickshowvideo_h(row, index) {
				// 点击添加到推荐的数据组中
				this.ruleForm.show_data_h.push(row);
				// 把未推荐的数据组中去掉点击选中的数据
				this.datafirst_h.splice(this.nowG_h + index, 1);
				// 重置条数
				this.total_v_h = this.datafirst_h.length;
				this.previewcol_h = false;
			},
			deleteshowvideo(row, index) {
				this.$confirm('真的要删除此课程吗？', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// this.data.push(row);
					this.datafirst.push(row);
					this.ruleForm.show_data.splice(index, 1);
					this.total_v = this.datafirst.length;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {

				})
			},
			deleteshowvideo_h(row, index) {
				this.$confirm('真的要删除此活动吗？', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.datafirst_h.push(row);
					this.ruleForm.show_data_h.splice(index, 1);
					this.total_v_h = this.datafirst_h.length;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {

				})
			}
		},

		mounted: function() {
			if(this.$route.params.id) {
				this.getdata();
			} else {
				this.loading = true;
				axios.get('/admin/nav/names')
					.then((res) => {
						this.nav_names = res.data
						this.loading = false;
					})
					.catch((error) => {
						console.log(error);
						this.loading = false;
					});
			}
			this.videoselect()

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
	.form-input-h {
		width: 400px
	}
	
	.form_p_g {
		font-size: 14px;
		color: #888;
		clear: both
	}
	
	.tree-box {
		margin-top: 10px;
		border: 1px solid #E3E3E3;
		border-radius: 4px;
		width: 800px;
		padding: 10px;
		min-height: 220px
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
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center
	}
	
	.avatar {
		width: 100px;
		height: 100px;
		display: block
	}
	
	.colrecom_form {
		width: 200px;
		border: 1px solid #ccc;
		line-height: initial;
		display: inline-block;
		position: relative;
		margin: 0 15px 1rem 0;
		float: left;
		height: 141px;
		border-radius: 4px
	}
	
	.colrecom_form_add {
		width: 200px;
		border: 1px dotted #ccc;
		line-height: initial;
		display: inline-block;
		position: relative;
		margin: 0 15px 1rem 0;
		float: left;
		height: 141px;
		text-align: center;
		border-radius: 4px
	}
	
	.colrecom_form_add>.el-icon-plus {
		height: 80px
	}
	
	.colrecom_form>img {
		width: 100%
	}
	
	.colrecom_form>p {
		line-height: normal;
		text-align: center;
		padding: 0 3px;
		word-wrap: normal;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		text-align: justify
	}
	
	.colrecom_form>.el-icon-error {
		color: #ff7043;
		position: absolute;
		top: -7px;
		right: -7px;
		font-size: 18px
	}
	
	.input_search_video {
		width: 50%
	}
	
	.span_search_video {
		color: #888;
		margin-left: 5%
	}
	
	.select_show_video {
		width: 685px;
		margin: 0 auto
	}
	
	.show_page {
		margin-top: 2rem;
		text-align: center
	}
</style>