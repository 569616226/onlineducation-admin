<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<el-tabs v-model="activeName2" type="card" class="padding-top">
			<el-tab-pane label="课程订单" name="first">
				<classorder :data="classorderdata" :loading="iloading"></classorder>
			</el-tab-pane>
			<el-tab-pane label="会员订单" name="second">
				<userorder :data="userorderdata" :loading="iloading"></userorder>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import classorder from './../order/OrderMent/classorder.vue'
	import userorder from './../order/OrderMent/userorder.vue'
	export default {
		components: {
			classorder,
			userorder
		},
		data() {
			return {
				activeName2: 'first',
				classorderdata: [],
				userorderdata: [],
				iloading: false
			};
		},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
			},
			// 获取课程订单
			getClassData() {
				this.iloading = true;
				axios.get('/admin/order/lists')
				.then((res) => {
					// console.log(res);
					for(let i in res.data){
						//判断订单类型是不是课程订单
						if(res.data[i].type == 1) {
							this.classorderdata.push(res.data[i]);
						}
					}
					for(let i in res.data){
						//判断订单类型是不是课程订单
						if(res.data[i].type == 2) {
							this.userorderdata.push(res.data[i]);
						}
					}
					this.iloading = false;
					// console.log('课程订单',this.data)
				})
				.catch((error) => {
					console.log('订单页面获取课程订单报错',error)
				});
			}
		},
		mounted: function() {
			this.getClassData();
		}
	}
</script>