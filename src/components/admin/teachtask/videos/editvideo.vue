<template>
	<div v-loading="loading">
	 	<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" @click="$router.push({name: 'videos'})"></i> {{$route.meta.title}}
	 </div>
		 <el-form class="margin-top-lg" :label-position="labelPosition" label-width="100px" :model="ruleForm" ref="ruleForm" :rules="rules">
		  <el-form-item prop="name" class="margin-left-lg must" label="视频标题">
		    <el-input class="form-input-h" v-model="ruleForm.name" placeholder="请输入视频标题" ></el-input>
		  </el-form-item>
		  <p class="form-tips">视频的名称默认读取视频的文件名</p>
		  <el-form-item class="text-center margin-top-lg">
		    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
		    <el-button  @click="$router.push({name: 'videos'})">返回</el-button>
		  </el-form-item>
		</el-form>
	 </div>
</template>

<script>
	export default {
		 data() {
      return {
        labelPosition: 'right',
        video_names :[],
        loading : false,
        ruleForm: {
          name: ''
        },
        rules: {
			name: (rule, value, callback) => {
              if(!value){
                return callback(new Error('视频标题不能为空'));
              }
              // setTimeout(() => {
               if(this.video_names.indexOf(value) != -1){
                  callback(new Error('视频标题已存在'))
                } else {
                  callback();
                }
              // }, 1000);
            }
		},
      };
    },
		methods: {
		  submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						axios.post('/admin/video/' + this.$route.params.id + '/update', {name:this.ruleForm.name})
						.then((res) => {
							if(res.data.status){
								this.$message.success(res.data.message);
								this.loading = false;
								this.$router.push({name:'videos'});
							}else {
								this.$message.warning(res.data.message);
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			getdata() {
				this.loading = true;
				axios.get('/admin/video/' + this.$route.params.id)
				.then((res) => {
					this.ruleForm = res.data.video;
					this.video_names = res.data.video_names;
					this.loading = false;
				})
			},
		},
		mounted: function() {
			this.getdata()
		}
	}
</script>
<style scoped>
.form-input-h{width:400px}
.form-tips{margin-left:140px;font-size:14px;color:#888}
</style>