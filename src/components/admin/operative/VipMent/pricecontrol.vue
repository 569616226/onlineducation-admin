<template>
	<div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">
			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">
				<el-col :span="2" class="delete_comment">
					<el-button type="primary" @click="$router.push({name: 'addprice'})">新增价格</el-button>
				</el-col>
				<el-col :span="10" :offset="12" class="text-align-right">
					<el-select v-model="customFilters[1].vals" placeholder="选择状态" class="class_select_width">
						<el-option label="全部状态" value=""></el-option>
						<el-option label="已上架" value="已上架"></el-option>
						<el-option label="已下架" value="已下架"></el-option>
						<el-option label="未上架" value="未上架"></el-option>
					</el-select>
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索名称" class="class_input_width">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column prop="name" label="名称" key="name" sortable="custom">
				<template slot-scope="scope">
					<span class="student_first_span cursor" @click="studentshow(scope.row)">{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" key="status" sortable="custom">
				<template slot-scope="scope">
					<p v-if="scope.row.status == '已上架'" class="green">{{scope.row.status}}</p>
					<p v-if="scope.row.status == '未上架'" class="red">{{scope.row.status}}</p>
					<p v-if="scope.row.status == '已下架'" class="gray">{{scope.row.status}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="expiration" label="开通时长" key="expiration" sortable="custom">
			</el-table-column>
			<el-table-column prop="price" label="售价(元)" key="price" sortable="custom">
			</el-table-column>
			<el-table-column prop="count" label="出售份数" key="count" sortable="custom">
			</el-table-column>
			<!-- 暂时没有临时上架和临时下架功能，所以没有开始时间和结束时间 -->
		<!-- 	<el-table-column prop="up" label="开始时间" key="up" sortable="custom">
			</el-table-column>
			<el-table-column prop="down" label="结束时间" key="down" sortable="custom">
			</el-table-column> -->
			<el-table-column label="操作" width="135">
				<template slot-scope="scope">
					<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo" >
						编辑
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item v-if="scope.row.status == '未上架' || scope.row.status == '已下架'" :command='{command: "b",scope:scope.row}'>上架</el-dropdown-item>
							<el-dropdown-item v-if="scope.row.status == '未上架' || scope.row.status == '已下架'" :command='{command: "a",scope:scope.row}'>删除</el-dropdown-item>
							<el-dropdown-item v-if="scope.row.status == '已上架'" :command='{command: "c",scope:scope.row}'>下架</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</data-tables>
		<!--价格详情-->
		<el-dialog title="价格详情" :visible.sync="dialogTableVisible">
			 <div class="cl-box" style="width:100%;">
                <div class="cl-row">
                    <div class="cl-td">
                         <p>名称</p>
                    </div>
                    <div class="cl-td">
                        <p>{{studentdialog.name}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                        <p>副标题</p>
                    </div>
                    <div class="cl-td">
                        <p>{{studentdialog.describle}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                        <p>状态</p>
                    </div>
                    <div class="cl-td">
                        <p v-if="studentdialog.status == '已上架'" class="green">{{studentdialog.status}}</p>
						<p v-if="studentdialog.status == '未上架'" class="red">{{studentdialog.status}}</p>
						<p v-if="studentdialog.status == '已下架'" class="gray">{{studentdialog.status}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                        <p>开通时长</p>
                    </div>
                    <div class="cl-td">
                       <p>{{studentdialog.expiration}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                        <p>售价</p>
                    </div>
                    <div class="cl-td">
                       <p>{{studentdialog.price}}</p>
                    </div>
                </div>
                <div class="cl-row">
                    <div class="cl-td">
                        <p>出售份数</p>
                    </div>
                    <div class="cl-td">
                       <p>{{studentdialog.count}}</p>
                    </div>
                </div>
             <!--    <div class="cl-row">
                    <div class="cl-td">
                        <p>开始时间</p>
                    </div>
                    <div class="cl-td">
                       <p>{{studentdialog.up}}</p>
                    </div>
                </div> 
                <div class="cl-row">
                    <div class="cl-td">
                        <p>结束时间</p>
                    </div>
                    <div class="cl-td">
                       <p>{{studentdialog.down}}</p>
                    </div>
                </div>  -->
            </div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogTableVisible = false">取消</el-button>
				<el-button type="primary" @click="customButtonsForRowone(studentdialog)" v-if="studentdialog.status == '已下架' || studentdialog.status == '未上架'">编辑</el-button>
				<!-- <el-button type="primary" @click="dialogTableVisible = false" v-if="studentdialog.status == '已上架'">下架</el-button> -->
			</div>
		</el-dialog>


		<!-- 上架模态框 -->
		<!-- <el-dialog title="价格方案上架" :visible.sync="upPrice">
			<el-form :model="ruleForm" :rules="rules" ref="upForm" label-width="100px" class="demo-ruleForm margin-left">
				<el-form-item label="选择上架时间">
					<el-radio v-model="ruleForm.uptype" :label="1">立即上架</el-radio>
					<el-radio v-model="ruleForm.uptype" :label="2">定时上架</el-radio>
					<el-form-item prop="uptime" v-if="ruleForm.uptype == 2" class="margin-bottom">
						<el-date-picker
					      v-model="ruleForm.uptime"
					      type="datetime"
					      :picker-options="pickerOptions0"
					      placeholder="选择日期时间">
					    </el-date-picker>
					</el-form-item>
					<p class="gray">选择“立即上架”后，该价格方案将立即生效！</p>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('upForm')">提交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog> -->
		<!-- 下架模态框 -->
		<!-- <el-dialog title="下架" :visible.sync="downPrice">
			 下架
			<div slot="footer" class="dialog-footer">
				<el-button @click="downPrice = false">取消</el-button>
				<el-button type="primary" @click="downPrice = false">提交</el-button>
			</div>
		</el-dialog> -->
	</div>
</template>

<script>
	// 对Date的扩展，将 Date 转化为指定格式的String
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	// 例子： 
	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
	// Date.prototype.Format = function (fmt) { //author: meizz 
	//     var o = {
	//         "M+": this.getMonth() + 1, //月份 
	//         "d+": this.getDate(), //日 
	//         "h+": this.getHours(), //小时 
	//         "m+": this.getMinutes(), //分 
	//         "s+": this.getSeconds(), //秒 
	//         "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	//         "S": this.getMilliseconds() //毫秒 
	//     };
	//     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	//     for (var k in o)
	//     if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	//     return fmt;
	// }
	export default {
		data() {
			return {
				//禁止选当前日期之前的时间
				pickerOptions0: {
				   disabledDate(time) {
				      return time.getTime() < Date.now() - 8.64e7
				   },
				 
				},
				data: [],
				ruleForm: {
					id:null,
					uptype: 1,
					uptime: null,
				},
				rules :{
					uptime: [{
						type:'object',
						required: true,
						message: '请选择上架时间',
						trigger: 'blue'
					}]
				},
				studentdialog: {},
				customFilters: [{
					vals: '',
					props: ['name'],
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
				dialogTableVisible: false,	//详情模态框标记
				upPrice: false,	   			//上架模态框标记
				downPrice: false,			//下架模态框标记
			}
		},
		methods: {
			studentshow(row) {
				this.studentdialog = row
				this.dialogTableVisible = true
			},
			customButtonsForRowone(row) {
				let id = row.id
				this.$router.push({
					name: 'editprice',
					params: {
						id
					}
				})
			},
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.$confirm('真的要删除此VIP会员销售方案吗？', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.deleteprice(row.scope.id)
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						})
					})
				}
				if(row.command == "b") {
					this.upprice(row.scope.id);
				}
				if(row.command == "c") {
					this.downprice(row.scope.id);
				}
			},
			deleteprice(id) { //删除价格
				this.loading = true
				axios.get('/admin/vip/'+ id +'/delete').then(res => {
					this.loading = false;
					if(res.data.status) {
						this.getPriceData();
						this.$message.success(res.data.message);
					}
				}).catch(error => {
					this.loading = false
				})
			},
			downprice(id) { //下架价格
				this.$confirm('真的要下架此VIP会员销售方案吗？', '下架', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						axios.get('/admin/vip/'+ id +'/down')
						.then((res) => {
							if(res.data.status) {
								this.getPriceData();
								this.upPrice = false;
								this.$message.success(res.data.message);
							}
						})
						.catch((error) => {
							console.log('提交立即下架出错',error)
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						})
					})
				
			},
			upprice(id) { //下架价格
				this.$confirm('真的要上架此VIP会员销售方案吗？', '上架', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						axios.get('/admin/vip/'+ id +'/up')
						.then((res) => {
							if(res.data.status) {
								this.getPriceData();
								this.upPrice = false;
								this.$message.success(res.data.message);
							}
						})
						.catch((error) => {
							console.log('提交立即上架出错',error)
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						})
					})
				
			},

			getPriceData(){
				this.loading = true;
				axios.get('/admin/vip/lists')
				.then((res) => {
					this.data = res.data;
					this.loading = false;
				})
			}
		},
		watch: {

		},
		mounted: function() {
			this.getPriceData();
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
.class_select_width{width:8rem}
</style>