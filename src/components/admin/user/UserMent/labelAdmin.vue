<template>
	<div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">

			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">

				<el-col :span="6" class="text-align-left">
					<el-button type="primary" @click="$router.push({name: 'add_label'})">新建组</el-button>
				</el-col>
				<el-col :span="12" :offset="6" class="text-align-right">
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索组名称" class="class_input_width">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column width="180" prop="index" label="编号" key="index" sortable="custom">
				<template slot-scope="scope">
					{{scope.$index + 1}}
				</template>
			</el-table-column>
			<el-table-column prop="name" label="用户组" key="name" sortable="custom">
				<template slot-scope="scope">
					<h1 @click="colmentshow(scope)" class="blue cursor">{{scope.row.name}}</h1>
				</template>
			</el-table-column>
			<el-table-column prop="created_at" label="创建时间" key="created_at" sortable="custom">
			</el-table-column>
			<el-table-column label="操作" width="135">
				<template slot-scope="scope">
					<el-dropdown split-button @click="editlabel(scope.row)" @command="customButtonsForRowtwo">
						编辑
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command='{command: "a",scope:scope}'>删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</data-tables>
		<el-dialog title="用户组详情" :visible.sync="previewcol" class="previewcol">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>编号</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.index + 1 }}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>用户组</p>
					</div>
					<div class="cl-td">
						<span>{{ colshowlog.name }}</span>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>创建时间</p>
					</div>
					<div class="cl-td">
						<span>{{ colshowlog.created_at }}</span>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="previewcol = false">取 消</el-button>
				<el-button type="primary" @click="editlabel(colshowlog)">编 辑</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	export default {
		components: {},
		data() {
			return {
				ruleForm: {

				},
				rules: {

				},
				data: [],
				customFilters: [{
					vals: '',
					props: ['name'],
				}, {
					vals: []
				}, {
					vals: []
				}, {
					vals: []
				}, {
					vals: []
				}],
				tableProps: {
					border: false, //去掉边框
					// stripe: false  //去掉斑马纹
				},
				//分页设置
				paginationDef: {
					pageSize: 10,
					pageSizes: [10, 20, 50]
				},
				downloadButton: false,
				previewcourse: false,
				classcopyvis: false,
				previewcol: false,
				loading: false,
				//存放弹出框的数据
				colshowlog: {},
			}
		},
		methods: {
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.$confirm('确定删除该组吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消'
						})
						.then(() => {
							this.loading = true;
							axios.get('/admin/label/' + row.scope.row.id + '/delete')
								.then((res) => {
									if(res.data.status) {
										this.data.splice(row.scope.$index, 1);
										this.$message.success(res.data.message);
									}else{
										this.$message.warning(res.data.message);
									}
									this.loading = false;
								})
								.catch((error) => {
									console.log(error);
								})
						}).catch(() => {
							this.$message.info('已取消');
						})
				}
			},
			editlabel(row) {
				// this.$message(`repairing ${row.id}`)
				let id = row.id;
				this.$router.push({
					name: 'edit_label',
					params: {
						id
					}
				})
			},
			colmentshow(scope) {
				this.colshowlog = scope.row;
				this.colshowlog.index = scope.$index;
				this.previewcol = true
			},
			gettabledata() { //课程管理表格数据
				this.loading = true
				axios.get('/admin/label/lists').then(res => {
					this.data = res.data;
					this.loading = false

				}).catch(error => {
					console.log(error)
					this.loading = false
				})
			},

		},
		mounted: function() {
			this.gettabledata()
		}
	}
</script>
<style>
	.delete_comment {
		text-align: left
	}
	
	.tabtips {
		color: #555;
		font-size: 14px;
		padding-top: 10px;
		padding-left: 10px
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
	
	.previewcourse>.el-dialog {
		width: 300px
	}
	
	.previewcourse>.el-dialog>.el-dialog__body {
		text-align: center
	}
</style>