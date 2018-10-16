<template>
	<div v-loading="loading">
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" onclick="window.history.go(-1)"></i>{{$route.meta.title}}（{{ data.name }}）
		</div>
		<el-tabs v-model="activeName" type="card" class="padding-top">
			<el-tab-pane label="签到名单管理" name="tab1">
				<sign-list></sign-list>
			</el-tab-pane>
			<el-tab-pane label="签到二维码" name="tab2">
				<sign-code :qr_code="data.qr_code"></sign-code>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import api from '@/utils/api'
	import SignList from './../../operative/SaleMent/signMent/SignList.vue'
	import SignCode from './../../operative/SaleMent/signMent/SignCode.vue'
	export default {
		components: {
			SignList,
			SignCode
		},
		data() {
			return {
				activeName: '',
				loading: false,
				data: []
			};
		},
		methods: {
			handleClick(tab, event) {
				// console.log(tab, event);
			},
			async getData() {
				const data = await api.getTrainDetail(this.$route.params.id)
				this.data = data.train
			}
		},
		mounted() {
			if(this.$route.params.tabActive == 2){
                this.activeName = 'tab2';
             }else {
                this.activeName = 'tab1';
             }
             this.getData()
		}
	}
</script>