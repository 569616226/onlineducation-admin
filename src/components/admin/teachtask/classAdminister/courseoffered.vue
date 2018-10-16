<template>
	<div>
		<div class="admin_title">
			<i class="el-icon-erp-icon-keyboard-backspace el-icon--left veal_middle cursor" onclick="window.history.go(-1)"></i> {{$route.meta.title}}
		</div>
		<div class="course_first margin-top-sm margin-left-sm">
			<p>营销设置</p>
		</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm margin-top-lg margin-left-lg">
			<el-form-item label="收费模式" prop="charmode">
				<el-radio-group v-model="ruleForm.charmode" @change="charamount_sss">
					<el-radio label="1">免费课程</el-radio>
					<el-radio label="2">VIP课程</el-radio>
					<el-radio label="3">付费课程（精品课程）</el-radio>
				</el-radio-group>
				<el-form-item prop="charamount" v-if="charaxiy">
					<el-input v-model="ruleForm.charamount" onKeypress="return (/[\d.]/.test(String.fromCharCode(event.keyCode)))" class="form_input_inner" placeholder="0.00"></el-input>
					<span>元</span>
					<p class="form_p_g">只有付费课程才可以设置课程金额，其余两种课程暂不需要金额</p>
				</el-form-item>
			</el-form-item>
			<el-form-item label="购买须知" prop="notebuy" v-if="charaxiy">
				<el-select v-model="ruleForm.notebuy" placeholder="请选择" @change="notebuygo">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<span class="margin-left-sm form_p_g">*选择购买须知模版后，会自动读取模版数据到输入框里</span>
				<vue-editor v-model="ruleForm.noteeditor" class="margin-top-sm"></vue-editor>
				<p class="form_p_g">只有付费课程才可以设置课程售价和填写购买须知，免费课程和VIP课程无需填写</p>
			</el-form-item>
			<el-form-item label="免费试看" prop="freelook" v-if="charaxiy || charvip">
				<el-checkbox-group v-model="ruleForm.freelook" class="freelook">
					<el-checkbox v-for="(item,index) in festivals" :key="item.videoid" :label="item.videoid" @change="free_video(index)">{{item.festivalname}}<span class="freelook_span" v-if="item.free_ko">免费</span></el-checkbox>
				</el-checkbox-group>
				<p class="form_p_g">为了更好的让用户尝新，可以设置指定的节进行免费试看</p>
			</el-form-item>
			<el-form-item class="text-center margin-top-lg">
				<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				<el-button @click="resetForm('ruleForm')">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				charaxiy: false,
				charvip: false,
				ruleForm: {
					charmode: '',
					charamount: '',
					notebuy: '',
					noteeditor: '',
					freelook: []
				},
				rules: {
					charmode: [{
						required: true,
						message: '请选择收费模式',
						trigger: 'change'
					}],
					charamount: [{
						required: true,
						message: '请输入金额',
						trigger: 'change'
					}],
					notebuy: [{
						required: true,
						message: '请选择模板',
						trigger: 'change'
					}],
					freelook: [{
						type: 'array',
						required: true,
						message: '请选择免费试看',
						trigger: 'change'
					}]
				},
				options: [{
					value: '<h1>选项1</h1>',
					label: '付费模板1'
				}, {
					value: '选项2',
					label: '付费模板2'
				}, {
					value: '选项3',
					label: '付费模板3'
				}, {
					value: '选项4',
					label: '付费模板4'
				}, {
					value: '选项5',
					label: '付费模板5'
				}],
				festivals: [{
					'festivalname': '第一节 了解QP系统',
					'videoid': '1',
					'videoname': '机电商品归类-自动调节装置-1',
					'videodur': '00:05:30',
					'video': 'http://127.0.0.1:8080/static/media/1.f5f63de.mp4',
					'free_ko': false
				}, {
					'festivalname': '第二节 了解QP系统',
					'videoid': '2',
					'videoname': '机电商品归类-自动调节装置-2',
					'videodur': '00:05:30',
					'video': 'http://127.0.0.1:8080/static/media/1.f5f63de.mp4',
					'free_ko': false
				}, {
					'festivalname': '第三节 了解QP系统',
					'videoid': '3',
					'videoname': '机电商品归类-自动调节装置-3',
					'videodur': '00:05:30',
					'video': 'http://127.0.0.1:8080/static/media/1.f5f63de.mp4',
					'free_ko': false
				}, {
					'festivalname': '第四节 了解QP系统',
					'videoid': '4',
					'videoname': '机电商品归类-自动调节装置-4',
					'videodur': '00:05:30',
					'video': 'http://127.0.0.1:8080/static/media/1.f5f63de.mp4',
					'free_ko': false
				}, {
					'festivalname': '第五节 了解QP系统',
					'videoid': '5',
					'videoname': '机电商品归类-自动调节装置-5',
					'videodur': '00:05:30',
					'video': 'http://127.0.0.1:8080/static/media/1.f5f63de.mp4',
					'free_ko': false
				}]
			};
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				//this.$refs[formName].resetFields();
				window.history.go(-1)
			},
			charamount_sss() {
				if(this.ruleForm.charmode == "3") {
					this.charaxiy = true
				} else {
					this.charaxiy = false
				}
				if(this.ruleForm.charmode == "2") {
					this.charvip = true
				} else {
					this.charvip = false
				}
			},
			notebuygo() {
				this.ruleForm.noteeditor = this.ruleForm.notebuy
			},
			free_video(index){
				if(this.festivals[index].free_ko){
					this.festivals[index].free_ko = false
				}else{
					this.festivals[index].free_ko = true
				}
			}
		}
	}
</script>
<style scoped>
.course_first{height:46px;line-height:46px;border:1px solid #e3e3e3;border-radius:2px;padding:0 20px;font-size:16px;background:#F5F5F5}
.form_p_g{color:#888}
.form_input_g{width:430px}
.form_input_inner{width:214px}
.el-form-item__error{position:relative}
.freelook{width:450px;height:250px;overflow-x:hidden;border:1px solid #e3e3e3}
.el-checkbox{display:block;padding:5px 10px;border-bottom:1px solid #e3e3e3}
.el-checkbox+.el-checkbox{margin-left:0}
.freelook_span{font-size:12px;color:#fff;margin-left:4rem;padding:5px;border-radius:4px;background-color:#ffac30}
</style>