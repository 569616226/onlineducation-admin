<template>
	<div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">

			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">

				<el-col :span="2" class="delete_comment">
					<el-button type="primary" @click="$router.push({name: 'SelectClass'})">新建课程</el-button>
				</el-col>
				<el-col :span="16" :offset="6" class="text-align-right">
					<el-select v-model="customFilters[1].vals" placeholder="课程栏目" class="class_select_width">
						<el-option label="全部栏目" value=""></el-option>
						<!-- navlist -->
						<div v-for="nav in navlist">
							<el-option :label="nav.name" :value="nav.name"></el-option>
							
						</div>
						<!-- <el-option label="VIP破" value="VIP破"></el-option> -->
					</el-select>
					<el-select v-model="customFilters[2].vals" placeholder="收费类型" class="class_select_width">
						<el-option label="全部类型" value=""></el-option>
						<el-option label="访谈课程" value="访谈课程"></el-option>
						<el-option label="免费课程" value="免费课程"></el-option>
						<el-option label="vip课程" value="vip课程"></el-option>
						<el-option label="付费课程" value="付费课程"></el-option>
					</el-select>
					<el-select v-model="customFilters[3].vals"  placeholder="课程状态" class="class_select_width">
						<el-option label="全部状态" value=""></el-option>
						<el-option label="已上架" value="已上架"></el-option>
						<el-option label="已下架" value="已下架"></el-option>
						<el-option label="未上架" value="未上架"></el-option>
					</el-select>
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索课程名称" class="class_input_width">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column width="85" prop="index" label="编号" key="index" sortable="custom">
				<template slot-scope="scope">
                    <div>{{scope.$index  + 1}}</div>
             	</template>
			</el-table-column>
			<el-table-column width="255" prop="name" label="课程名称" key="name" sortable="custom">
				<template slot-scope="scope">
					<h1 class="blue cursor" @click="customButtonsForRowone(scope.row)">{{scope.row.name}}</h1>
					<span>类型：{{scope.row.type}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="type" label="收费类型" key="type" sortable="custom">
			</el-table-column>
			<el-table-column prop="nav_name" label="栏目" key="nav_name" sortable="custom">
				<template slot-scope="scope">
		 			<div>{{ scope.row.nav_name }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" key="status" sortable="custom">
				<template slot-scope="scope">
					<p v-if="scope.row.status == '未上架'" class="gray">未上架</p>
					<p v-if="scope.row.status == '已下架'" class="red ">已下架</p>
					<p v-if="scope.row.status == '已上架'" class="green">已上架</p>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="价格" key="price" sortable="custom">
			</el-table-column>
			<el-table-column prop="students" label="学员数" key="students" sortable="custom">
			</el-table-column>
			<el-table-column prop="created_at" label="创建时间" key="created_at" sortable="custom">
				<template slot-scope="scope">
					<span>{{scope.row.created_at}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="135">
				<template slot-scope="scope">
					<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
						管理
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command='{command: "a",scope:scope.row}'>预览</el-dropdown-item>
							<!-- <el-dropdown-item :command='{command: "b",scope:scope.row}'>复制课程</el-dropdown-item> -->
							<el-dropdown-item :command='{command: "c",scope:scope.row}' v-if="scope.row.status == '未上架' || scope.row.status == '已下架'">上架课程</el-dropdown-item>
							<el-dropdown-item :command='{command: "d",scope:scope.row}' v-if="scope.row.status == '已上架'">下架课程</el-dropdown-item>
							<el-dropdown-item :command='{command: "e",scope:scope.row}' v-if="scope.row.status == '未上架' || scope.row.status == '已下架'">删除课程</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</data-tables>
		<!--预览课程-->
		<el-dialog title="预览课程" :visible.sync="previewcourse" class="previewcourse">
			<vue-q-art :config="config" :downloadButton="downloadButton"></vue-q-art>
			<p class="dialog_p">预览课程只提供页面展示，不可操作！</p>
		</el-dialog>
	</div>

</template>

<script>
	import VueQArt from 'vue-qart'
	import qart from '../../../../assets/qart.png'
	export default {
		components: {
			VueQArt
		},
		data() {
			return {
				ruleForm: {
					el_title: '',
					id: ''
				},
				rules: {
					el_title: [{
						required: true,
						message: '请输入课程新标题',
						trigger: 'blur'
					}]
				},
				data: [],
				navlist:[],
				customFilters: [{
					vals: '',
					props: ['name'],
				}, {
					vals: [],
					props: ['nav_name']
				}, {
					vals: [],
					props:['type']
				}, {
					vals: [],
					props:['status']
				}, {
					vals: []
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
				msg: 'Welcome to Your Vue.js App',
				config: {
					value: 'https://www.baidu.com',
					imagePath: qart,
					filter: 'color'
				},
				downloadButton: false,
				previewcourse: false,
				// classcopyvis: false
			}
		},
		methods: {
			customButtonsForRowone(row) {
				let id = row.id
				this.$router.push({
					name: 'managetask',
					params: {
						id
					}
				})
			},
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.config.value = 'http://mobile.edu.elinkport.com/#/preview/'+row.scope.id
					this.previewcourse = true
				} else if(row.command == "b") {
					// this.ruleForm.id = row.scope.id
					// this.classcopyvis = true
				} else if(row.command == "c") {
					this.$confirm('你确定要上架此课程？', '上架课程', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(() => {
						this.sheifclass(row.scope.id);
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						})
					})
				} else if(row.command == "d") {
					this.$confirm('你确定要下架此课程？课程关闭后，正在学习的学员将可以继续学习。', '下架课程', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(() => {
						this.undersheifclass(row.scope.id);
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						})
					})
				} else if(row.command == "e") {
					this.$confirm('你确定要删除此课程吗？删除课程后，课程所有相关数据将无法找回！', '删除课程', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.deleteclass(row.scope.id);
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						})
					})
				}
			},
			gettabledata() { //课程管理表格数据
				this.loading = true
				axios.get('/admin/lesson/lists').then(res => {
					this.data = res.data.lessons;
					this.navlist = res.data.nav;
					for(let i = 0; i<this.data.length; i++){
						this.data[i].nav_name = this.data[i].nav.name;
					}
					this.loading = false;
				}).catch(error => {
					this.loading = false
				})
			},
			sheifclass(id) { //上架课程
				this.loading = true
				axios.get('/admin/lesson/' + id + '/up').then(res => {
					if(res.data.status) {
						this.gettabledata();
						this.$message.success(res.data.message);
					}else {
						this.$message.warning(res.data.message);
						this.loading = false
					}
				}).catch(error => {
					this.loading = false
				})
			},
			undersheifclass(id) { //下架课程
				this.loading = true
				axios.get('/admin/lesson/' + id + '/down').then(res => {
					if(res.data.status) {
						this.gettabledata();
						this.$message.success(res.data.message);
					}else {
						this.$message.warning(res.data.message);
						this.loading = false
					}
				}).catch(error => {
					this.loading = false
				})
			},
			deleteclass(id) { //删除课程
				this.loading = true
				axios.get('/admin/lesson/' + id + '/delete').then(res => {
					this.loading = false
					if(res.data.status) {
						this.gettabledata();
						this.$message.success(res.data.message);
					}else {
						this.$message.warning(res.data.message);
						this.loading = false
					}
				}).catch(error => {
					this.loading = false
				})
			}
		},
		mounted: function() {
			this.gettabledata();
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
.previewcourse>.el-dialog{width:300px}
.previewcourse>.el-dialog>.el-dialog__body{text-align:center}
</style>
<style>
.previewcourse>.el-dialog{width:300px}
.previewcourse>.el-dialog>.el-dialog__body{text-align:center}
</style>