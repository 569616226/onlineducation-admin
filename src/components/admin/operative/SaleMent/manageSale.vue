<template>
	<div v-loading="loading">
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" onclick="window.history.go(-1)"></i> {{$route.meta.title}}
		</div>
		<el-row class="manage_first margin-top-sm">
			<el-col :span="18">
				<img style="width:120px;height:70px;" :src="data.pic" />
				<div class="manage_first_title">
					<h1>{{data.name}}</h1>
					<span v-if="data.status == '进行中'" class="green_bg">进行中</span>
					<span v-if="data.status == '已结束'" class="gray_bg">已结束</span>
					<span v-if="data.status == '未开始'" class="red_bg">未开始</span>
					<p>会议时间：<span>{{ data.start_at }}</span>至<span>{{ data.end_at }}</span></p>
				</div>
			</el-col>
			<el-col :span="6" class="manage_first_right">
				<el-button type="primary" @click="downloadQrcode">下载签到二维码</el-button>
			</el-col>
		</el-row>
		<el-row class="manage_second margin-top-sm">
			<el-col :span="10">
				<div class="manage_first_title">
					<h3>会议信息管理</h3>
					<p>用来管理会议的基本信息</p>
				</div>
			</el-col>
			<el-col :span="6" :offset="8" class="manage_first_right">
				<el-button type="primary" plain @click="editSale">编辑</el-button>
			</el-col>
		</el-row>
		<el-row class="manage_second margin-top-sm">
			<el-col :span="10">
				<div class="manage_first_title">
					<h3>签到管理</h3>
					<p>管理活动签到的情况</p>
				</div>
			</el-col>
			<el-col :span="6" :offset="8" class="manage_first_right">
				<el-button type="primary" plain @click="signMent">管理</el-button>
			</el-col>
		</el-row>
	</div>

</template>

<script>
	import api from '@/utils/api'
	import download_url from '@/utils/downloadUrl'
	export default {
		components: {
			
		},
		data() {
			return {
				loading: false,
				data: []
			}
		},
		methods: {
			async downloadQrcode() {
				const weburl = download_url
				const id = this.$route.params.id
				const url = `${weburl}/train/${id}/download_qrcode`
				window.open(url)
			},
			editSale() {
				const id = this.$route.params.id
				this.$router.push({
					name: 'editSale',
					params: {
						id
					}
				})
			},
			signMent(row) {
				const id = this.$route.params.id
				this.$router.push({
					name: 'signMent',
					params: {
						id
					}
				})
			},
			async getData() {
				this.loading = true
				const data = await api.getTrainDetail(this.$route.params.id)
				this.data = data.train
				this.loading = false
			}
		},
		mounted() {
			this.getData()
		}
	}
</script>
<style scoped>
.manage_first{height:110px;padding:20px;border:1px solid #e3e3e3;border-radius:4px}
.manage_second{height:90px;padding:10px 0 0 5px;border-bottom:1px solid #e3e3e3}
.manage_first>.el-col>img{height:70px}
.manage_first_right{line-height:70px;text-align:right}
.manage_first_title{display:inline-block;vertical-align:top;margin-top:.5rem;margin-left:.5rem}
.manage_first_title>h1{font-size:18px;display:inline-block}
.manage_first_title>span{border-radius:2px;color:#fff;padding:5px;margin-left:.5rem;vertical-align:super}
.manage_first_title>p{color:#999;font-size:14px;margin-top:.5rem}
.manage_first_title>h3{font-size:17px;font-weight:initial}
</style>
<style>
.previewcourse>.el-dialog{width:300px}
.previewcourse>.el-dialog>.el-dialog__body{text-align:center}
.el-button--primary.is-plain{background:0 0}
</style>