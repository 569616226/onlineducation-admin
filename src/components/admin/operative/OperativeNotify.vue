<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<el-tabs v-model="activeName" type="card" class="padding-top">
            <el-tab-pane label="群发消息" name="tab1">
                 <data-tables v-loading="loading" :data="data1" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">
					<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">
						<el-col :span="2" class="delete_comment">
							<el-button type="primary" @click="$router.push({name: 'chooseoperative'})">发送消息</el-button>
						</el-col>
						<el-col :span="4" :offset="18" class="text-align-right">
							<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索标题/创建者">
							</el-input>
						</el-col>
					</el-row>
					<el-table-column prop="title" label="消息标题" key="title" sortable="custom">
						<template slot-scope="scope">
							<span class="blue cursor" @click="studentshow1(scope)">{{scope.row.title}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="message_type" label="消息类型" key="message_type" sortable="custom">
					</el-table-column>
					<el-table-column prop="label" label="接收人" key="label" sortable="custom">
					</el-table-column>
					<el-table-column prop="user" label="发布人" key="user" sortable="custom">
						<template slot-scope="scope">
							<p class="blue">{{scope.row.user}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="created_at" label="发布时间" key="created_at" sortable="custom">
						<template slot-scope="scope">
							<p class="student_first_p">{{scope.row.created_at}}</p>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="105">
						<template slot-scope="scope">
							<el-button plain @click="studentshow1(scope)">查看</el-button>
						</template>
					</el-table-column>
				</data-tables>
            </el-tab-pane>


            <el-tab-pane label="系统推送消息" name="tab2">
          			 <data-tables v-loading="loading" :data="data2" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">
					<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">
						<el-col :span="10" class="delete_comment student_custom_p">
							 <span class="red">*</span>显示系统发送的模板消息记录
						</el-col>
						<el-col :span="4" :offset="10" class="text-align-right">
							<el-input v-model="customFilters[1].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索标题/创建者">
							</el-input>
						</el-col>
					</el-row>
					<el-table-column prop="title" label="消息标题" key="title" sortable="custom" width="520">
						<template slot-scope="scope">
							<span class="blue cursor" @click="studentshow2(scope)">{{scope.row.title}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="guest" label="接收人" key="guest" sortable="custom">
					</el-table-column>
					<el-table-column prop="user" label="发布人" key="user" sortable="custom">
						<template slot-scope="scope">
							<p v-if="scope.row.user">{{scope.row.user}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="created_at" label="发布时间" key="created_at" sortable="custom">
						<template slot-scope="scope">
							<p class="student_first_p">{{scope.row.created_at}}</p>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="105">
						<template slot-scope="scope">
							<el-button plain @click="studentshow2(scope)">查看</el-button>
						</template>
					</el-table-column>
				</data-tables>
            </el-tab-pane>
        </el-tabs>
		
		<!--信息详情-->
		<el-dialog title="通知详情" :visible.sync="dialogTableVisible1">
			<div class="cl-box" style="width:100%;">
                <div class="cl-row">
                    <div class="cl-td">
                          <p>消息标题</p>
                    </div>
                    <div class="cl-td">
                         <p>{{messagedialog1.title}}</p>
                    </div>
                </div>
                 <div class="cl-row" v-if="messagedialog1.picture">
                    <div class="cl-td">
                         <p>图片</p>
                    </div>
                    <div class="cl-td">
                         <img style="width:240px; height:135px;" :src="messagedialog1.picture">
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                         <p>消息内容</p>
                    </div>
                    <div class="cl-td">
                          <div v-html="messagedialog1.content"></div>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                        <p>接收人</p>
                    </div>
                    <div class="cl-td">
                        <p>{{messagedialog1.label}} ( {{messagedialog1.guest_lists}} )</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                         <p>发布人</p>
                    </div>
                    <div class="cl-td">
                        <p>{{messagedialog1.user}}</p>
                    </div>
                </div> 
                <div class="cl-row">
                    <div class="cl-td">
                         <p>创建时间</p>
                    </div>
                    <div class="cl-td">
                        <p>{{messagedialog1.created_at}}</p>
                    </div>
                </div>                 
            </div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogTableVisible1 = false">关 闭</el-button>
			</div>
		</el-dialog>

		<el-dialog title="通知详情" :visible.sync="dialogTableVisible2">
			<div class="cl-box" style="width:100%;">
                <div class="cl-row">
                    <div class="cl-td">
                          <p>消息标题</p>
                    </div>
                    <div class="cl-td">
                         <p>{{messagedialog2.title}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                         <p>消息内容</p>
                    </div>
                    <div class="cl-td">
                          <div v-html="messagedialog2.content"></div>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                        <p>接收人</p>
                    </div>
                    <div class="cl-td">
                        <p>{{messagedialog2.guest}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                         <p>发布人</p>
                    </div>
                    <div class="cl-td">
                        <p>{{messagedialog2.user}}</p>
                    </div>
                </div> 
                <div class="cl-row">
                    <div class="cl-td">
                         <p>创建时间</p>
                    </div>
                    <div class="cl-td">
                        <p>{{messagedialog2.created_at}}</p>
                    </div>
                </div>                 
            </div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogTableVisible2 = false">关 闭</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				data1: [],
				data2: [],
				activeName:'tab1',
				messagedialog1: {},
				messagedialog2: {},
				customFilters: [{
					vals: '',
					props: ['title','user'],
				},
				{
					vals: '',
					props: ['title','user'],
				}
				],
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
				dialogTableVisible1: false,
				dialogTableVisible2: false
			}
		},
		methods: {
			studentshow1(scope) {
				this.messagedialog1 = scope.row;
				this.dialogTableVisible1 = true;
			},
			studentshow2(scope) {
				this.messagedialog2 = scope.row;
				this.dialogTableVisible2 = true;
			},
			getdata1(){
				return axios.get('/admin/message/lists');
			},
			getdata2(){
				return axios.get('/admin/message/sys_list');
			},
			getdata(){
				this.loading = true;
				axios.get('/admin/message/lists')
				.then((res) => {
					this.data1 = res.data;
					this.loading = false;
				})
				.catch((error) => {
					console.log(error)
				})
			},
		},
		watch: {

		},
		mounted: function() {
			// this.getdata()
			this.loading = true;
			axios.all([this.getdata1(), this.getdata2()])
			  .then(axios.spread((data1, data2) => {
			     	this.data1 = data1.data;
			     	this.data2 = data2.data;
			     	this.loading = false;
			  }));
		}
	}
</script>
<style scoped>
.student_first_img{width:34px;border-radius:50%;vertical-align:middle;margin-right:.5rem}
.student_first_img2{width:54px;border-radius:50%;vertical-align:middle;margin-right:.5rem}
.student_first_span{color:#3c8cd6;font-weight:700}
.class_el_row{margin-bottom:10px;padding:10px;background:#F5F5F5;border-radius:4px}
.class_input_width{width:14rem}
.student_custom_p{color:#555;line-height:40px;font-size: 14px;}
.student_show_dialog{border-top:1px solid #e3e3e3;border-left:1px solid #e3e3e3}
.student_show_dialog_two{padding:10px 0 10px 30px;border-right:1px solid #e3e3e3;border-bottom:1px solid #e3e3e3}
.el-table td,.el-table th{padding:12px 0 12px 10px}
.el-dialog__header{border-bottom:1px solid #e9e9e9}
</style>