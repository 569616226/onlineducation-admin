<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>

		<el-container class="margin-top" v-loading="loading">
			<el-aside width="300px" v-bind:style="{ height: windowHeight}">
				<p class="p-title">课程名称</p>
				<div class="scope-box">
					<div class="p-main" ref="activeShow" v-for="(item,key) in data" :key="key" @click="show_p(item,key)">
						<p class="p-small-title">{{ item.title }}</p>
						<time>{{ item.created_at }}</time>
						<div class="num">{{ item.discusse_counts }}条</div>
					</div>
				</div>

			</el-aside>
			<el-main v-bind:style="{ height: windowHeight}">
				<el-row style="margin-bottom: 10px; margin-top: -10px;" class="">
					<el-col :span="2" class="delete_comment">
						<el-select v-model="selectValue" style="width:120px;" placeholder="全部评论" @change="changeData">
							<el-option v-for="item in optionsValue" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-col>
					<el-col :span="16" :offset="6" class="text-align-right">
						<el-input prefix-icon="el-icon-erp-icon-ic_search" v-model="search" placeholder="搜索点评内容/点评人" class="class_input_width">
						</el-input>
					</el-col>
				</el-row>
				<div class="p-container">
					<div class="title-box">
						<span class="title-l">{{ replyType }}</span>
						<span class="title-r">操作</span>
					</div>
					<div class="p-item">
						<div class="p-content" v-for="item in dataComments.slice(nowG,nowG+5)">
							<img :src="item.avatar">
							<div class="item-main">
								<p class="name">{{ item.guest }}
									<span v-if="item.is_better == 1" class="is_better_span">精选</span>
									<el-dropdown style="float:right; width:130px; margin-top:10px;" split-button @click="customButtonsForRowone(item)" @command="customButtonsForRowtwo">
										<span v-if="item.is_better == 0">精选</span>
										<span v-else="item.is_better == 1">取消精选</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item :command='{command: "a",item:item}'>回复</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</p>
								<p class="content" style="padding-right:130px;">{{ item.content }}</p>
								<time class="margin-top-xs">{{ item.created_at }}</time>
							</div>
							<div style="clear:both;"></div>

							<!-- 回复显示 -->
							<div class="reply-box" v-if="item.teacher_msg">
								<p>你的回复</p>
								<p class="content margin-top-xs margin-bottom-xs">{{ item.teacher_msg.content }}</p>
								<a class="delete" href="javascript:void(0);" @click="delete_reply(item.teacher_msg.id)">删除</a>
							</div>
							<!-- 回复显示 -->

							<!-- 回复操作 -->
							<!-- <div class="reply-write" v-else="item.teacher_msg">
		  					<p class="margin-bottom-xs" style="color:#9A9A9A;">回复该点评</p>
		  					<el-input
							  type="textarea"
							  :rows="2"
							  placeholder="请输入内容"
							  v-model="textarea">
							</el-input>
							<div class="margin-top-xs">
								<el-button size="mini" type="primary" @click="submit_reply(item.id)">提交</el-button>
								<el-button size="mini">收起</el-button>
							</div>
		  				</div> -->
							<!-- 回复操作 -->
						</div>

					</div>
				</div>
				<div class="block">
					<el-pagination @current-change="handleCurrentChange" :current-page.sync="nowPage" :page-size="pagesize_v" layout="prev, pager, next, total" :total="total_v">

					</el-pagination>
				</div>
			</el-main>
		</el-container>

		<el-dialog title="回复评论" :visible.sync="previewcol" class="previewcol">
			<el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="textarea">
			</el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click="previewcol = false">取 消</el-button>
				<el-button type="primary" @click="submit_reply()">提 交</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import api from '@/utils/api'
	export default {
		components: {

		},
		data() {
			return {
				windowHeight: window.innerHeight - 180 + 'px',
				currentPage: 1, // 默认页数
				textarea: '', // 回复点评
				// 下拉选框数据
				selectValue: 0,
				optionsValue: [{
						label: '所有评论',
						value: 0
					},
					{
						label: '精选评论',
						value: 1
					},
					{
						label: '未精选评论',
						value: 2
					}
				],
				replyType: '全部点评',
				data: [], // 存放所有数据
				dataComments: [], // 课程数据（选择了左边的课程后，再把当前课程下的评论都赋值给dataComments）
				dataCommentsone: [], // 初始化的课程数据（用于搜索功能对比）
				dataIndex: 0, // 存放当前点击的index，左侧的导航
				loading: false,
				// 分页参数
				pagesize_v: 5, //每页个数   number类型
				total_v: 0, //总个数	 number类型
				nowPage: 1, //当前页数
				nowG: 0, //当前页面的第一个是全部数据中的第几个（默认是第一个）
				search: '', //搜索内容
				previewcol: false, //回复模态框标记
				replyIndex: null //回复index标记
			}
		},
		methods: {

			// 分页
			handleCurrentChange(val) {
				this.nowG = (val - 1) * 5;
			},
			// 搜索
			search_fi() {
				this.dataComments = [];
				for(var i in this.dataCommentsone) {
					if(this.dataCommentsone[i].guest.toLowerCase().indexOf(this.search.toLowerCase()) !== -1 || this.dataCommentsone[i].content.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) {
						this.dataComments.push(this.dataCommentsone[i])
					}
				}
				this.total_v = this.dataComments.length;
				this.nowPage = 1; //搜索完之后把当前页数跳转到第一页
				this.selectValue = 0;
			},
			// 点击左侧的课程，显示课程对应的评论
			show_p(item, key) {
				this.$refs.activeShow.forEach((item, key) => {
					item.style.background = "";
				});
				this.$refs.activeShow[key].style.background = '#F5F6F6';
				this.dataComments = this.data[key].discusses;
				this.dataCommentsone = this.data[key].discusses;
				this.total_v = this.dataComments.length;
				this.dataIndex = key;
			},

			// 下拉筛选
			changeData() {
				this.dataComments = [];
				// 选择了所有评论
				if(this.selectValue == 0) {
					this.dataComments = this.dataCommentsone;
					this.replyType = "全部点评"
				}
				// 选择了精选
				if(this.selectValue == 1) {
					for(var i in this.dataCommentsone) {
						if(this.dataCommentsone[i].is_better == 1) {
							this.dataComments.push(this.dataCommentsone[i])
						}
					}
					this.replyType = "精选点评"
				}
				// 选择了未精选
				if(this.selectValue == 2) {
					for(var i in this.dataCommentsone) {
						if(this.dataCommentsone[i].is_better == 0) {
							this.dataComments.push(this.dataCommentsone[i])
						}
					}
					this.replyType = "未精选点评"
				}
				this.total_v = this.dataComments.length;
				this.nowPage = 1; //搜索完之后把当前页数跳转到第一页

			},

			// 回复评论
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					if(row.item.teacher_msg) {
						this.$message.warning("已经点评过了");
						return false;
					}
					this.replyIndex = row.item.id;
					this.previewcol = true;
				}
			},
			// 提交评论
			async submit_reply() {
				if(this.textarea == "") {
					this.$message.error("请输入评论");
					return false;
				}
				this.previewcol = false;
				this.loading = true;
				const data = await api.getDiscusse(this.replyIndex, this.textarea)
				console.log(data)
				if(data.status) {
					this.$message.success(data.message);
					this.gettabledata();
					this.textarea = "";
					this.loading = false;
				} else {
					this.$message.warning(data.message);
					this.loading = false;
				}
			},
			//删除评论
			delete_reply(id) {

				this.$confirm('确定删除该回复吗？', '提醒', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					this.loading = true
					axios.get('/admin/discusse/' + id + '/delete').then(res => {
						this.gettabledata();
						if(res.data.status) {
							this.$message.success(res.data.message);
						} else {
							this.$message.error(res.data.message);
						}
					}).catch(error => {
						this.loading = false
						console.log(error);
					})
				}).catch(() => {

				})

			},
			//评论管理表格数据
			gettabledata() {
				this.loading = true;
				this.data = [];
				axios.get('/admin/discusse/lists').then(res => {
					this.data = res.data.data;
					this.dataComments = this.data[this.dataIndex].discusses;
					this.dataCommentsone = this.data[this.dataIndex].discusses;
					this.total_v = this.dataComments.length;
					this.$nextTick(() => {
						this.$refs.activeShow[this.dataIndex].style.background = '#F5F6F6';
					})
					this.loading = false
				}).catch(error => {
					this.loading = false
				})
			},

			// 单个设置精选（取消精选）（调用处）
			customButtonsForRowone(row) {
				let sub = {}
				if(row.is_better == 0) {
					sub.tips = '只有设为精选的评论才会在课程评论页上显示，真的要设为精选吗？'; //未精选和已精选两种提示语
					sub.url = '/admin/discusse/' + row.id + '/better'; //请求地址，未精选和已精选分别两个不同的地址
					sub.text = '未精选';

				} else if(row.is_better == 1) {
					sub.tips = '真的要取消精选评论吗？取消后，在课程评论页将看不到此评论了！';
					sub.url = '/admin/discusse/' + row.id + '/un_better'
					sub.text = '已精选';
				}
				this.$confirm(sub.tips, '提醒', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					this.revmentset(sub);
				}).catch(() => {

				})
			},
			//单个精选评论（取消精选）
			revmentset(sub) {
				this.loading = true;
				axios.get(sub.url)
					.then((res) => {
						if(res.data.status) {
							this.loading = false;
							this.$message.success(res.data.message);
							this.gettabledata();
						} else {
							this.$message.warning(res.data.message);
						}

					})
					.catch((error) => {
						console.log(error)
					})
			},

		},
		mounted() {
			this.gettabledata();
			window.onresize = function() {

			}
		},
		watch: {
			search: {
				handler(curVal, oldVal) {
					this.search_fi();
				}
			}
		}
	}
