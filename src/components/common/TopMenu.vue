<template>
	<el-row class="topfixed">
		<el-col :span="21">
			<div class="item">
				<el-menu :default-active="activeindex" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
					<div v-for="menu in menus">
						<el-menu-item :index="menu.id.toString()" :route="{name: menu.url}">{{menu.name}}</el-menu-item>
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
					<el-dropdown-item>
						<a href="#" @click.prevent="logout()">退出登陆</a>

					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</el-col>
	</el-row>

</template>
<script>
	import jwtToken from './../helpers/jwt'
	import Cookie from 'js-cookie'
	export default {
		/*保持用户登陆*/
		created() {
			// this.$store.dispatch('getMenu')
			// if(jwtToken.getToken()) {
			// 	this.$store.dispatch('setAuthUser')
			// }else if(Cookie.get('auth_id')){
			// 	this.$store.dispatch('refreshToken',{
			// 		refreshToken : Cookie.get('auth_id')
			// 	})
			// }
		},
		data() {
			return {}
				
		},
		methods: {
			handleSelect(key, keyPath) {
				//console.log(key, keyPath);
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
			}
		},
		mounted() {
			// this.consoletest()
		},
		watch: {
			
		}
	}
</script>
<style scoped>
	/* 	.username_box {
 		display: none;
 	}*/
	[v-cloak] {
	  display: none;
	}
	.topfixed {
		position: fixed;
		z-index: 100;
		left: 219px;
		width: 89%;
		width: -moz-calc(100% - 219px);
		width: -webkit-calc(100% - 219px);
		width: calc(100% - 219px);
	}
	.topfixed .item .el-menu-demo {
		min-height: 60px;
	}
	.el-menu {
		background-color: #3C98FF;
	}
	
	.el-menu-item {
		color: #C1DFFF;
	}
	
	.el-menu-item.is-active {
		color: #F2F8FF;
		background-color: #4FA2FF;
		font-weight: 600;
	}
	
	.el-menu--horizontal {
		border-bottom: none !important;
	}
	
	.el-menu--horizontal>.el-menu-item {
		border-bottom: none !important;
	}
	
	.el-menu--horizontal .el-menu-item:hover {
		color: #fff;
		background: #4FA2FF;
	}
	
	.user_d {
		height: 60px;
		background: #3c98ff;
		line-height: 60px;
	}
	
	.user_dro {
		color: #fff;
	}
	
	.veal_middle {
		vertical-align: middle;
	}
</style>