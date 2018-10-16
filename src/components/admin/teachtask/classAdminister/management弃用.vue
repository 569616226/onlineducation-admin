<template>
	<div v-loading="loading">
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" onclick="window.history.go(-1)"></i> {{$route.meta.title}}（{{lesson_e.name}}）
		</div>
		<el-row  class="management_first margin-top-sm">
			<el-col :span="5">
				<el-button type="primary" @click="dialogTableVisible = true">+新建节</el-button>
			</el-col>
			<el-col :span="10" :offset="9" class="management_second">
				<span class="margin-right-sm">节总数：</span><span class="margin-right-sm green">{{sections.length}}</span><span class="margin-right-sm">学习时长：</span><span class="red">{{videotimes}}</span><span class="margin-left-sm">播放次数：</span><span class="blue margin-right-sm">{{ playtimes }}</span>
			</el-col>

			<el-col :span="24" class="margin-top-sm management_first_class" v-for="(section,index) in sections" :key="section.id" :value="section.id">
				<i class="el-icon-erp-icon-ic_ondemand_video"></i><span class="margin-left-sm cursor" @click="videoshow(section)">{{section.name}}（<span v-if="section.video.url[0].duration">{{section.video.url[0].duration}}</span><span v-else>转码中。。。</span>）</span>  
				<div class="management_first_class_children">
					<!-- 这里的编辑是带入整个section对象 -->
					<i class="el-icon-erp-icon-pencil margin-right-sm cursor" @click="editvideo(section , index)">编辑</i>
					<!-- 删除只需要带入章节的id就行了，所以只传入section.id -->
					<i class="el-icon-erp-icon-delete-forever cursor" @click="removevideo(section.id , index)">删除</i>
				</div>
			</el-col>
		</el-row>

		<!--新建节-->
		<el-dialog v-loading="loadingsec" title="新建节" :visible.sync="dialogTableVisible">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
				<el-form-item label="节标题" prop="name">
					<el-input v-model="ruleForm.name" :maxlength="20" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="选择视频" prop="video_name">
					<el-input v-model="ruleForm.video_name" placeholder="请选择" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item>
					<data-tables :data="videos" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters" highlight-current-row @row-click="handleCurrentChange">
						<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
							<el-col :span="24">
								<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索课程" class="class_input_width">
								</el-input>
							</el-col>
						</el-row>
						<el-table-column prop="name" label="视频名称" key="name" sortable="custom">
						</el-table-column>
						<el-table-column prop="created_at" label="上传时间" key="created_at" sortable="custom">
						</el-table-column>
					</data-tables>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
				<el-button @click="dialogTableVisible = false">取 消</el-button>
			</div>
		</el-dialog>


		<!--视频播放-->
		<el-dialog title="视频播放" :visible.sync="dialogvideoVisible" @close="closevideoshow()">
			<div>
				<!-- <video :src="videoshowurl" width="100%" controls="controls">
					Your browser does not support the video tag.
				</video> -->
				<div id="id_test_video" style="width:100%; height:auto;" v-if="dialogvideoVisible" ref="player"></div>
			</div>
		</el-dialog>
		<!--编辑节信息-->
		<el-dialog v-loading="loadingsec" title="编辑节信息" :visible.sync="dialogeditTableVisible">
			<el-form :model="ruleFormedit" :rules="rules" ref="ruleFormedit" label-width="120px" class="demo-ruleForm">
				<el-form-item label="节标题" prop="name">
					<el-input v-model="ruleFormedit.name" :maxlength="20" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="选择视频" prop="video_name">
					<el-input v-model="ruleFormedit.video_name" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item>
					<data-tables :data="videos" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters" highlight-current-row @row-click="edithandleCurrentChange">
						<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
							<el-col :span="24">
								<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索课程" class="class_input_width">
								</el-input>
							</el-col>
						</el-row>
						<el-table-column prop="name" label="视频名称" key="name" sortable="custom">
						</el-table-column>
						<el-table-column prop="created_at" label="上传时间" key="created_at" sortable="custom">
						</el-table-column>
					</data-tables>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="submitFormedit('ruleFormedit')">提 交</el-button>
				<el-button @click="dialogeditTableVisible = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
