<template>
	<div>
	 <div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="$router.push({name: 'videos'})"></i> {{$route.meta.title}}
	 </div>
	 <el-row class="margin-top-lg">
	  <el-col :span="3"><div class="upload_title"><span class="red">*</span>选择文件</div></el-col>
	  <el-col :span="21">
	  	 <div class="upload_content">
		  	<uploader :options="options" ref="uploader" class="uploader-example" fliename="video" @file-success="fileSuccess" @upload-start="upstart" @file-complete="fileComplete" @complete="complete">
		    <uploader-unsupport>当前浏览器不支持上传，请更换浏览器</uploader-unsupport>
		    <uploader-drop>
	    	   <uploader-btn :attrs="attrs">选择文件</uploader-btn>
	    	     <!-- <el-button size="medium" type="success">上传到服务器</el-button> -->
	    	  <p class="upload_tips">支持mp4格式的文件上传，且文件大小不能超过2.0GB。视频上传成后将需要对其进行转码，请耐心等候！！！</p>
	    	  <p class="upload_tips">视频的名称默认读取文件名，若需要修改视频名称请上传结束后，前往编辑里修改！</p>
		    </uploader-drop>
		    <div class="list_title">
		    	<span class="title title_name">文件名</span>
		    	<span class="title title_size">大小</span>
		    	<span class="title title_meta">&nbsp;</span>
		    	<span class="title title_status">状态</span>
		    	<span class="title title_actions">操作</span>
		    	<div style="clear:both;"></div>
		    </div>
		    <uploader-list></uploader-list>
		  </uploader>
	  </div>
	  </el-col>
	</el-row>
 
	  
	  
  </div>
</template>

<script>
  export default {
    data () {
      return {
        options: {
          // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
          target:this.$weburl + '/api/admin/video',
          testChunks: false,
          method : 'POST',
           chunkSize : 10*1024*1024,
           simultaneousUploads:1,
          fileParameterName: 'video',   //上传文件时的参数名，不填写默认为file
          headers: {
            Accept:'application/json',
            Authorization:'Bearer ' + window.localStorage.getItem('jwt_token')
          }
           
        },
        attrs: {
          accept:".mp4"
        }
        
      }
    },
    methods: {
			  complete () {
        // console.log('complete', arguments)
      },
      fileComplete (rootFile) {
        // console.log('file complete', arguments)
        // console.log('rootFile', rootFile)
      },
      upstart (value) {
        console.log(this.$refs.uploader.uploader);
        // alert('开始上传了')
      },
      fileSuccess(rootFile, file, message, chunk){
        if(JSON.parse(message).status){
          // console.log(JSON.parse(message).message);
        }else {
          this.$message.error(JSON.parse(message).message);
        }
      }
	},
	mounted: function() {
    // console.log(this.$refs.uploader.uploader)
	}
  }
</script>

<style scoped>
.upload_title{text-align:right;font-size:16px;font-weight:600;padding-top:6px}
.upload_content{padding-left:30px}
.upload_content .uploader-drop{padding:0}
.upload_content .uploader-drop{background:0 0;border:none}
.upload_content .uploader-btn{color:#fff;background-color:#409EFF;border-color:#409EFF;padding:8px 15px;font-size:14px;border-radius:5px;margin-right:10px}
.upload_content .uploader-btn:hover{background:#66b1ff;border-color:#66b1ff}
.upload_tips{margin-top:20px;font-size:16px;color:#888}
.list_title{padding:14px;width:100%;border-bottom:1px solid #CDCDCD}
.list_title .title{display:block;float:left;color:#666;font-size:16px}
.title_name{width:45%}
.title_size{width:13%}
.title_meta{width:8%}
.title_status{width:24%}
.title_actions{width:10%}
.upload_content .uploader-file-size,.upload_content .uploader-file-status{text-indent:0}
</style>
 
 