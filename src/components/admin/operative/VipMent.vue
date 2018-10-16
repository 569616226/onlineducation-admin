<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<el-tabs v-model="activeName" type="card" class="padding-top">
			<el-tab-pane label="会员管理" name="tab1">
				<members></members>
			</el-tab-pane>
			<el-tab-pane label="价格管理" name="tab2">
				<pricecontrol></pricecontrol>
			</el-tab-pane>
			<el-tab-pane label="会员设置" name="tab3">
				<membersettings></membersettings>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import members from './../operative/VipMent/members.vue'
	import pricecontrol from './../operative/VipMent/pricecontrol.vue'
	import membersettings from './../operative/VipMent/membersettings.vue'
	export default {
		components: {
			members,
			pricecontrol,
			membersettings
		},
		data() {
			return {
				activeName: ''
			};
		},
		methods: {
			handleClick(tab, event) {
				// console.log(tab, event);
			}

		},
		mounted() {
			if(this.$route.params.tabActive == 2){
                this.activeName = 'tab2';
             }else {
                this.activeName = 'tab1';
             }
		}
	}
</script>