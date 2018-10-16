<template>
	<div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">
			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">
				<el-col :span="6">
					<p class="student_custom_p"><span class="red">*</span>查看所有课程的订单</p>
				</el-col>
				<el-col :span="18" class="text-align-right">
					<el-date-picker v-model="seDate" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择日期范围" @change="setEndDate"></el-date-picker>
					<el-select v-model="customFilters[1].vals" placeholder="订单状态" class="class_select_width">
						<el-option label="全部状态" value=""></el-option>
						<el-option label="已付款" value="已付款"></el-option>
						<el-option label="待付款" value="待付款"></el-option>
						<!-- <el-option label="已关闭" value="已关闭"></el-option> -->
					</el-select>
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索订单名称/购买者" class="class_input_width">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column prop="name" label="订单名称" key="name" sortable="custom">
				<template slot-scope="scope">
					<h1 class="blue cursor" @click="studentshow(scope.row)">{{scope.row.name}}</h1>
					<span>订单号：{{scope.row.order_no}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="created_at" label="创建时间" key="created_at" sortable="custom">
				<template slot-scope="scope">
					<p class="gray">{{scope.row.created_at}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" key="status" sortable="custom">
				<template slot-scope="scope">
					<!-- <div>{{ scope.row.status }}</div> -->
					<p v-if="scope.row.status == '已付款'" class="green">{{scope.row.status}}</p>
					<p v-if="scope.row.status == '待付款'" class="red">{{scope.row.status}}</p>
					<!-- <p v-if="scope.row.status == '已关闭'" class="gray">{{scope.row.status}}</p> -->
				</template>
			</el-table-column>
			<el-table-column prop="price" label="实付金额" key="price" sortable="custom">
				<template slot-scope="scope">
					<p class="student_first_p">{{scope.row.price}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="guest" label="购买者" key="guest" sortable="custom">
			</el-table-column>
			<el-table-column prop="pay_type" label="支付渠道" key="pay_type" sortable="custom">
				<template slot-scope="scope">
					<p>{{scope.row.pay_type}}</p>
					<span>{{scope.row.pay_date}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="105">
				<template slot-scope="scope">
					<el-button plain @click="studentshow(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</data-tables>
		<!--学员信息-->
		<el-dialog title="课程订单详情" :visible.sync="dialogTableVisible">
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
                        <p>{{ studentdialog.pay_type }}</p>
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
            </div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogTableVisible = false">关 闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	Date.prototype.format = function() {
		var s = '';
		var mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1));
		var day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());
		s += this.getFullYear() + '-'; // 获取年份。  
		s += mouth + "-"; // 获取月份。  
		s += day; // 获取日。  
		return(s); // 返回日期。  
	};
	export default {
		props: ["data","loading"],
		data() {
			return {
				studentdialog: {},
				customFilters: [{
					vals: '',
					props: ['order_no','name', 'guest'],
				}, {
					vals: '',
					props: ['status']
				}, {
					vals: ''
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
				dialogTableVisible: false,
				seDate: null,
			}
		},
		methods: {
			studentshow(row) {
				this.studentdialog = row;
				this.dialogTableVisible = true
			},
			setEndDate(val) {
				if(val == null) {
					this.customFilters[2].vals = "";
					console.log(this.customFilters[2].vals);
				} else {
					let begin = this.$options.methods.getDates(this.seDate[0]);
					let end = this.$options.methods.getDates(this.seDate[1]);
					this.customFilters[2].vals = this.$options.methods.getAll(begin, end);
					console.log(this.customFilters[2].vals);
				}
			},
			getDates(date) {
				let elDate = new Date(date);
				return elDate.getFullYear() + '-' + (elDate.getMonth() + 1) + '-' + elDate.getDate();
			},
			getAll(begin, end) {
				var ab = begin.split("-");
				var ae = end.split("-");
				var db = new Date();
				db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
				var de = new Date();
				de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
				var unixDb = db.getTime();
				var unixDe = de.getTime();
				let idsdate = [];
				for(var k = unixDb; k <= unixDe;) {
					idsdate.push((new Date(parseInt(k))).format());
					k = k + 24 * 60 * 60 * 1000;
				}
				return idsdate;
			}
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
.el-dialog__header{border-bottom:1px solid #e9e9e9}
.class_select_width{width:8rem}
</style>