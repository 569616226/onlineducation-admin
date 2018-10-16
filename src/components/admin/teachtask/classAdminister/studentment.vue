<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" onclick="window.history.go(-1)"></i> {{$route.meta.title}}
		</div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">
			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">
				<el-col :span="6">
					<p class="student_custom_p"><span class="red">*</span>管理已经加入课程的学员信息</p>
				</el-col>
				<el-col :span="4" :offset="14" class="text-align-right">
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索用户名">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column prop="nickname" label="学员" key="nickname" sortable="custom">
				<template slot-scope="scope">
					<img :src="scope.row.picture" class="student_first_img" /><span class="student_first_span" @click="studentshow(scope.row)">{{scope.row.nickname}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="learned_per" label="学习进度" key="learned_per" sortable="custom">
			</el-table-column>
			<el-table-column prop="time" label="加入时间" key="time" sortable="custom">
				<template slot-scope="scope">
					<p class="student_first_p">{{scope.row.add_date}}</p>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="105">
				<template slot-scope="scope">
					<el-button plain @click="studentshow(scope.row)">查看</el-button>
				</template>
			</el-table-column>
		</data-tables>
		<!--学员信息-->
		<el-dialog title="学员信息" :visible.sync="dialogTableVisible">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>用户名</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.nickname}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>用户头像</p>
					</div>
					<div class="cl-td">
						<img :src="studentdialog.picture" class="student_first_img2" />
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>性别</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.gender}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>手机号码</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.phone}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>学习进度</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.learned_per}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>加入时间</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.add_date}}</p>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogTableVisible = false">关 闭</el-button>
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
					props: ['nickname'],
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
			studentshow(row) {
				this.studentdialog = row
				this.dialogTableVisible = true
			},
			getData(){
				this.loading = true;
				let id = this.$route.params.id;
				axios.get('/admin/lesson/'+ id + '/student/lists')
				.then((res) => {
					this.data = res.data.data
					this.loading = false;
				})
				.catch((error) => {
					console.log(error);
				})
			}
		},
		mounted: function() {
			this.getData();
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