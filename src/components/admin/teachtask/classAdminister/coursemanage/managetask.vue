<template>
	<div v-loading="loading">
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" onclick="window.history.go(-1)"></i> {{$route.meta.title}}（{{data.name}}）
		</div>
		<el-row class="manage_first margin-top-sm">
			<el-col :span="18">
				<img style="width:120px;height:70px;" :src="data.pictrue" />
				<div class="manage_first_title">
					<h1>{{data.name}}</h1>
					<span v-if="data.status == '已上架'" class="green_bg">已上架</span>
					<span v-if="data.status == '已下架'" class="gray_bg">已下架</span>
					<span v-if="data.status == '未上架'" class="red_bg">未上架</span>
					<p>讲师：<span v-if="data.teacher">{{ data.teacher.name }}</span>·<span v-if="data.teacher">{{ data.teacher.office }}</span></p>
				</div>
			</el-col>
			<el-col :span="6" class="manage_first_right">
				<el-button type="success" @click="previewclass">预览课程</el-button>
				<el-button type="primary" v-if="data.status == '已下架' || data.status == '未上架'" @click="sheifconfirmclass">上架课程</el-button>
				<el-button type="info" v-if="data.status == '已上架'" @click="undersheifconfirmclass">下架课程</el-button>
			</el-col>
		</el-row>
		<el-row class="manage_second margin-top-sm">
			<el-col :span="10">
				<div class="manage_first_title">
					<h3>课程基本信息</h3>
					<p>用来管理课程的基本信息</p>
				</div>
			</el-col>
			<el-col :span="6" :offset="8" class="manage_first_right">
				<el-button type="primary" plain @click="information">编辑</el-button>
			</el-col>
		</el-row>
		<el-row class="manage_second margin-top-sm">
			<el-col :span="10">
				<div class="manage_first_title">
					<h3>课时管理</h3>
					<p>用于管理课程的内容和视频</p>
				</div>
			</el-col>
			<el-col :span="6" :offset="8" class="manage_first_right">
				<el-button type="primary" plain @click="management">管理</el-button>
			</el-col>
		</el-row>
		<el-row class="manage_second margin-top-sm">
			<el-col :span="10">
				<div class="manage_first_title">
					<h3>学员列表</h3>
					<p>用于查看有哪些学员在学习此课程</p>
				</div>
			</el-col>
			<el-col :span="6" :offset="8" class="manage_first_right">
				<el-button type="primary" plain @click="studentment(data)">查看</el-button>
			</el-col>
		</el-row>
		<el-row class="manage_second margin-top-sm">
			<el-col :span="10">
				<div class="manage_first_title">
					<h3>课程数据</h3>
					<p>查看/管理课程相关的数据</p>
				</div>
			</el-col>
			<el-col :span="6" :offset="8" class="manage_first_right">
				<el-button type="primary" plain @click="ClassData(data)">查看</el-button>
			</el-col>
		</el-row>
		<!-- <el-row class="manage_second margin-top-sm">
			<el-col :span="10">
				<div class="manage_first_title">
					<h3>课程设置</h3>
					<p>管理课程营销设置和消息推送</p>
				</div>
			</el-col>
			<el-col :span="6" :offset="8" class="manage_first_right">
				<el-button type="primary" plain @click="courseoffered(data)">设置</el-button>
			</el-col>
		</el-row> -->
		<!--预览课程-->
		<el-dialog title="预览课程" :visible.sync="previewcourse" class="previewcourse">
			<vue-q-art :config="config" :downloadButton="downloadButton"></vue-q-art>
			<p class="dialog_p">预览课程只提供页面展示，不可操作！</p>
		</el-dialog>
	</div>

</template>

<script>
	import VueQArt from 'vue-qart'
	import qart from '../../../../../assets/qart.png'
	export default {
		components: {
			VueQArt
		},
		props: ['data', 'loading'],
		data() {
			return {
				msg: 'Welcome to Your Vue.js App',
				config: {
					value: 'https://www.baidu.com',
					imagePath: qart,
					filter: 'color'
				},
				downloadButton: false,
				previewcourse: false

			}
		},
		methods: {
			sheifconfirmclass() {
				this.$confirm('你确定要上架此课程？', '上架课程', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					let id = this.data.id
					this.sheifclass(id)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					})
				})
			},
			undersheifconfirmclass() {
				this.$confirm('你确定要下架此课程？课程关闭后，正在学习的学员将可以继续学习。', '下架课程', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					let id = this.data.id
					this.undersheifclass(id)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					})
				})
			},
			previewclass() {
				this.config.value = 'http://mobile.edu.elinkport.com/#/preview/' + this.data.id
				this.previewcourse = true
			},
			information() {
				if(this.data.type == '访谈课程') {
					let id = this.data.id
					this.$router.push({
						name: 'EditInterview',
						params: {
							id
						}
					})
				} else {
					this.$parent.man_one = false
					this.$parent.man_two = true
					this.$parent.man_three = false
				}
			},
			management() {
				this.$parent.man_one = false
				this.$parent.man_two = false
				this.$parent.man_three = true
			},
			studentment(row) {
				const id = row.id
				this.$router.push({
					name: 'studentment',
					params: {
						id
					}
				})
			},
			ClassData(row) {
				const id = row.id
				this.$router.push({
					name: 'ClassData',
					params: {
						id
					}
				})
			},
			courseoffered(row) {
				const id = row.id
				this.$router.push({
					name: 'courseoffered',
					params: {
						id
					}
				})
			},
			sheifclass(id) { //上架课程
				this.$parent.loading = true
				axios.get('/admin/lesson/' + id + '/up').then(res => {
					if(res.data.status) {
						this.$parent.getdata();
						this.$message.success(res.data.message);
					} else {
						this.$message.warning(res.data.message);
						this.$parent.loading = false
					}
				}).catch(error => {
					this.$parent.loading = false
				})
			},
			undersheifclass(id) { //下架课程
				this.$parent.loading = true
				axios.get('/admin/lesson/' + id + '/down').then(res => {
					if(res.data.status) {
						this.$parent.getdata();
						this.$message.success(res.data.message);
					} else {
						this.$message.warning(res.data.message);
						this.$parent.loading = false
					}
				}).catch(error => {
					this.$parent.loading = false
				})
			}
		},
		mounted() {

		}
	}
</script>
<style scoped>
	.manage_first {
		height: 110px;
		padding: 20px;
		border: 1px solid #e3e3e3;
		border-radius: 4px
	}
	
	.manage_second {
		height: 90px;
		padding: 10px 0 0 5px;
		border-bottom: 1px solid #e3e3e3
	}
	
	.manage_first>.el-col>img {
		height: 70px
	}
	
	.manage_first_right {
		line-height: 70px;
		text-align: right
	}
	
	.manage_first_title {
		display: inline-block;
		vertical-align: top;
		margin-top: .5rem;
		margin-left: .5rem
	}
	
	.manage_first_title>h1 {
		font-size: 18px;
		display: inline-block
	}
	
	.manage_first_title>span {
		border-radius: 2px;
		color: #fff;
		padding: 5px;
		margin-left: .5rem;
		vertical-align: super
	}
	
	.manage_first_title>p {
		color: #999;
		font-size: 14px;
		margin-top: .5rem
	}
	
	.manage_first_title>h3 {
		font-size: 17px;
		font-weight: initial
	}
</style>
<style>
	.previewcourse>.el-dialog {
		width: 300px
	}
	
	.previewcourse>.el-dialog>.el-dialog__body {
		text-align: center
	}
	
	.el-button--primary.is-plain {
		background: 0 0
	}
</style>