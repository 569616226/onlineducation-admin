<template>
	<div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">
			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">
				<el-col :span="6">
					<p class="student_custom_p"><span class="red">*</span>管理已经购买VIP会员服务的用户信息</p>
				</el-col>
				<el-col :span="4" :offset="14" class="text-align-right">
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索用户名">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column prop="guest" label="用户名" key="guest" sortable="custom">
				<template slot-scope="scope">
					<span class="student_first_span cursor" @click="studentshow(scope.row)">{{scope.row.guest}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="mouth" label="开通时长" key="mouth" sortable="custom">
			</el-table-column>
			<el-table-column prop="start" label="开通时间" key="start" sortable="custom">
				<template slot-scope="scope">
					<p class="student_first_p">{{scope.row.start}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="end" label="到期时间" key="end" sortable="custom">
				<template slot-scope="scope">
					<p class="student_first_p">{{scope.row.end}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="实付费用" key="price" sortable="custom">
			</el-table-column>
			<el-table-column label="操作" width="105">
				<template slot-scope="scope">
					<el-button plain @click="studentshow(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</data-tables>
		<!--学员信息-->
		<el-dialog title="会员订单详情" :visible.sync="dialogTableVisible">
			<div class="cl-box" style="width:100%;">
				<div class="cl-row">
					<div class="cl-td">
						<p>订单号</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.order_no}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>订单状态</p>
					</div>
					<div class="cl-td">
						<p v-if="studentdialog.status == '已付款'" class="green">{{studentdialog.status}}</p>
						<p v-if="studentdialog.status == '待付款'" class="red">{{studentdialog.status}}</p>
						<p v-if="studentdialog.status == '已关闭'" class="gray">{{studentdialog.status}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>订单名称</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.name}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>购买者</p>
					</div>
					<div class="cl-td">
						<p class="blue">{{studentdialog.guest}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>实付费用</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.price}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>订单创建时间</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.created_at}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>订单支付方式</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.pay_type }}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>订单付款时间</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.pay_date}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>有效期</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.mouth}}个月</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>开通时间</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.start}}</p>
					</div>
				</div>
				<div class="cl-row">
					<div class="cl-td">
						<p>到期时间</p>
					</div>
					<div class="cl-td">
						<p>{{studentdialog.end}}</p>
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
					props: ['guest'],
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
		methods: {
			studentshow(row) {
				this.studentdialog = row;
				this.dialogTableVisible = true
			},
			getVipData() {
				this.loading = true;
				axios.get('/admin/order/vip_order_list')
					.then((res) => {
						this.data = res.data;
						this.loading = false;
					})
					.catch((error) => {
						console.log('订单页面获取VIP订单报错', error)
					});
			},
		},
		watch: {

		},
		mounted: function() {
			this.getVipData();
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
</style>