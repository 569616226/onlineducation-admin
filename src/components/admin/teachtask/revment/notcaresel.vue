<!-- 已经合并到一个页面了，这个页面暂时废弃 -->



<template>
	<div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters" @selection-change="handleSelectionChange">

			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">

				<el-col :span="6" class="delete_comment">
					<el-button type="primary" @click="cancelselect" :disabled="revdisabled">设为精选</el-button>
					<el-button @click="deleterev" :disabled="revdisabled">删除评论</el-button>
				</el-col>
				<el-col :span="5" class="delete_comment xuan" v-if="choice>0">
					<span>已选中{{choice}}条评论</span>
				</el-col>
				<el-col :span="9" :offset="choice>0 ? 4 : 9" class="text-align-right">
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索课程名称" class="class_input_width">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="revcomment" label="评论内容" key="revcomment" sortable="custom">
			</el-table-column>
			<el-table-column prop="classname" label="课程名称" key="classname" sortable="custom">
				<template slot-scope="scope">
					<p>{{scope.row.classname}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="founder" label="评论人" key="founder" sortable="custom">
				<template slot-scope="scope">
					<p class="blue">{{scope.row.founder}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="foundtime" label="评论时间" key="foundtime" sortable="custom">
				<template slot-scope="scope">
					<p>{{scope.row.foundtime}}</p>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="135">
				<template slot-scope="scope">
					<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
						精选
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command='{command: "a",scope:scope}'>删除评论</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</data-tables>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				data: [{
					'id': '1',
					'revcomment': '良心课程!值!!!感谢老师!!',
					'classname': 'AEO认证',
					'founder': 'admin',
					'foundtime': '2017-10-10 15:56:50'
				}, {
					'id': '2',
					'revcomment': '很不错，很喜欢😍，希望自己能够有所改变～希望自己能',
					'classname': '关务风险',
					'founder': 'admin',
					'foundtime': '2017-10-10 15:56:50'
				}, {
					'id': '3',
					'revcomment': '解答疑惑，很实用！',
					'classname': '预归类学习',
					'founder': 'admin',
					'foundtime': '2017-10-10 15:56:50'
				}, {
					'id': '4',
					'revcomment': '很好，收益很大，好好学习天天向上!!!!',
					'classname': '最新政策解读',
					'founder': 'admin',
					'foundtime': '2017-10-10 15:56:50'
				}],
				customFilters: [{
					vals: '',
					props: ['classname'],
				}],
				loading: false,
				tableProps: {
					border: false, //去掉边框
					// stripe: false  //去掉斑马纹
				},
				//分页设置
				paginationDef: {
					pageSize: 10,
					pageSizes: [10, 20, 50]
				},
				multipleSelection: [],
				choice: 0,
				revdisabled: true
			}
		},
		methods: {
			customButtonsForRowone(row) {
				this.$confirm('只有设为精选的评论才会在课程评论页上显示，真的要设为精选吗？', '提醒', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					this.revmentset(row)
				}).catch(() => {

				})
			},
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.$confirm('真的要删除此评论吗？', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.deletecol(row.scope)
					}).catch(() => {

					})

				}
			},
			gettabledata() { //评论管理表格数据
				this.loading = true
				axios.get('').then(response => {
					this.loading = false

				}).catch(error => {
					this.loading = false
				})
			},
			deletecol(row) { //删除评论
				this.loading = true
				let id = row.row.id
				axios.post('', id).then(response => {
					this.loading = false
					this.data.splice(row.$index, 1)
					this.$message({
						type: 'success',
						message: '删除成功!'
					})

				}).catch(error => {
					this.loading = false
				})
			},
			revmentset(row) { //精选评论
				this.loading = true
				let id = row.id
				axios.post('', id).then(response => {
					this.loading = false
					this.$message({
						type: 'success',
						message: '精选成功!'
					})

				}).catch(error => {
					this.loading = false
				})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				this.choice = this.multipleSelection.length
				if(this.choice > 0) {
					this.revdisabled = false
				} else {
					this.revdisabled = true
				}
			},
			//传输批量精选评论
			setrev() {
				let multipleSelection = this.multipleSelection
				axios.post('', multipleSelection).then(response => {
					this.loading = false
					this.$message({
						type: 'success',
						message: '删除成功!'
					})

				}).catch(error => {
					this.loading = false
				})
			},
			//传输批量删除评论
			removerev() {
				let multipleSelection = this.multipleSelection
				axios.post('', multipleSelection).then(response => {
					this.loading = false
					this.$message({
						type: 'success',
						message: '删除成功!'
					})

				}).catch(error => {
					this.loading = false
				})
			},
			cancelselect() {
				this.$confirm('只有设为精选的评论才会在课程评论页上显示，真的要设为精选吗？', '提醒', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					this.setrev()
					this.$message({
						type: 'success',
						message: '精选成功!'
					});
				}).catch(() => {

				})
			},
			deleterev() {
				this.$confirm('真的要删除评论吗？', '提醒', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					this.removerev()
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {

				})
			}
		},
		mounted: function() {
			//this.gettabledata()  评论管理表格数据
		}
	}
</script>
<style scoped>
	.delete_comment {
		text-align: left;
	}
	
	.xuan {
		line-height: 1;
		padding: 14px 0px;
		display: inline-block;
	}
	
	.demo-table-expand {
		font-size: 0;
	}
	
	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}
	
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
	
	.class_el_row {
		margin-bottom: 10px;
		padding: 10px;
		background: #F5F5F5;
		border-radius: 4px;
	}
	
	.el-table td,
	.el-table th {
		padding: 12px 0 12px 10px;
	}
	
	.class_input_width {
		width: 14rem;
	}
</style>