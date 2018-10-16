<template>
	<div class="SignCode">
		<div class="SignCode-middle">
			<img :src="qr_code" class="SignCode-middle-img" />
			<p class="SignCode-middle-h1">签到二维码已生成，点击下方按钮下载签到二维码</p>
			<p class="SignCode-middle-p1">PS.微信签到的封面默认为活动封面</p>
			<el-button type="primary" @click="downloadQrcode">下载二维码</el-button>
		</div>
	</div>
</template>

<script>
	import download_url from '@/utils/downloadUrl'
	export default {
		data() {
			return {

			}
		},
		props: ['qr_code'],
		methods: {
			async downloadQrcode() {
				const weburl = download_url
				const id = this.$route.params.id
				const url = `${weburl}/train/${id}/download_qrcode`
				window.open(url)
			},
		},
		watch: {

		},
		mounted() {

		}
	}
</script>
<style lang="less" scoped>
	.SignCode {
		&-middle {
			text-align: center;
			padding-top: 5rem;
			&-h1 {
				font-size: 14px;
				margin-top: 1rem;
			}
			&-p1 {
				color: rgb(153, 153, 153);
				font-size: 14px;
				margin-top: 1rem;
				margin-bottom: 3rem;
			}
		}
	}
</style>