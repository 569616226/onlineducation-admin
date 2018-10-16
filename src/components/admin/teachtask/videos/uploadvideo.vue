<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="$router.push({name: 'videos'})"></i> {{$route.meta.title}}
		</div>
		<el-row class="margin-top-lg">
			<el-col :span="3">
				<div class="upload_title"><span class="red">*</span>选择文件</div>
			</el-col>
			<el-col :span="21">
				<div class="upload_content">
					<form id="form1">
						<input id="uploadVideoNow-file" type="file" style="display:none;" @change="ChangeFile" accept=".mp4" />
					</form>
					<el-button type="primary" @click="uploadVideoNow">选择文件</el-button>
				</div>
				<p class="upload_tips">支持mp4格式的文件上传，且文件大小不能超过2.0GB。视频上传成后将需要对其进行转码，请耐心等候！！！</p>
				<p class="upload_tips">视频的名称默认读取文件名，若需要修改视频名称请上传结束后，前往编辑里修改！</p>
				<div class="row" id="resultBox">
					<el-row class="Upload-row-head">
						<el-col :span="4">
							<span>文件名</span>
						</el-col>
						<el-col :span="4">
							<span>文件完整检查</span>
						</el-col>
						<el-col :span="10">
							<span>上传进度</span>
						</el-col>
						<el-col :span="3">
							<span>状态</span>
						</el-col>
						<el-col :span="3">
							<span>操作</span>
						</el-col>
					</el-row>
					<el-row class="Upload-row-head" v-for="item,index in data" :key="index" v-if="item.name">
						<el-col :span="4">
							<span class="blue">{{item.name}}</span>
						</el-col>
						<el-col :span="4">
							<span>{{item.sha}}</span>
						</el-col>
						<el-col :span="10">
							<el-progress :percentage="item.curr" status="exception" v-if="item.result == '上传失败'"></el-progress>
							<el-progress :percentage="item.curr" :status="item.curr == 100 ? 'success' : ''" v-else></el-progress>
						</el-col>
						<el-col :span="3">
							<span :class="item.result == '上传成功' ? 'green' : ''" v-if="item.result == '上传成功'">{{item.result}}</span>
							<span v-else class="red">{{item.result}}</span>
						</el-col>
						<el-col :span="3">
							<span class="cursor" @click="CancelUpload(item)" v-if="item.result == '上传中'">取消</span>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>

	</div>
</template>

<script>
	let index = 0
	let cosBox = []
	import api from '@/utils/api'
	export default {
		data() {
			return {
				data: []
			}
		},
		methods: {
			CancelUpload(item) {
				if(item.cos == null){
					return false
				}
				const cancelresult = qcVideo.ugcUploader.cancel({
					cos: item.cos,
					taskId: item.taskId
				})
				item.result = '已取消'
			},
			async getSignature(callback) {
				const data = await api.getVideoSignature()
				callback(data.signature)
			},
			uploadVideoNow() {
				document.querySelector("#uploadVideoNow-file").click()
			},
			async ChangeFile(e) {
				const getSignature = async(callback) => {
					const data = await api.getVideoSignature()
					callback(data.signature)
				}
				let num = this.addUploaderMsgBox('hasVideo')
				const videoFile = e.target.files[0]
				//$('#result').append(videoFile.name + 　'\n')
				const resultMsg = qcVideo.ugcUploader.start({
					videoFile: videoFile,
					getSignature: getSignature,
					allowAudio: 1,
					success: (result) => {
						if(result.type == 'video') {
							this.data[num].result = '上传成功'
							this.data[num].cos = null
						} else if(result.type == 'cover') {
							$('[name=coverresult' + num + ']').text('上传成功');
						}

					},
					error: (result) => {
						if(result.type == 'video') {
							this.data[num].result = '上传失败'
						} else if(result.type == 'cover') {
							$('[name=coverresult' + num + ']').text('上传失败>>' + result.msg);
						}

					},
					progress: (result) => {
						if(result.type == 'video') {
							this.data[num].name = result.name
							this.data[num].sha = Math.floor(result.shacurr * 100) + '%'
							this.data[num].curr = Math.floor(result.curr * 100)
							this.data[num].result = '上传中'
							this.data[num].taskId = result.taskId
							this.data[num].cos = result.cos
						} else if(result.type == 'cover') {
							$('[name=covername' + num + ']').text(result.name);
							$('[name=coversha' + num + ']').text(Math.floor(result.shacurr * 100) + '%');
							$('[name=covercurr' + num + ']').text(Math.floor(result.curr * 100) + '%');
						}

					},
					finish: async(result) => {
						const data = await api.postVideo(result)
					}
				})
				$('#form1')[0].reset()

			},
			addUploaderMsgBox(type) {
				if(!type || type == 'hasVideo') {
					this.data.push({
						id: index,
						name: '',
						sha: '',
						curr: '',
						result: '',
						taskId: '',
						cos: ''
					})
				}
				if(!type || type == 'hasCover') {
					html += '封面名称：<span name="covername' + index + '"></span>；' +
						'计算sha进度：<span name="coversha' + index + '">0%</span>；' +
						'上传进度：<span name="covercurr' + index + '">0%</span>；' +
						'上传结果：<span name="coverresult' + index + '">   </span>；<br>' +
						'地址：<span name="coverurl' + index + '">   </span>；<br>' +
						'</div>'
				}
				return index++;
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="less" scoped>
	.Upload {
		&-row {
			&-head {
				padding: 1.5rem;
				border-bottom: 1px solid rgb(227, 227, 227);
				color: rgb(102, 102, 102);
				font-size: 14px;
				font-weight: bold;
			}
		}
	}
	
	.upload_title {
		text-align: right;
		font-size: 16px;
		font-weight: 600;
		padding-top: 6px
	}
	
	.upload_content {
		padding-left: 30px
	}
	
	.upload_content .uploader-drop {
		padding: 0
	}
	
	.upload_content .uploader-drop {
		background: 0 0;
		border: none
	}
	
	.upload_content .uploader-btn {
		color: #fff;
		background-color: #409EFF;
		border-color: #409EFF;
		padding: 8px 15px;
		font-size: 14px;
		border-radius: 5px;
		margin-right: 10px
	}
	
	.upload_content .uploader-btn:hover {
		background: #66b1ff;
		border-color: #66b1ff
	}
	
	.upload_tips {
		margin-top: 20px;
		font-size: 16px;
		color: #888
	}
	
	.list_title {
		padding: 14px;
		width: 100%;
		border-bottom: 1px solid #CDCDCD
	}
	
	.list_title .title {
		display: block;
		float: left;
		color: #666;
		font-size: 16px
	}
	
	.title_name {
		width: 45%
	}
	
	.title_size {
		width: 13%
	}
	
	.title_meta {
		width: 8%
	}
	
	.title_status {
		width: 24%
	}
	
	.title_actions {
		width: 10%
	}
	
	.upload_content .uploader-file-size,
	.upload_content .uploader-file-status {
		text-indent: 0
	}
	
	#resultBox {
		width: 100%;
		min-height: 300px;
		padding: 5px;
		overflow: auto;
		margin-top: 20px;
		border-radius: 10px;
	}
	
	[act=cancel-upload] {
		text-decoration: none;
		cursor: pointer;
	}
</style>
<style>
	.uploaderMsgBox {
		width: 100%;
		border-bottom: 1px solid #888;
	}
</style>