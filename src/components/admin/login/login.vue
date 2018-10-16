<template>
	<div class='loginBox el-col-24'>
		<div class="login_main">
			<div class="hr_logo">
				<div class="hr_img">
					<img src="../../../assets/logo.png" class="img-responsive">
				</div>
				<div class="hr_p">
					<p class="p1">东华商学管理系统</p>
					<p class="p2">DH BUSINESS SCHOOL</p>
				</div>
			</div>
			<div class='login el-col-4'>
				<h3>系统登录</h3>
				<div class="form">
					<el-row>
						<el-col :span="20" :offset="2" class="el-col-col">
							<el-input v-model="userName" placeholder="请输入用户名" @input="checkNo" prefix-icon="el-icon-erp-icon-account"></el-input>
						</el-col>
						<el-col :span="20" :offset="2" class="el-col-col">
							<el-input @keyup.enter.native="login()" v-model="userPsw" type="password" placeholder="请输入密码" prefix-icon="el-icon-erp-icon-lock"></el-input>
						</el-col>
						<el-col :span="12" :offset="6" class="el-col-col">
							<el-button type="primary" @click="login()" class="el-col-24 el-col-button" :loading="this.isLoading">登录</el-button>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import jwtToken from './../../helpers/jwt'
	export default {
		data() {
			return {
				userName: '',
				userPsw: '',
				isLoading: false,
			}
		},
		methods: {
			login() { //登陆
				this.isLoading = true;
				let formData = {
					name: this.userName,
					password: this.userPsw
				};

				this.$store.dispatch('loginRequest', formData).then(res => {
					window.localStorage.setItem('userName', this.userName)
					this.isLoading = false;
					axios.get('/admin/menu/lists').then(res => {

						this.$store.commit('UPDATE_MENUS', res.data.menus);
						let data = JSON.stringify(res.data.menus)
						window.localStorage.setItem('menus', data);
						this.$router.push({
							'name': 'home'
						})
					})
				})
			},
			getlogin() {
				this.userName = window.localStorage.getItem('userName')
			},
			checkNo(value) {
				if(value) {
					this.$nextTick(() => {
						this.userName = this.$valid.noCork(value)
					});
				}
			},
		},
		mounted: function() {
			this.getlogin();
		},
		watch: {
			userName: {
				handler(curVal, oldVal) {
					// console.log(curVal,oldVal)
					　　　　　　　　}
			}
		}
	}
</script>
<style scoped>
	.login_main {
		position: absolute;
		margin: auto;
		top: 0;
		bottom: 100px;
		left: 0;
		right: 0;
		width: 400px;
		height: 570px;
		border-radius: 10px
	}
	
	.hr_logo {
		display: inline-block;
		margin-bottom: 60px;
		width: 400px
	}
	
	.hr_logo .hr_img {
		position: relative;
		width: 174px;
		float: left
	}
	
	.hr_logo .hr_img:after {
		content: '';
		position: absolute;
		width: 1px;
		height: 100%;
		background-color: #f2f8ff;
		top: 0;
		right: -44px
	}
	
	.hr_p {
		float: right
	}
	
	.hr_p .p1 {
		font-size: 16px
	}
	
	.hr_p .p2 {
		font-size: 12px
	}
	
	.hr_p .p1,
	.hr_p .p2 {
		margin: 0 0 2px;
		color: #FFF
	}
	
	.img-responsive {
		display: block;
		max-width: 100%;
		height: auto
	}
	
	.login {
		min-width: 400px;
		overflow: hidden;
		height: 320px;
		background: #fff;
		border-radius: 4px;
		box-shadow: 0 0 3px #e0e0e0
	}
	
	.el-input {
		margin-left: 0
	}
	
	.login h3 {
		margin: 40px 0;
		font-size: 20px;
		color: #444;
		text-align: center;
		color: #459AFF
	}
	
	.el-col-col {
		margin-bottom: 15px
	}
	
	.el-col-button {
		margin-top: 15px
	}
	
	@keyframes animatedBackground {
		from {
			background-position: 0 0
		}
		to {
			background-position: 100% 0
		}
	}
	
	@-webkit-keyframes animatedBackground {
		from {
			background-position: 0 0
		}
		to {
			background-position: 100% 0
		}
	}
	
	.loginBox {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #fff;
		background-position: 0 0;
		background-repeat: repeat-x;
		background-image: url(../../../assets/login_bg.png);
		animation: animatedBackground 40s linear infinite;
		-ms-animation: animatedBackground 40s linear infinite;
		-moz-animation: animatedBackground 40s linear infinite;
		-webkit-animation: animatedBackground 40s linear infinite
	}
</style>