</script>
<style scoped>
	.delete_comment {
		text-align: left
	}
	
	.xuan {
		line-height: 1;
		font-size: 14px;
		display: inline-block;
		margin-left: .3rem;
	}
	
	.demo-table-expand {
		font-size: 0
	}
	
	.demo-table-expand label {
		width: 90px;
		color: #99a9bf
	}
	
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%
	}
	
	.class_el_row {
		margin-bottom: 10px;
		padding: 10px;
		background: #F5F5F5;
		border-radius: 4px
	}
	
	.el-table td,
	.el-table th {
		padding: 12px 0 12px 10px
	}
	
	.class_input_width {
		width: 14rem
	}
	
	.el-header,
	.el-footer {
		background-color: #B3C0D1;
		color: #333;
		text-align: center;
	}
	
	.el-aside {
		color: #333;
		text-align: center;
		border-top: 1px solid #E3E3E3;
		border-left: 1px solid #E3E3E3;
		border-right: 1px solid #E3E3E3;
		border-bottom: 1px solid #E3E3E3;
	}
	
	.el-main {
		color: #333;
		text-align: center;
		border-top: 1px solid #E3E3E3;
		border-right: 1px solid #E3E3E3;
		border-bottom: 1px solid #E3E3E3;
	}
	
	body>.el-container {
		margin-bottom: 40px;
	}
	
	.p-title {
		height: 50px;
		color: rgba(53, 149, 255, 1);
		font-size: 14px;
		text-align: left;
		font-family: Roboto;
		padding: 15px 30px;
		border-bottom: 1px solid #E3E3E3;
		position: absolute;
		width: 294px;
		background: #FFFFFF;
		z-index: 10;
	}
	
	.p-main {
		text-align: left;
		padding: 20px 30px;
		height: 80px;
		font-size: 14px;
		text-align: left;
		font-family: Roboto;
		border-bottom: 1px solid #E3E3E3;
		position: relative;
		cursor: pointer;
	}
	
	.p-main:hover {
		background: #F5F6F6;
	}
	
	.p-main .num {
		position: absolute;
		right: 10px;
		top: 30px;
		color: #888888;
	}
	
	.p-main time {
		color: #888288;
		font-size: 12px;
		margin-top: 5px;
	}
	
	.p-container {
		text-align: left;
	}
	
	.p-container span {
		font-size: 14px;
	}
	
	.p-container span:first-child {}
	
	.title-r {
		float: right;
		width: 150px
	}
	
	.title-box {
		padding: 14px;
		background: #F5F6F6;
	}
	
	.p-content {
		border-bottom: 1px solid #E3E3E3;
		padding: 10px;
	}
	
	.p-content:after {
		content: "\0020";
		display: block;
		height: 0;
		clear: both;
	}
	
	.p-content img {
		width: 50px;
		height: 50px;
		border-radius: 100%;
		float: left;
	}
	
	.item-main {
		width: -webkit-calc(100% - 100px);
		width: -moz-calc(100% - 100px);
		width: calc(100% - 100px);
		float: left;
		margin-left: 20px;
		font-size: 14px;
	}
	
	.item-main .name {
		height: 40px;
		line-height: 30px;
		color: #9A9A9A;
	}
	
	.item-main time {
		color: #9A9A9A;
	}
	
	.p-container span.is_better_span {
		display: inline-block;
		padding: 4px 10px;
		margin-left: 10px;
		font-size: 12px;
		line-height: 1;
		background: #FF5E68;
		border-radius: 4px;
		color: #FFFFFF;
	}
	
	.reply-box {
		margin-top: 10px;
		padding-left: 70px;
		font-size: 14px;
	}
	
	.reply-write {
		margin-top: 10px;
		padding-left: 70px;
	}
	
	.reply-box p:first-child {
		position: relative;
		padding-left: 8px;
		color: #9A9A9A;
		margin-top: 15px;
		padding-top: 15px;
		border-top: 1px solid #E3E3E3;
	}
	
	.reply-box p:first-child:before {
		position: absolute;
		content: "";
		width: 2px;
		height: 12px;
		background: #42B0FF;
		left: 0;
		top: 20px;
	}
	
	.scope-box {
		margin-top: 50px;
	}
	
	.delete {
		color: red;
	}
	/*滚动条美化*/
	/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
	
	.el-aside::-webkit-scrollbar,
	.el-main::-webkit-scrollbar {
		width: 4px;
		/*滚动条宽度*/
		height: 16px;
		/*滚动条高度*/
	}
	/*定义滚动条轨道 内阴影+圆角*/
	
	.el-aside::-webkit-scrollbar-track,
	.el-main::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px #F5F6F6;
		border-radius: 10px;
		/*滚动条的背景区域的圆角*/
		background-color: #FCFCFC;
		/*滚动条的背景颜色*/
	}
	/*定义滑块 内阴影+圆角*/
	
	.el-aside::-webkit-scrollbar-thumb,
	.el-main::-webkit-scrollbar-track {
		border-radius: 10px;
		/*滚动条的圆角*/
		-webkit-box-shadow: inset 0 0 6px #F5F6F6;
		background-color: #E0E3F1;
		/*滚动条的背景颜色*/
	}
</style>