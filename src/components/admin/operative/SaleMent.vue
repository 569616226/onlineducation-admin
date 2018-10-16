<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<data-tables v-loading="loading" :data="TrainListsData" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">
			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">
				<el-col :span="2" class="delete_comment">
					<el-button type="primary" @click="$router.push({name: 'addSale'})">新建会议</el-button>
				</el-col>
				<el-col :span="16" :offset="6" class="text-align-right">
					<el-select v-model="customFilters[1].vals" placeholder="收费类型" class="class_select_width">
						<el-option label="选择状态" value=""></el-option>
						<el-option label="未开始" value="未开始"></el-option>
						<el-option label="进行中" value="进行中"></el-option>
						<el-option label="已结束" value="已结束"></el-option>
					</el-select>
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索活动标题" class="class_input_width">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column prop="index" label="序号" key="index" sortable="custom" width="95">
				<template slot-scope="scope">
					{{ scope.$index +1 }}
				</template>
			</el-table-column>
			<el-table-column prop="name" label="会议标题" key="name" sortable="custom">
				<template slot-scope="scope">
					<span class="blue cursor" @click="studentshow(scope)">{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" key="status" sortable="custom">
				<template slot-scope="scope">
					<p v-if="scope.row.status == '未开始'" class="red">{{scope.row.status}}</p>
					<p v-if="scope.row.status == '进行中'" class="green">{{scope.row.status}}</p>
					<p v-if="scope.row.status == '已结束'" class="gray">{{scope.row.status}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="start_at" label="开始时间" key="start_at" sortable="custom">
				<template slot-scope="scope">
					<p class="student_first_p">{{scope.row.start_at}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="end_at" label="结束时间" key="end_at" sortable="custom">
				<template slot-scope="scope">
					<p class="student_first_p">{{scope.row.end_at}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="creator" label="创建人" key="creator" sortable="custom">
				<template slot-scope="scope">
					<p class="student_first_p">{{scope.row.creator}}</p>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="135">
				<template slot-scope="scope">
					<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
						管理
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command='{command: "a",scope:scope}'>删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</data-tables>
		<!--会销详情-->
		<el-dialog title="会销详情" :visible.sync="dialogTableVisible">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>编号</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.index + 1}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>会议标题</p>
					</div>
					<div class="cl-td">
						<p class="text_overflow">{{studentdialog.name}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>状态</p>
					</div>
					<div class="cl-td">
						<p class="text_overflow">{{studentdialog.status}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>开始时间</p>
					</div>
					<div class="cl-td">
						<p class="text_overflow">{{studentdialog.start_at}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>结束时间</p>
					</div>
					<div class="cl-td">
						<p class="text_overflow">{{studentdialog.end_at}}</p>
						<!-- <p>{{}}</p> -->
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>创建人</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.creator}}</p>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogTableVisible = false">取 消</el-button>
				<el-button type="primary" @click="customButtonsForRowone(studentdialog)">编 辑</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import api from '@/utils/api'
	export default {
		data() {
			return {
				data: [],
				// 模态框数据
				studentdialog: {},
				customFilters: [{
					vals: '',
					props: ['name'],
				}, {
					vals: [],
					props: ['status']
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
				dialogTableVisible: false
			}
		},
		computed: {
			...mapState({
				TrainListsData: state => state.Admin.TrainListsData
			})
		},
		methods: {
			...mapActions([
				'getTrainLists'
			]),
			studentshow(scope) {
				this.studentdialog = scope.row;
				this.studentdialog.index = scope.$index;
				this.dialogTableVisible = true
			},
			customButtonsForRowone(row) {
				let id = row.id
				this.$router.push({
					name: 'manageSale',
					params: {
						id
					}
				})
			},
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.$confirm('真的要删除该会议吗？', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.loading = true;
						axios.get('/admin/train/' + row.scope.row.id + '/delete')
							.then((res) => {
								if(res.data.status) {
									this.TrainListsData.splice(row.scope.$index, 1);
									this.$message.success(res.data.message);
								} else {
									this.$message.error(res.data.message);
								}
								this.loading = false;
							})
							.catch((error) => {
								console.log(error);
							})
					}).catch(() => {

					})

				}
			},
			async getData() {
				if(this.TrainListsData.length == 0) {
					this.loading = true
				}
				await this.getTrainLists()
				this.loading = false
			},
		},
		mounted: function() {
			this.getData()
		}
	}
</script>
<style scoped>
	.student_first_img {
		width: 34px;
		border-radius: 50%;
		vertical-align: middle;
		margin-right: .5rem
	}
	
	.student_first_img2 {
		width: 54px;
		border-radius: 50%;
		vertical-align: middle;
		margin-right: .5rem
	}
	
	.student_first_span {
		color: #3c8cd6;
		font-weight: 700
	}
	
	.class_el_row {
		margin-bottom: 10px;
		padding: 10px;
		background: #F5F5F5;
		border-radius: 4px
	}
	
	.class_input_width {
		width: 14rem
	}
	
	.student_custom_p {
		color: #555;
		line-height: 40px
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
	
	.el-table td,
	.el-table th {
		padding: 12px 0 12px 10px
	}
	
	.el-dialog__header {
		border-bottom: 1px solid #e9e9e9
	}
	
	.ins_img {
		width: 54px;
		height: 54px;
		border-radius: 50%
	}
	
	.text_overflow_line {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical
	}
</style>