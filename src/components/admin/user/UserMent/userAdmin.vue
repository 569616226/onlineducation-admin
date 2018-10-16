<template>
	<div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">

			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row">

				<el-col :span="6" class="text-align-left">
					<div class="tabtips"><span class="red">*</span>用于管理在商学已经注册的用户</div>
				</el-col>
				<el-col :span="12" :offset="6" class="text-align-right">
					<el-select v-model="customFilters[1].vals" placeholder="用户组类型" class="class_select_width">
						<el-option label="全部组" value=""></el-option>
						<div v-for="label in checkList">
							<el-option :label="label.name" :value="label.name"></el-option>
						</div>
					</el-select>
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索用户名/手机号码" class="class_input_width">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column width="155" prop="nickname" label="微信昵称" key="nickname" sortable="custom">
				<template slot-scope="scope">
					<h1 @click="colmentshow(scope.row)" class="blue cursor">{{scope.row.nickname}}</h1>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="姓名" key="name" sortable="custom">
			</el-table-column>
			<el-table-column prop="role" label="角色" key="role" sortable="custom">
				<template slot-scope="scope">
					<p>{{scope.row.role.display_name}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="labels" label="用户组" key="labels" sortable="custom">
				<template slot-scope="scope">
					<p class="gray">{{scope.row.labels}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="phone" label="手机号码/绑定状态" key="phone" sortable="custom">
				<template slot-scope="scope">
					<p v-if="scope.row.phone">{{scope.row.phone}}</p>
					<p v-else>-</p>
					<p v-if="scope.row.phone" class="gray">已绑定</p>
					<p v-else class="gray">未绑定</p>
				</template>
			</el-table-column>
			</el-table-column>
			<el-table-column prop="created_at" label="注册时间" key="created_at" sortable="custom">
			</el-table-column>
			<el-table-column label="操作" width="135">
				<template slot-scope="scope">
					<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
						编辑
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command='{command: "a",scope:scope}'>设置标签</el-dropdown-item>
							<el-dropdown-item :command='{command: "b",scope:scope}' v-if="scope.row.frozen == 0">冻结</el-dropdown-item>
							<el-dropdown-item :command='{command: "c",scope:scope}' v-if="scope.row.frozen == 1">解冻</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</data-tables>
		<el-dialog title="用户详情" :visible.sync="previewcol" class="previewcol editea">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>微信昵称</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.nickname}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>头像</p>
					</div>
					<div class="cl-td">
						<img class="student_first_img2" :src="colshowlog.picture">
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>姓名</p>
					</div>
					<div class="cl-td">
						<p>{{colshowlog.name}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>用户组</p>
					</div>
					<div class="cl-td">
						<span>{{ colshowlog.labels }}</span>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>性别</p>
					</div>
					<div class="cl-td">
						<span>{{ colshowlog.gender }}</span>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>手机号码</p>
					</div>
					<div class="cl-td">
						<span>{{ colshowlog.phone }}</span>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>是否绑定</p>
					</div>
					<div class="cl-td">
						<span v-if="colshowlog.phone">已绑定</span>
						<span v-else>未绑定</span>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>公司</p>
					</div>
					<div class="cl-td">
						<span>{{ colshowlog.company }}</span>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>职位</p>
					</div>
					<div class="cl-td">
						<span>{{ colshowlog.offer }}</span>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>推荐人</p>
					</div>
					<div class="cl-td">
						<span>{{ colshowlog.referee }}</span>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>注册时间</p>
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
        <el-dialog title="设置标签" :visible.sync="labeldialog" class="labelwcol">
	 		  <el-checkbox-group v-model="checklisted">
	 		  	<div v-for="check in checkList" class="margin-right" style="display: inline-block;">
	 		  		<el-checkbox :label="check.id">{{ check.name }}</el-checkbox>
	 		  	</div>
			  </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click="labeldialog = false">取 消</el-button>
                <el-button type="primary" @click="submitLabel(colshowlog.id)">提 交</el-button>
            </div>
        </el-dialog>
	</div>

</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				ruleForm: {
	 
				},
				rules: {
				 
				},
				data: [],
				customFilters: [{
					vals: '',
					props: ['nickname', 'phone'],
				}, {
					vals: [],
					props: ['labels'],
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
				labeldialog:false,
				previewcol: false,
                loading : false,
                //存放弹出框的数据
                colshowlog:{},
                // 标签列表
                checkList: [],
                // 已经勾选上的
                checklisted:[]
			}
		},
		methods: {
			submitForm(formName) {
				let that = this
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.classcopy()
						this.$refs[formName].resetFields()
						that.classcopyvis = false
					} else {
						console.log('error submit!!')
						return false;
					}
				})
			},
			colmentshow(row) {
                this.colshowlog = row
                this.previewcol = true
            },
            customButtonsForRowone(row) {
				let id = row.id
				this.$router.push({
					name: 'EditUser',
					params: {
						id
					}
				})
			},
            //设置标签
            submitLabel(id){
            	// this.loading = true;
            	axios.post('/admin/guest/'+ id +'/set_label',{label_ids:this.checklisted})
            	.then((res) => {
            		if(res.data.status){
                    this.$message.success(res.data.message);
                    axios.get('/admin/guest/lists').then(res => {
					this.data = res.data;
					this.labeldialog = false;
					this.checklisted =[];   //提交完后设置为空
					this.gettabledata();
					// this.loading = false;
					})
                  }else {
                      this.$message.error(res.data.message);
                  }
            	})
            	.catch((error) => {
            		console.log(error)
            	})
            },
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
				 	this.labeldialog = true;
				 	this.colshowlog = row.scope.row;
				 	this.checklisted = row.scope.row.label_ids
				} else if(row.command == "b") {
					 this.$confirm('确定冻结该用户吗？','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() =>{
                        axios.get('/admin/guest/'+ row.scope.row.id +'/frozen')
                        .then((res) =>{
                            // this.data[row.scope.$index].frozen = 1;
                            this.gettabledata();
                            this.$message.success(res.data.message);
                        })
                        .catch((error) => {
                            console.log(error) 
                        });
                    }).catch(() => {
                        this.$message.info('已取消冻结');  
                    })
				}else if (row.command == "c") {
					this.$confirm('确定解冻该账号吗？','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() =>{
                        axios.get('/admin/guest/'+ row.scope.row.id +'/refrozen')
                        .then((res) =>{
                        	this.gettabledata();
                            // this.data[row.scope.$index].frozen = 0;
                            this.$message.success(res.data.message);
                        })
                        .catch((error) => {
                            console.log(error) 
                        });
                    }).catch(() => {
                        this.$message.info('已取消解冻');  
                    })
				}   
			},
			gettabledata() { //获取用户（微信注册）数据
				this.loading = true
				axios.get('/admin/guest/lists').then(res => {
					this.data = res.data;
					this.loading = false;

				}).catch(error => {
					this.loading = false
					console.log(error)
				})
			},
			getlabellist() {
				axios.get('/admin/label/lists').then(res => {
					this.checkList = res.data;
				}).catch(error => {
					console.log(error)
				})
			}
 
		},
		mounted: function() {
			this.gettabledata()
			this.getlabellist()  
		}
	}
</script>
<style>
.editea .el-checkbox{border:none}
.delete_comment{text-align:left}
.tabtips{color:#555;font-size:16px;padding-top:10px;padding-left:10px}
.xuan{line-height:1;padding:10px 15px;display:inline-block}
.demo-table-expand{font-size:0}
.demo-table-expand label{width:90px;color:#99a9bf}
.demo-table-expand .el-form-item{margin-right:0;margin-bottom:0;width:50%}
.class_el_row{margin-bottom:10px;padding:10px;background:#F5F5F5;border-radius:4px}
.student_first_img2{width:54px;border-radius:50%;vertical-align:middle;margin-right:.5rem;height:54px}
.el-table td,.el-table th{padding:12px 0 12px 10px}
.class_select_width{width:8rem}
.class_input_width{width:14rem}
.previewcourse>.el-dialog{width:300px}
.previewcourse>.el-dialog>.el-dialog__body{text-align:center}
</style>