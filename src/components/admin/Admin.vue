<template>
	<div class="home">
		<div class="menuBox">
			<div class="logoTitle">
				<div class="logo_top">
					<img src="../../assets/home_logo.png" />
					<span>东华商学管理系统</span>
				</div>
				<el-menu ref="active" :default-active="active_index" class="el-menu-vertical-demo" background-color="#404F61" text-color="#ACBAC9" router>
					<div v-if="menus">
						<div v-for="chlidmenu in menus[activemenu].child">
							<el-menu-item :index="chlidmenu.id.toString()" :route="{name: chlidmenu.url}"> <i :class="chlidmenu.icon"></i> <span slot="title">{{chlidmenu.name}}</span> </el-menu-item>
						</div>
					</div>
				</el-menu>
			</div>
			<div class="clear_logo"></div>
		</div>
		<el-row class="topfixed">
			<el-col :span="21">
				<div class="item">
					<el-menu :default-active="activeindex" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
						<div v-for="menu in menus">
							<el-menu-item :index="menu.id.toString()" :route="{name: menu.child[0].url}">{{menu.name}}</el-menu-item>
						</div>
					</el-menu>
				</div>
			</el-col>
			<el-col :span="3" class="user_d">
				<el-dropdown class="user_dro">
					<span class="el-dropdown-link username_box">
					<i class="el-icon-erp-icon-yonghu el-icon--left veal_middle"></i>
			 			<span v-if="me">
		 					<span>{{ me.name }}</span>
			 			</span>
					<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<a href="#" @click.prevent="logout()">
							<el-dropdown-item>
								退出登陆
							</el-dropdown-item>
						</a>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-row>
		<div class="content">

			<div class="info_box">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script>
	import jwtToken from './../helpers/jwt'
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
				active_index: ''
			}
		},
		components: {
				
		},
		methods: {
			handleSelect(key, keyPath) {
				
			},
			//打印测试数据，调试使用
			consoletest() {
				//console.log('用户信息')
				//console.log(this.me)
				console.log('菜单数据')
				console.log(this.menus)
				console.log('当前路由信息')
				console.log(this.$route)
			},
			logout() {
				this.$store.dispatch('logoutRequest').then(res => {
					this.$router.push({
						'name': 'login'
					})
				});
			},
		},
		computed: {
			me() {
				return this.$store.state.AuthUser;
				// return JSON.parse(window.localStorage.getItem('me'));
			},
			menus() {
				return this.$store.state.Menu.menus;
				// return JSON.parse(window.localStorage.getItem('menus'));
			},
			activeindex() {
				return this.$route.meta.pindex ? this.$route.meta.pindex : '';
			},
			activemenu() {
				if(this.$route.meta.pindex == 1) {
					return 0
				}
				if(this.$route.meta.pindex == 2) {
					return 1
				}
				if(this.$route.meta.pindex == 3) {
					return 2
				}
				if(this.$route.meta.pindex == 4) {
					return 3
				}
				if(this.$route.meta.pindex == 5) {
					return 4
				}
				if(this.$route.meta.pindex == 6) {
					return 5
				}
			},
		},
		created() {
			this.$store.dispatch('getMenu')
			if(jwtToken.getToken()) {
				this.$store.dispatch('setAuthUser')
			} else if(Cookie.get('auth_id')) {
				this.$store.dispatch('refreshToken')
			}
			this.active_index = this.$route.meta.index;
		},
		mounted() {
		
		},
		watch: {
			$route() {
				this.$refs.active.activeIndex = this.$route.meta.index;
			},
		}
	}
</script>
<style scoped>
.home>.content{padding-left:219px;padding-top:60px}
.info_box{padding:20px;overflow:hidden}
[v-cloak]{display:none}
.topfixed{position:fixed;z-index:100;left:219px;width:89%;width:-moz-calc(100% - 219px);width:-webkit-calc(100% - 219px);width:calc(100% - 219px)}
.topfixed .item .el-menu-demo{min-height:60px}
.el-menu{background-color:#3C98FF}
.el-menu-item{color:#C1DFFF}
.el-menu-item.is-active{color:#FFF;background-color:#4FA2FF;font-weight:600}
.el-menu--horizontal{border-bottom:none!important}
.el-menu--horizontal>.el-menu-item{border-bottom:none!important}
.el-menu--horizontal .el-menu-item:hover{color:#fff;background:#4FA2FF}
.user_d{height:60px;background:#3c98ff;line-height:60px;text-align:center}
.user_dro{color:#fff}
.veal_middle{vertical-align:middle}
.logoTitle{line-height:60px;height:60px;width:219px;float:left;background-color:#2D8CE3;color:#FFF;position:fixed}
.logo_top{height:60px}
.logo_top>img{width:30px;vertical-align:middle;margin-right:5px;margin-left:15px}
.logo_top>span{font-size:14px;vertical-align:middle}
.menuBox .el-menu{border-radius:0;transition:transform .3s;position:fixed;top:60px;left:0;bottom:0;width:219px;border-right:none}
.menuBox .el-menu-vertical-demo{background-color:#404F61}
.menuBox .el-menu-item{color:#BECBD9;text-align:left;border-bottom:1px solid #58595c}
.menuBox .el-menu-item:hover,.menuBox .is-active{color:#FFF!important;background-color:#404F61!important}
.menuBox .el-menu-item:hover i{color:#FFF!important}
.menuBox .menu{font-size:30px;line-height:80px;margin-left:20px;cursor:pointer}
</style>