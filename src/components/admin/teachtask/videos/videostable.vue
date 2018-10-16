<template>
	<div>
		
	<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">

		<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">
			<el-col :span="2"  class="delete_comment">
				<el-button type="primary" @click="$router.push({name: 'upload_video'})">上传视频</el-button>
			</el-col>
			<el-col :span="16" :offset="6" class="text-align-right">
				<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索视频名" class="class_input_width">
				</el-input>
			</el-col>
		</el-row>
		<el-table-column width="85" prop="index" label="编号" key="index" sortable="custom">
			<template slot-scope="scope">
				{{ scope.$index + 1 }}
			</template>
		</el-table-column>
		<el-table-column width="255" prop="name" label="视频名称" key="name" sortable="custom">
			<template slot-scope="scope">
				<h1 @click="videoDialog(scope)" class="blue cursor">{{scope.row.name}}</h1>
			</template>
		</el-table-column>
		<el-table-column  prop="status" label="视频状态" key="status" sortable="custom">
			<template slot-scope="scope">
				<span>{{scope.row.status}}</span>
			</template>
		</el-table-column>
		<!-- 时长暂时取得最后一个 -->
		<el-table-column prop="duration" label="视频时长" key="duration" sortable="custom">
			<template slot-scope="scope">
					<span v-if="scope.row.status =='转码成功'">
						{{ scope.row.duration }}
					</span>
			</template>
		</el-table-column>
		<!-- 大小暂时取的第一个，因为不知道到底哪个才是正常 -->
		<el-table-column prop="size" label="大小" key="size" sortable="custom">
				<template slot-scope="scope">
					<span v-if="scope.row.status =='转码成功'">
						{{ scope.row.size }}
					</span>
			</template>
		</el-table-column>
		 
		<el-table-column prop="created_at" label="添加时间" key="created_at" sortable="custom">
		</el-table-column>
		<el-table-column label="操作" width="135">
			<template slot-scope="scope">
				<el-dropdown split-button @click="editvideo(scope.row)" @command="customButtonsForRowtwo">
					编辑
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item :command='{command: "a",scope:scope}'>删除</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</template>
		</el-table-column>
	</data-tables>
	<!--视频播放-->
	<el-dialog title="视频播放" ref="video_dialog" :visible.sync="dialogvideoVisible" @close="closevideo()" >
		<!-- <video :src="videosrc" width="100%" controls="controls">
			你的浏览器不支持视频播放，请升级或者更换浏览器
		</video> -->
		<div id="id_test_video" style="width:100%; height:auto;" v-if="dialogvideoVisible" ref="player"></div>
		<!-- <div id="id_test_video" style="width:100%; height:auto;" ref="id_test_video"></div> -->
<!-- 		<video src="http://1255334727.vod2.myqcloud.com/c5939c06vodgzp1255334727/1807230d4564972818474125335/r9oKAtGFapcA.mp4" width="100%" controls="controls">
			你的浏览器不支持视频播放，请升级或者更换浏览器
		</video> -->
	</el-dialog>
	</div>
</template>
<script>
var TcPlayer = require('../../../common/TcPlayer-module-2.2.0.js');
	export default {
		data() {
			return {
				data: [],
				customFilters: [{
					vals: '',
					props: ['name'],
				}],
				// 表格属性设置
				tableProps : {
					 border: false,    //去掉边框
        			 // stripe: false  //去掉斑马纹
				},
				//分页设置
				paginationDef : {
					 pageSize: 10,
       				 pageSizes: [10, 20, 50]
				},
				loading: false,
				dialogvideoVisible:false,
				videosrc:''

			}
		},
		methods: {
			editvideo(row) {
				let id = row.id;
				// this.$message(row.videoname)
				 this.$router.push({name: 'edit_video',
                    params: {
                        id
                    }
                })
			},
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.$confirm('真的要删除该视频吗？', '删除', {
						confirmButtonText: '删除',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.loading = true;
						axios.get('/admin/video/'+ row.scope.row.id + '/delete')
						.then((res) => {
							if(res.data.status) {
								this.$message.success(res.data.message);
								this.data.splice(row.scope.$index, 1);
								this.loading = false;
							}else {
								this.$message.warning(res.data.message);
								this.loading = false;
							}
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						})
					})
					
				} else if(row.command == "b") {
					let ids = []
					this.multipleSelection.map((item) => {
						ids.push(item.id)
					});
				}
			},
			// 视频模态框
			videoDialog(scope) { 
			this.dialogvideoVisible = true;
			this.videosrc = scope.row.url;
			this.$nextTick(function(){
				let player = new TcPlayer.TcPlayer.TcPlayer('id_test_video', {
					"m3u8": this.videosrc, //请替换成实际可用的播放地址
					"width": 900, //视频的显示宽度，请尽量使用视频分辨率宽度
					"height": 500, //视频的显示高度，请尽量使用视频分辨率高度
					"volume": '0.5',
				})
			})
			},
			closevideo() {
				this.dialogvideoVisible = false;
				this.videosrc = '';
			},
			getdata(){
				this.loading = true;
				axios.get('/admin/video/lists')
				.then((res) => {
					this.data = res.data.data;
					this.loading = false;
				})
				.catch((error) => {

				});
			},
		 
		},
		mounted: function() {
			this.getdata()
			// this.videoDialog()
		}
	}
</script>
<style scoped>
.delete_comment{text-align:left}
.xuan{line-height:1;padding:10px 15px;display:inline-block}
.demo-table-expand{font-size:0}
.demo-table-expand label{width:90px;color:#99a9bf}
.demo-table-expand .el-form-item{margin-right:0;margin-bottom:0;width:50%}
.class_el_row{margin-bottom:10px;padding:10px;background:#F5F5F5;border-radius:4px}
.el-table td,.el-table th{padding:12px 0 12px 10px}
.class_input_width{width:14rem}
</style>
<style>
.vcp-player{width:100%!important}
.vcp-player video{width:100%!important;height:100%!important}
</style>