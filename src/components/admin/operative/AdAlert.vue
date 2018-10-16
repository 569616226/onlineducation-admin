<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">
			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">
				<el-col :span="2" class="delete_comment">
					<el-button type="primary" @click="$router.push({name: 'addadalert'})">新建图片</el-button>
				</el-col>
				<el-col :span="4" :offset="18" class="text-align-right">
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索标题">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column prop="order" label="排序" key="order" sortable="custom" width="95">
			</el-table-column>
			<el-table-column prop="name" label="图片说明" key="name" sortable="custom">
				<template slot-scope="scope">
					<span class="blue cursor" @click="studentshow(scope)">{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="path" label="轮播图片地址" key="path" sortable="custom">
			</el-table-column>
			<el-table-column prop="url" label="轮播图片链接" key="url" sortable="custom">
			</el-table-column>
			<el-table-column prop="created_at" label="创建时间" key="created_at" sortable="custom">
				<template slot-scope="scope">
					<p class="student_first_p">{{scope.row.created_at}}</p>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="135">
				<template slot-scope="scope">
					<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
						编辑
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command='{command: "a",scope:scope}'>删除图片</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</data-tables>
		<!--广告详情-->
		<el-dialog title="广告详情" :visible.sync="dialogTableVisible">
			<div class="cl-box" style="width:100%;">
                <div class="cl-row">
                    <div class="cl-td">
                          <p>图片说明</p>
                    </div>
                    <div class="cl-td">
                         <p>{{studentdialog.name}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                         <p>广告图片</p>
                    </div>
                    <div class="cl-td">
                        <img :src="studentdialog.path" width="125"/>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                        <p>轮播图片地址</p>
                    </div>
                    <div class="cl-td">
                        <p class="text_overflow">{{studentdialog.path}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                       <p>轮播图片链接</p>
                    </div>
                    <div class="cl-td">
                        <p class="text_overflow">{{studentdialog.url}}</p>
                    </div>
                </div>
                 <div class="cl-row">
                    <div class="cl-td">
                       <p>创建时间</p>
                    </div>
                    <div class="cl-td">
                    	<p>{{studentdialog.created_at}}</p>
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
	export default {
		data() {
			return {
				data: [],
				studentdialog: {},
				customFilters: [{
					vals: '',
					props: ['name'],
				}],
				loading: false,
				multipleSelection: [],
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
		methods: {
			studentshow(scope) {
				this.studentdialog = scope.row;
				this.dialogTableVisible = true
			},
			customButtonsForRowone(row) {
				let id = row.id
				this.$router.push({
					name: 'editadalert',
					params: {
						id
					}
				})
			},
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.$confirm('真的要删除此课程吗？', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.loading = true;
                         axios.get('/admin/advert/' + row.scope.row.id + '/delete')
                        .then((res) => {
                            this.data.splice(row.scope.$index, 1);
                            this.$message.success(res.data.message);
                            this.loading = false;
                        })
                        .catch((error) => {
                            console.log(error);
                        })
					}).catch(() => {

					})
				}
			},
			getData() {
				this.loading = true;
				axios.get('/admin/advert/lists')
				.then((res) => {
					this.data = res.data;
					this.loading = false;
				})
				.catch((error) => {
					console.log(error)
				})
			}
		},
		watch: {

		},
		mounted: function() {
			this.getData()
		}
	}
</script>
<style scoped>
.student_first_img{width:34px;border-radius:50%;vertical-align:middle;margin-right:.5rem}
.student_first_img2{width:54px;border-radius:50%;vertical-align:middle;margin-right:.5rem}
.student_first_span{color:#3c8cd6;font-weight:700}
.class_el_row{margin-bottom:10px;padding:10px;background:#F5F5F5;border-radius:4px}
.class_input_width{width:14rem}
.student_custom_p{color:#555;line-height:40px}
.student_show_dialog{border-top:1px solid #e3e3e3;border-left:1px solid #e3e3e3}
.student_show_dialog_two{padding:10px 0 10px 30px;border-right:1px solid #e3e3e3;border-bottom:1px solid #e3e3e3}
.el-table td,.el-table th{padding:12px 0 12px 10px}
.el-dialog__header{border-bottom:1px solid #e9e9e9}
</style>