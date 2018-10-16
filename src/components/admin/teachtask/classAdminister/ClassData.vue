<template>
	<div v-loading="loading">
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" onclick="window.history.go(-1)"></i> {{$route.meta.title}}
		</div>
		<div class="ClassData-cl-box" style="width:100%;">
			<div class="ClassData-cl-row class_bg">
				<div class="ClassData-cl-td">
					<p>数据名称</p>
				</div>
				<div class="ClassData-cl-td">
					<p>实际数据</p>
				</div>
				<div class="ClassData-cl-td">
					<p>广告数据</p>
				</div>
				<div class="ClassData-cl-td border_right">
					<p>操作</p>
				</div>
			</div>
			<div class="ClassData-cl-row">
				<div class="ClassData-cl-td">
					<p>课程节数</p>
				</div>
				<div class="ClassData-cl-td">
					<p v-if="data.sections">{{ data.sections.length }}</p>
				</div>
			</div>
			<div class="ClassData-cl-row">
				<div class="ClassData-cl-td">
					<p>课程时间</p>
				</div>
				<div class="ClassData-cl-td">
					<p>{{ data.play_times }}</p>
				</div>
			</div>
			<div class="ClassData-cl-row">
				<div class="ClassData-cl-td">
					<p>课程收入(元)</p>
				</div>
				<div class="ClassData-cl-td">
					<p>{{ data.total_prices }}</p>
				</div>
			</div>
			<div class="ClassData-cl-row">
				<div class="ClassData-cl-td">
					<p>收藏数</p>
				</div>
				<div class="ClassData-cl-td">
					<p>{{ data.collects }}</p>
				</div>
			</div>
			<div class="ClassData-cl-row">
				<div class="ClassData-cl-td">
					<p>评论总数</p>
				</div>
				<div class="ClassData-cl-td">
					<p>{{ data.discusses }}</p>
				</div>
			</div>
			<div class="ClassData-cl-row">
				<div class="ClassData-cl-td">
					<p>精选评论</p>
				</div>
				<div class="ClassData-cl-td">
					<p>{{ data.better_discusses }}</p>
				</div>
			</div>
			<div class="ClassData-cl-row">
				<div class="ClassData-cl-td">
					<p>播放次数</p>
				</div>
				<div class="ClassData-cl-td">
					<p>{{ data.play_times }}</p>
				</div>
				<div class="ClassData-cl-td border_top_line">
					<p>{{ data.out_play_times }}</p>
				</div>
				<div class="ClassData-cl-td border_right border_top_line">
					<p class="EditData" @click="EditData('play')">编辑数据</p>
				</div>
			</div>
			<div class="ClassData-cl-row">
				<div class="ClassData-cl-td">
					<p>点赞次数</p>
				</div>
				<div class="ClassData-cl-td">
					<p>{{ data.likes }}</p>
				</div>
				<div class="ClassData-cl-td">
					<p>{{ data.out_likes }}</p>
				</div>
				<div class="ClassData-cl-td border_right">
					<p class="EditData" @click="EditData('likes')">编辑数据</p>
				</div>
			</div>
		</div>
		<el-dialog title="编辑广告数据" :visible.sync="dialogFormVisible" width="500px" v-loading="edtiLoading">
			<el-form>
				<el-form-item label="广告数据" :label-width="formLabelWidth">
					<el-input v-model="editPlayTime" auto-complete="off" class="sortMenu-edit"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="PostEditPlay">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import api from '@/utils/api'
	export default {
		data() {
			return {
				loading: false,
				data: [],
				edtiLoading: false,
				dialogFormVisible: false,
				formLabelWidth: '120px',
				editPlayTime: null,
				type: ''
			}
		},
		methods: {
			async getData() {
				this.loading = true
				let id = this.$route.params.id
				const data = await api.getLessonDetail(id)
				this.data = data.lesson
				this.loading = false
			},
			EditData(type) {
				if(type == 'play'){
					this.editPlayTime = this.data.out_play_times
				}
				if(type == 'likes'){
					this.editPlayTime = this.data.out_likes
				}
				this.type = type
				this.dialogFormVisible = true
			},
			async PostEditPlay() {
				if(!this.editPlayTime) {
					this.$message.error('请填写数据')
					return false
				}
				this.edtiLoading = true
				this.dialogFormVisible = false
				let data = ''
				if(this.type == 'play'){
					data = await api.editOutPlayTimes(this.$route.params.id, this.editPlayTime)
				}
				if(this.type == 'likes'){
					data = await api.editOutLike(this.$route.params.id, this.editPlayTime)
				}
				await this.getData()
				this.edtiLoading = false
				if(data.status) {
					this.$message.success(data.message)
				} else {
					this.$message.error(data.message)
				}
			}
		},
		mounted() {
			this.getData()
		}
	}
</script>
<style lang="less" scoped>
	.ClassData {
		&-cl-box {
			display: table;
			width: 100%;
			margin-top: 2rem;
			text-align: center;
			border: 1px solid #E3E3E3;
			font-size: 14px;
		}
		&-cl-row {
			display: table-row;
			vertical-align: middle;
			word-wrap: break-word;
			word-break: break-all;
		}
		&-cl-td{
			border-bottom: 1px solid #E3E3E3;
			border-right: 1px solid #E3E3E3;
		}
		&-cl-row:nth-child(odd) {
			/*background-color: #F5F5F5;*/
		}
		&-cl-row:nth-child(even) {
			/*background-color: #F5F5F5;*/
		}
		&-cl-row &-cl-td {
			display: table-cell;
			padding: 15px 0;
			vertical-align: middle;
		}
		&-cl-row:last-child &-cl-td {
			border-bottom: none;
		}
		&-cl-row &-cl-td:first-child {
			width: 40%;
			
		}
		&-cl-row &-cl-td:last-child {
			width: 20%;
		}
	}
	.border_right{
		border-right: none;
	}
	.border_top_line{
		border-top: 1px solid #E3E3E3;
	}
	.EditData{
		color: rgb(60, 152, 255);
		cursor: pointer;
	}
	.class_bg{
		background-color: rgb(245, 245, 245);
	}
</style>