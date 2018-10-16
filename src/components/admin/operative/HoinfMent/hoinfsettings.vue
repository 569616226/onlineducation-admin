<template>
	<div v-loading="loading">
		<div class="member_first">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="视频选择">
					<el-radio v-model="ruleForm.index_type" :label="1">展示最新的课程/活动</el-radio>
					<el-radio v-model="ruleForm.index_type" :label="2">自定义</el-radio>
					<el-form-item prop="index_count" v-if="ruleForm.index_type == 1">
						<el-select v-model="ruleForm.index_count" placeholder="请选择">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
						<p class="gray">请选择显示最近更新视频的数量，最多添加8个课程/活动</p>
					</el-form-item>
					<el-form-item v-if="ruleForm.index_type == 2">
						<p class="gray margin-bottom-sm">选择在首页展示的栏目视频，建议每个栏目推荐的视频不多于4个</p>
						<div style="display: inline-block;">
							<div class="colrecom_form" v-for="(item,index) in ruleForm.show_data">
								<img :src="item.pictrue" />
								<p>{{item.name}}</p>
								<i class="el-icon-error cursor" @click="deleteshowvideo(item,index)"></i>
							</div>
							<div class="colrecom_form_add cursor" @click="addclassvideo">
								<i class="el-icon-plus avatar-uploader-icon"></i>
								<p>选择课程</p>
							</div>
						</div>
						<div style="display: inline-block;">
							<div class="colrecom_form" v-for="(item,index) in ruleForm.show_data_h">
								<img :src="item.pic" />
								<p>{{item.name}}</p>
								<i class="el-icon-error cursor" @click="deleteshowvideo_h(item,index)"></i>
							</div>
							<div class="colrecom_form_add cursor" @click="addclassvideo_h">
								<i class="el-icon-plus avatar-uploader-icon"></i>
								<p>选择活动</p>
							</div>
						</div>
					</el-form-item>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--选择视频-->
		<el-dialog title="选择视频" :visible.sync="previewcol" class="previewcol">
			<div class="select_show_video">
				<el-input placeholder="请输入内容" @keyup.enter.native="search_fi()" v-model="search_video" class="input-with-select input_search_video margin-bottom-sm">
					<el-button @click="search_fi()" slot="append">搜索</el-button>
				</el-input>
				<span class="span_search_video">
					<span class="red">**</span>显示已上架的所有课程</span>
				<div class="colrecom_form cursor" v-for="(item,index) in data.slice(nowG,nowG+6)" @click="clickshowvideo(item,index)">
					<img :src="item.pictrue" />
					<p>{{item.name}}</p>
				</div>
				<p class="form_p_g"></p>
				<div class="block show_page">
					<el-pagination @current-change="handleCurrentChange" :current-page.sync="nowPage" :page-size="pagesize_v" layout="prev, pager, next, total"
					    :total="total_v">
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
	import api from '@/utils/api'
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
				ruleForm: {
					index_type: null,
					index_count: null,
					show_data: [],
					show_data_h: [],
					lesson_ids: [],
					trains_ids: []
				},
				rules: {
					// index_count: [{
					// 	required: true,
					// 	message: '请选择更新数量',
					// 	trigger: 'change'
					// }]
				},
				loading: false,
				options: [{
					value: 4,
					label: 4
				}, {
					value: 6,
					label: 6
				}, {
					value: 8,
					label: 8
				}],
				previewcol: false,
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
				for (var i in this.datafirst) {
					if (this.datafirst[i].name.toLowerCase().indexOf(this.search_video.toLowerCase()) !== -1) {
						console.log(i, ":", this.datafirst[i]);
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
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true;
						if (this.ruleForm.index_type == 1) {
							axios.post('/admin/setting/1/set_index_type', {
									index_type: this.ruleForm.index_type,
									index_count: this.ruleForm.index_count
								})
								.then((res) => {
									if (res.data.status) {
										this.$message.success(res.data.message);
									} else {
										this.$message.warning(res.data.message);
									}
									this.loading = false;
								})
								.catch((error) => {
									console.log(error);
									this.loading = false;
								})
						}
						if (this.ruleForm.index_type == 2) {
							// 将推荐的课程id放到一个集合（lesson_ids），传到后台
							for (let i = 0; i < this.ruleForm.show_data.length; i++) {
								this.ruleForm.lesson_ids.push(this.ruleForm.show_data[i].id);
							}
							for (let i = 0; i < this.ruleForm.show_data_h.length; i++) {
								this.ruleForm.trains_ids.push(this.ruleForm.show_data_h[i].id);
							}
							axios.post('/admin/setting/1/set_index_type', {
									index_type: this.ruleForm.index_type,
									top_lesson_ids: this.ruleForm.lesson_ids,
									top_train_ids: this.ruleForm.trains_ids
								})
								.then((res) => {
									if (res.data.status) {
										this.$message.success(res.data.message);
									} else {
										this.$message.warning(res.data.message);
									}
									this.loading = false;
								})
								.catch((error) => {
									console.log(error);
									this.loading = false;
								})
						}

					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//获取数据 
			async getdata() {
				this.loading = true
				const data = await api.getIndexType(1)
				this.ruleForm.index_type = data.index_type;
				this.ruleForm.index_count = data.index_count;
				// 赋值课程列表数据
				this.datafirst = data.lessons;
				this.data = data.lessons;
				// 赋值分页个数
				this.total_v = this.data.length;
				this.ruleForm.show_data = data.top_lessons
				// 赋值活动列表数据
				this.datafirst_h = data.trains;
				this.data_h = data.trains;
				// 赋值分页个数
				this.total_v_h = this.data_h.length;
				this.ruleForm.show_data_h = data.top_trains
				this.loading = false
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
				this.previewcol = false;
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
		watch: {

		},
		mounted() {
			this.getdata()
		}
	}
</script>
<style scoped>
	.member_first {
		padding: 60px
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
		display: inline-block
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
		width: 178px;
		height: 178px;
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
