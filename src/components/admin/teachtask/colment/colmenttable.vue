<template>
	<div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">

			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">

				<el-col :span="2" class="delete_comment">
					<el-button type="primary" @click="$router.push({name: 'addcol'})">新建分类</el-button>
				</el-col>
				<el-col :span="16" :offset="6" class="text-align-right">
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索标题" class="class_input_width">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column width="85" prop="index" label="排序" key="index" sortable="custom" >
				<template slot-scope="scope">
					<i :class="scope.$index == 0 ? 'el-icon-erp-icon-jiantou order_col order_stop' : 'el-icon-erp-icon-jiantou order_col'" @click="order(scope, 'up')"></i>
					<i :class="scope.$index == (data.length-1) ? 'el-icon-erp-icon-jiantou-copy order_col order_stop' : 'el-icon-erp-icon-jiantou-copy order_col'" @click="order(scope, 'down')"></i>
				</template>
			</el-table-column>
			<el-table-column prop="pictrue" label="分类图片" key="pictrue" sortable="custom">
				<template slot-scope="scope">
					<img style="width:76px;height:76px;" :src="scope.row.pictrue" />
				</template>
			</el-table-column>
			<el-table-column prop="name" label="分类标题" key="name" sortable="custom">
				<template slot-scope="scope">
					<p class="blue cursor font_weight" @click="colmentshow(scope)">{{scope.row.name}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="created_at" label="创建时间" key="created_at" sortable="custom">
				<template slot-scope="scope">
					<p>{{scope.row.created_at}}</p>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="135">
				<template slot-scope="scope">
					<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
						编辑
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command='{command: "a",scope:scope}'>删除分类</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</data-tables>
		<!--栏目详情-->
		<el-dialog title="栏目详情" :visible.sync="previewcol" class="previewcol">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>编号</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.index + 1}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>栏目图片</p>
					</div>
					<div class="cl-td">
						<img :src="colshowlog.pictrue" class="student_first_img2" />
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>栏目标题</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.name}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>栏目视频推荐</p>
					</div>
					<div class="cl-td">
						<p>{{ colshowlog.lessonarry }}</p>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="previewcol = false">取 消</el-button>
				<el-button type="primary" @click="customButtonsForRowone(colshowlog)">编 辑</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import api from '@/utils/api'
	export default {
		data() {
			return {
				data: [],
				colshowlog: {},
				customFilters: [{
					vals: '',
					props: ['name'],
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
				previewcol: false
			}
		},
		methods: {
			async order(scope, type) {
				if(type == 'up'){
					if(scope.$index == 0){
						this.$message.warning('已经是第一位了')
					}else{
						this.loading = true
						const nav_datas = [{
							id: scope.row.id,
							ordered: scope.row.ordered -1
						}, {
							id: this.data[scope.$index - 1].id,
							ordered: this.data[scope.$index - 1].ordered + 1
						}]
						const data = await api.ChangeNavOrder(nav_datas)
						this.gettabledata()
					}
				}
				if(type == 'down'){
					if(scope.$index == (this.data.length - 1)){
						this.$message.warning('已经是最后一位了')
					}else{
						this.loading = true
						const nav_datas = [{
							id: scope.row.id,
							ordered: scope.row.ordered +1
						}, {
							id: this.data[scope.$index + 1].id,
							ordered: this.data[scope.$index + 1].ordered - 1
						}]
						const data = await api.ChangeNavOrder(nav_datas)
						this.gettabledata()
					}
				}
			},
			colmentshow(scope) {
				this.colshowlog = scope.row;
				this.colshowlog.index = scope.$index;
				this.colshowlog.lessonarry = '';
				for(let i = 0; i < this.colshowlog.lesson_names.length; i++) {
					this.colshowlog.lessonarry += this.colshowlog.lesson_names[i] + '、'
				}
				this.previewcol = true;
			},
			customButtonsForRowone(row) {
				let id = row.id
				this.$router.push({
					name: 'editcol',
					params: {
						id
					}
				})
			},
			previewcolshow() {
				this.$router.push({
					name: 'addcol'
				})
			},
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.$confirm('真的要删除此分类吗？', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.loading = true
						axios.get('/admin/nav/' + row.scope.row.id + '/delete')
							.then((res) => {
								if(res.data.status) {
									this.data.splice(row.scope.$index, 1);
									this.$message.success(res.data.message);
								} else {
									this.$message.warning(res.data.message);
								}
								this.loading = false
							})
							.catch((error) => {
								this.loading = false
							})

					}).catch(() => {

					})

				}
			},
			gettabledata() { //栏目管理表格数据
				this.loading = true
				axios.get('/admin/nav/lists').then(res => {
					this.data = res.data;
					this.loading = false;
				}).catch(error => {
					this.loading = false
				})
			},
			deletecol(id) { //删除栏目
				this.loading = true
				axios.post('', id).then(response => {
					this.loading = false
					this.$message({
						type: 'success',
						message: '删除成功!'
					})

				}).catch(error => {
					this.loading = false
				})
			}
		},
		mounted: function() {
			this.gettabledata()
		}
	}
</script>
<style scoped>
	.order_col {
		font-size: 25px;
	}
	
	.order_stop{
		color: rgb(212, 212, 212);
	}
	
	.delete_comment {
		text-align: left
	}
	
	.xuan {
		line-height: 1;
		padding: 10px 15px;
		display: inline-block
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
	
	.class_select_width {
		width: 8rem
	}
	
	.class_input_width {
		width: 14rem
	}
	
	.student_first_img2 {
		width: 54px;
		vertical-align: middle;
		margin-right: .5rem;
		height: 54px
	}
	
	.student_show_dialog {
		border-top: 1px solid #e3e3e3;
		border-left: 1px solid #e3e3e3
	}
	
	.student_show_dialog_two {
		padding: 10px 0 10px 30px;
		border-right: 1px solid #e3e3e3;
		border-bottom: 1px solid #e3e3e3
	}
	
	.line_height_160 {
		line-height: 140px
	}
	
	.height_160 {
		height: 160px
	}
</style>