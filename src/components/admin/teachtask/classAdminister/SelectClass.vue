<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" onclick="window.history.go(-1);"></i> {{$route.meta.title}}
		</div>
		<div class="margin-top-lg">
			<p class="title">选择课程的类型</p>
			<p class="titleSmall">选择类型后，发送消息会推送用户的微信公众号中</p>
			<div class="chooseBox">
				<div class="choose" @click="$router.push({name: 'addtask'})">
					<div class="choose_main">
						<i class="iconfont icon-clipboard-text"></i>
						<p class="tips">普通课程</p>
					</div>
					<div class="choose_footer">
						发布免费、VIP、付费课程，请选择此课程类型
					</div>
				</div>
				<div class="choose" @click="$router.push({name: 'AddInterview'})">
					<div class="choose_main">
						<i class="iconfont el-icon-erp-icon-chatbubble"></i>
						<p class="tips">访谈课程</p>
					</div>
					<div class="choose_footer">
						免费、无门槛观看的视频课程，主要用于推广企业家访谈课程
					</div>
				</div>
				<div class="choose">
					<div class="choose_main">
						<i class="iconfont icon-face"></i>
						<p class="tips">敬请期待</p>
					</div>
					<div class="choose_footer">
						后续版本会支持更多课程类型的选择，请敬请期待
					</div>
				</div>
			</div>
		</div>
	 	
	</div>
</template>

<script>
	export default {
		data() {
			return {
				 
			}
		},
		components: {
		},
		methods: {
			 
		},

		mounted: function() {
			 
		},
		watch: {
			 
		}
	}
</script>
<style scoped>
.title{color:#3595FF;font-size:24px;text-align:center;line-height:35px}
.titleSmall{margin-top:10px;font-size:14px;text-align:center;line-height:20px}
.chooseBox{text-align:center}
.choose{cursor:pointer;display:inline-block;padding:10px;color:#616166;background:#F4F6F8;margin-left:20px;margin-right:20px;margin-top:40px}
.choose i{font-size:100px;color:#8E8E94}
.tips{font-size:16px}
.choose_main{padding:40px 80px}
.choose_footer{border-top:1px solid #DFE0E1;padding:20px;font-size:13px;line-height:24px;max-width:260px}
.choose:hover{background:#3595FF;color:#FFF}
.choose:hover i{color:#FFF}
</style>