var TcPlayer = require('../../../common/TcPlayer-module-2.2.0.js');
	export default {
		data() {
			return {
				// 新建章节
				ruleForm: {
					name: '',   //章节标题
					video_id: null,	//视频id
					video_name: null,	//视频名字
					created_at: '',	//视频时间
					video_url: ''//视频地址

				},
				//编辑章节
				ruleFormedit: {
					id:null,      //章节id
					name: '',   //章节标题
					video_id: null,	//视频id
					video_name: null,	//视频名字
					created_at: '',	//视频时间
					video_url: ''//视频地址
				},
				rules: {
					name: [{
						required: true,
						message: '请输入节标题',
						trigger: 'blur'
					}],
					video_name: [{
						required: true,
						message: '请选择视频',
						trigger: 'blur'
					}]
				},
		 
				//当前课程的数据
				lesson_e: {},
 				//章节列表数据
				sections: [],
 				//视频列表数据
				videos : [],
				dialogvideoVisible: false,	 //视频播放模态框标记
				dialogTableVisible: false,   //新建章节模态框标记
				dialogeditTableVisible: false, //编辑章节模态框标记
				videoshowurl: '',
				tableProps: {
					border: false, //去掉边框
					stripe: false //去掉斑马纹
				},
				loading: false,
				loadingsec: false,
				videoloading: false,
				customFilters: [{
					vals: '',
					props: ['name'],
				}],
				paginationDef: {
					pageSize: 5,
					pageSizes: [5, 10, 15]
				},
				videotimes: '',   //总时长
				shareindex: '',
				timesarray: [],    //时间集合数组
				playtimes:0 ,   //总播放次数
			}
		},
		methods: {

			//选择完视频后把新建章节需要提交的数据赋值到ruleForm，用于请求新建章节接口
			handleCurrentChange(val) {
				this.ruleForm.video_id = val.id;
				this.ruleForm.video_name = val.name;
				this.ruleForm.time = val.created_at; 
				// this.ruleForm.video_url = val.url[0].url;
			},
			// 点击编辑模态框
			editvideo(section){
				// section是返回点击编辑章节的对应信息
				this.ruleFormedit.id = section.id;
				this.ruleFormedit.name = section.name;
				this.ruleFormedit.video_id = section.video.id;
				this.ruleFormedit.video_name = section.video.name;
				this.dialogeditTableVisible = true;
		 
			},
			// 选择完视频后把编辑章节需要提交的数据赋值到ruleForm，用于请求编辑章节接口
			edithandleCurrentChange(val) {
				this.ruleFormedit.video_id = val.id;
				this.ruleFormedit.video_name = val.name;
				this.ruleFormedit.time = val.created_at; 
				// this.ruleFormedit.video_url = val.url[0].url;
			},



			//新建章节提交
			submitForm(formName) {
				let that = this
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loadingsec = true;
						this.ruleForm.is_free = 0;   //默认设置成收费，测试接口对接用的，后续后台接口设置默认值后可以去掉
					 	axios.post('/admin/lesson/' + this.$route.params.id + '/section',this.ruleForm)
					 	.then((res) => {
					 		if(res.data.status) {
					 			this.$message.success(res.data.message);
					 			//更新章节列表
					 			axios.get('/admin/lesson/' + this.$route.params.id +'/section/lists')
					 			.then((res) => {
					 				this.sections = res.data;
						 			});
					 				that.ruleForm.name ='';
					 				that.ruleForm.video_name ='';
					 		}else {
					 			this.$message.warning(res.data.message);
					 		}
					 		that.dialogTableVisible = false
					 		this.loadingsec = false;
					 	})
					 	.catch((error) => {
					 		console.log(error);
					 	})
					} else {
						console.log('error submit!!')
						return false;
					}
				})
			},


			//编辑章节提交
			submitFormedit(formName) {
				let that = this
				let index = this.shareindex
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loadingsec = true;
						this.ruleForm.is_free = 0;   //默认设置成收费，测试接口对接用的，后续后台接口设置默认值后可以去掉
						axios.post('/admin/lesson/section/' + this.ruleFormedit.id + '/update',this.ruleFormedit)
					 	.then((res) => {
					 		if(res.data.status) {
					 			this.$message.success(res.data.message);
					 			//更新章节列表
					 			axios.get('/admin/lesson/' + this.$route.params.id +'/section/lists')
					 			.then((res) => {
					 				this.sections = res.data;
					 			})
					 		}else {
					 			this.$message.warning(res.data.message);
					 		}
					 		this.loadingsec = false;
					 		that.dialogeditTableVisible = false
					 	})
					 	.catch((error) => {
					 		console.log(error);
					 	})
					} else {
						console.log('error submit!!')
						return false;
					}
				})
			},
			// 点击播放视频模态框
			videoshow(vid) {
				this.dialogvideoVisible = true
				this.videoshowurl = vid.video.url[vid.video.url.length - 1].url;
				this.$nextTick(function(){
					let player = new TcPlayer.TcPlayer.TcPlayer('id_test_video', {
						"m3u8": this.videoshowurl, //请替换成实际可用的播放地址
						"width": 900, //视频的显示宽度，请尽量使用视频分辨率宽度
						"height": 500, //视频的显示高度，请尽量使用视频分辨率高度
						"volume": '0.5',
					})
				})
				
			},
			closevideoshow() {
				this.videoshowurl = '';
			},
			removevideo(id,index) {
				this.$confirm('真的要删除内容吗？', '删除', {
					confirmButtonText: '删除',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.loading = true;
					 axios.get('/admin/lesson/section/'+ id +'/delete')
					 .then((res) => {
					 	if(res.data.status){
					 		this.sections.splice(index, 1);
					 		this.$message.success(res.data.message);
					 		this.loading = false;
					 	}else{
					 		this.$message.warning(res.data.message);
					 	}
					 })
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			
 
			// 计算总时长
			addTimes(timesarray){
				// this.videotimes = null;
				let h = null;
				let m = null;
				let s = null;
				let nh = null;
				let nm = null;
				let ns = null;
				for(let i = 0; i < timesarray.length; i++){
					// alert(typeof timesarray[i].split('时')[0])
					h += parseInt(timesarray[i].split('时')[0]);
					m += parseInt(timesarray[i].split('时')[1].split('分')[0]);
					s += parseInt(timesarray[i].split('分')[1].split('秒')[0]);
				}
				ns = s%60;
				m = m +  Math.floor(s/60);
				nm = m%60;
				nh = h +  Math.floor(m/60);
				return nh + '时' + nm + '分' + ns + '秒';
				
			},
			getLesson() {
				return axios.get('/admin/lesson/' + this.$route.params.id)
			},
			getSectionlist() {
				return axios.get('/admin/lesson/' + this.$route.params.id +'/section/lists')
			},
			getVideo() {
				return axios.get('/admin/video/success_lists');
			},
			// 执行axios并发回调
			getAll() {
				this.loading = true;
				axios.all([this.getLesson(), this.getSectionlist(), this.getVideo()])
					  .then(axios.spread((lesson, section,video) => {
					    // console.log('课程信息',lesson);
					    this.lesson_e = lesson.data;
					    console.log('章节列表',section);
					    this.sections = section.data;
					    console.log('视频列表',video);
					    this.videos = video.data.data;
					    this.loading = false;
					  }))
			}
			
		},
		watch: {
			sections: {
				handler(val) {
					this.timesarray = [];
					this.playtimes = 0;
					for(let i = 0; i < val.length; i++) {
				    	 this.timesarray.push(val[i].video.url[0].duration);
				    	 this.playtimes += parseInt(val[i].play_times);
				    };
				    this.videotimes = this.addTimes(this.timesarray);
				}
			}
			// festivals(a) {
			// 	let set = 0
			// 	let that = this
			// 	a.forEach(function(e) {
			// 		set += that.time_to_sec(e.videodur)
			// 	})
			// 	this.videotimes = this.sec_to_time(set)
			// }
		},
		mounted: function() {
			// let set = 0
			// let that = this
			// this.festivals.forEach(function(e) {
			// 	set += that.time_to_sec(e.videodur)
			// })
			// this.videotimes = this.sec_to_time(set)
			this.getAll()
		}
	}
</script>
<style scoped>
	.management_first {
		padding: 5px 0px 0px 15px;
	}
	
	.management_second {
		display: inline-block;
		line-height: 40px;
		font-size: 16.0px;
		text-align: right;
	}
	
	.el-dialog__header {
		border-bottom: 1px solid rgb(233, 233, 233);
	}
	
	.form_input_g {
		width: 430px;
	}
	
	.mentable {
		height: 272px;
		overflow-y: scroll;
	}
	
	.management_first_class {
		padding: 15px 5px;
		border: 1px solid #e3e3e3;
		font-size: 14px;
		position: relative;
	}
	
	.management_first_class:nth-child(n+4):before {
		content: '';
		height: 1.1rem;
		width: 1px;
		background-color: #dedede;
		position: absolute;
		top: -1.1rem;
		left: 23px;
	}
	
	.management_first_class:hover {
		background-color: #f7f7f7;
	}
	
	.management_first_class:hover>span {
		color: #3C98FF;
	}
	
	.management_first_class>.el-icon-erp-icon-ic_ondemand_video {
		margin-left: .5rem;
		vertical-align: middle;
	}
	
	.management_first_class_children {
		float: right;
		margin-right: 1rem;
		line-height: 20px;
	}
	
	.management_first_class_children>i {
		font-size: 14px;
	}
	
	.management_first_class_children>i:before {
		margin-right: .3rem;
	}
</style>