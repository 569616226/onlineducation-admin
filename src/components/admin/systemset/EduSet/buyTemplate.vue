<template>
	<div>
	<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">

		<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">

			<el-col :span="2" class="delete_comment">
				<el-button type="primary" @click="$router.push({name: 'add_template'})">新增模板</el-button>
			</el-col>
			<el-col :span="16" :offset="6" class="text-align-right">
				<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索模板标题/模板内容" class="class_input_width">
				</el-input>
			</el-col>
		</el-row>
		<el-table-column width="255" prop="name" label="模板标题" key="name" sortable="custom">
			<template slot-scope="scope">
				<h1 @click="colmentshow(scope.row)" class="blue cursor">{{scope.row.name}}</h1>
			</template>
		</el-table-column>
		<el-table-column prop="content" label="模板内容" key="content" sortable="custom">
			<template slot-scope="scope">
				<div v-html="scope.row.content"></div>
			</template>
		</el-table-column>
		<el-table-column label="操作" width="135">
			<template slot-scope="scope">
				<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
					编辑
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item :command='{command: "a",scope:scope.row}'>删除</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</template>
		</el-table-column>
	</data-tables>
	<el-dialog title="模板详情" :visible.sync="previewcol" class="previewcol">
		<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						 <p>编号</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.id}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						 <p>模板标题</p>
					</div>
					<div class="cl-td">
						 <p>{{colshowlog.name}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>模板内容</p>
					</div>
					<div class="cl-td">
						<div v-html="colshowlog.content"></div>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>创建时间</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.created_at}}</p>
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
	export default {
		data() {
			return {
				data: [],
				customFilters: [{
					vals: '',
					props: ['name', 'content'],
				}],
				loading: false,
				multipleSelection: [],
				tableProps : {
					 border: false,    //去掉边框
        			 // stripe: false  //去掉斑马纹
				},
				//分页设置
				paginationDef : {
					 pageSize: 10,
       				 pageSizes: [10, 20, 50]
				},
				 previewcol: false,
                loading : false,
                //存放弹出框的数据
                colshowlog:{},
			}
		},
		methods: {
			getTemplate(){
				this.loading = true;
				axios.get('/admin/education/lists')
				.then(res=>{
					this.data = res.data;
					this.loading = false;
				})
				.catch(res=>{
					this.loading = false;
				})
			},
			customButtonsForRowone(row) {
				let id = row.id
				this.$router.push({
					name: 'edit_template',
					params: {
						id
					}
				})
			},
			colmentshow(row) {
                this.colshowlog = row
                this.previewcol = true
            },
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					 this.$confirm('确定删除该模板吗？', '提示', {
	                  confirmButtonText: '确定',
	                  cancelButtonText: '取消'
	                }).then(() => {
	                    this.loading = true;
						this.data.splice(row.scope.$index, 1);
						axios.get('/admin/education/'+ row.scope.id +'/delete')
						.then(res =>{
							if(res.data.status){
								this.$message.success(res.data.message);
							}else {
								this.$message.error(res.data.message);
							}
							this.loading = false;
							
						})
						.catch(err =>{
							this.loading = false;
							console.log(err)
						})
	                }).catch(() => {
	                  this.$message.info('已取消');
	                })
					
				} else if(row.command == "b") {
					//this.$message(`repairing ${row.scope.id}`);
					let ids = []
					this.multipleSelection.map((item) => {
						ids.push(item.id)
					});
				}
				//this.$message(`repairing ${command.id}`);
			}
		},
		mounted: function() {
			this.getTemplate()
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
.class_select_width{width:8rem}
.class_input_width{width:14rem}
.student_show_dialog{border-top:1px solid #e3e3e3;border-left:1px solid #e3e3e3}
.student_show_dialog_two{padding:10px 0 10px 30px;border-right:1px solid #e3e3e3;border-bottom:1px solid #e3e3e3}
.line_height_160{line-height:140px}
.height_160{height:160px}
</style>