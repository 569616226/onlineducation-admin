<template>
	<div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">
			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">
				<el-col :span="7">
					<el-upload name="files" ref="upload" :action="action" :show-file-list="false" :headers="uploadheaders" :on-success="handleAvatarSuccess" style="display: inline-block;">
						<el-button slot="trigger" type="primary">
							导入名单
						</el-button>
					</el-upload>
					<el-button plain @click="downloadMoBan" class="SignList-download">下载模板</el-button>
				</el-col>
				<el-col :span="15" :offset="2" class="text-align-right">
					<el-select v-model="customFilters[1].vals" placeholder="渠道来源" class="class_select_width">
						<el-option label="渠道来源" value=""></el-option>
						<div v-for="module in allmodule">
							<el-option :label="module" :value="module"></el-option>
						</div>
					</el-select>
					<el-select v-model="customFilters[2].vals" placeholder="签到状态" class="class_select_width">
						<el-option label="签到状态" value=""></el-option>
						<el-option label="已签到" value="已签到"></el-option>
						<el-option label="未签到" value="未签到"></el-option>
					</el-select>
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索姓名/手机号/公司名" class="class_input_width">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column prop="index" label="序号" key="index" sortable="custom" width="95">
				<template slot-scope="scope">
					{{ scope.$index +1 }}
				</template>
			</el-table-column>
			<el-table-column prop="name" label="姓名" key="name" sortable="custom">
				<template slot-scope="scope">
					<span class="student_first_span">{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="签到状态" key="status" sortable="custom">
				<template slot-scope="scope">
					<p v-if="scope.row.status == '未签到'" class="red">{{scope.row.status}}</p>
					<p v-if="scope.row.status == '已签到'" class="green">{{scope.row.status}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="inser_type" label="渠道来源" key="inser_type" sortable="custom">
			</el-table-column>
			<el-table-column prop="referee" label="推荐人" key="referee" sortable="custom">
			</el-table-column>
			<el-table-column prop="tel" label="手机号码" key="tel" sortable="custom">
			</el-table-column>
			<el-table-column prop="company" label="公司名" key="company" sortable="custom">
			</el-table-column>
			<el-table-column prop="offer" label="职位" key="offer" sortable="custom">
			</el-table-column>
			<el-table-column label="操作" width="135">
				<template slot-scope="scope">
					<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
						编辑
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command='{command: "a",scope:scope}'>删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</data-tables>
	</div>
</template>

<script>
	import api from '@/utils/api'
	import download_url from '@/utils/downloadUrl'
	export default {
		data() {
			return {
				data: [],
				customFilters: [{
					vals: '',
					props: ['name', 'tel', 'company']
				}, {
					vals: '',
					props: ['inser_type']
				}, {
					vals: '',
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
				//上传头像请求地址的头部信息
				uploadheaders: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + window.localStorage.getItem('jwt_token')
				},
				allmodule: []
			}
		},
		computed: {
			action() {
				const id = this.$route.params.id
				const url = `${download_url}/api/admin/train/${id}/import`
				return url
			}
		},
		methods: {
			async downloadMoBan() {
				const weburl = download_url
				const url = `${weburl}/train/down_train_template`
				window.open(url)
			},
			customButtonsForRowone(row) {
				let id = row.id
				this.$router.push({
					name: 'editSign',
					params: {
						id
					}
				})
			},
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.$confirm('真的要删除签到信息吗？删除后数据将无法恢复！', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.loading = true;
						axios.get('/admin/sign/' + row.scope.row.id + '/delete')
							.then((res) => {
								if(res.data.status) {
									this.data.splice(row.scope.$index, 1);
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
				this.loading = true
				const data = await api.getSignLists(this.$route.params.id)
				this.data = data
				for(var i = 0; i < this.data.length; i++) {
					if(this.allmodule.indexOf(this.data[i].inser_type) === -1) {
						this.allmodule.push(this.data[i].inser_type)
					}
				}
				this.loading = false
			},
			handleAvatarSuccess() {
				this.$message.success('成功导入')
				this.getData()
			}
		},
		watch: {

		},
		mounted() {
			this.getData()
		}
	}
</script>
<style scoped>
	.SignList-download {
		margin-left: 10px;
	}
	
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
		line-height: 40px;
		font-size: 14px;
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
	
	.el-dialog__header {
		border-bottom: 1px solid #e9e9e9
	}
	
	.class_select_width {
		width: 8rem
	}
</style>