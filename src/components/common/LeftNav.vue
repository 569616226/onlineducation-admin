<template>
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
</template>
<script>
	export default {
		data() {
			return {
				active_index: '',
			}
		},
		methods: {
		 
		},
		computed: {
			menus() {
				// return JSON.parse(window.localStorage.getItem('menus'));
				//console.log(this.$store.state.Menu.menus)
				return this.$store.state.Menu.menus;
			},
			//            匹配点亮导航（子菜单）[待完善，如果有其他好的方法和思路，直接替换掉]
			//            activeinde () {
			//                return this.$route.meta.index ? this.$route.meta.index: '';
			//            },
			//           匹配对应显示那些子菜单
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
			activeindex() {
				return this.$route.meta.index ? this.$route.meta.index : '';
			}
		},
		created() {
			this.active_index = this.$route.meta.index
		},
		watch: {
			activeindex(val){
				if(val == '4'){
					//this.$refs.teachtask[0].$el.click()
					console.log(this.$refs.active)
				}
				if(val == '9'){
					console.log(this.$refs.active)
				}
			}
		}
	}
</script>
<style scoped>
	.logoTitle {
		line-height: 60px;
		height: 60px;
		width: 219px;
		float: left;
		background-color: #2D8CE3;
		color: #FFFFFF;
		position: fixed;
	}
	
	.logo_top {
		height: 60px;
	}
	
	.logo_top>img {
		width: 30px;
		vertical-align: middle;
		margin-right: 10px;
		margin-left: 15px;
	}
	
	.logo_top>span {
		font-size: 14px;
		vertical-align: middle;
	}
	
	.el-menu {
		border-radius: 0;
		transition: transform .3s;
		position: fixed;
		top: 60px;
		left: 0;
		bottom: 0;
		width: 219px;
		border-right: none;
	}
	.menuBox .el-menu-vertical-demo {
		background-color: #404F61;
	}
	
	.menuBox .el-menu-item {
		color: #BECBD9;
		text-align: left;
		border-bottom: 1px solid #58595c;
	}
	
	.menuBox .el-menu-item:hover,
	.menuBox .is-active {
		color: #FFFFFF !important;
		background-color: #404F61 !important;
	}
	
	.menuBox .el-menu-item:hover i {
		color: #FFFFFF !important;
	}
	
	.menu {
		font-size: 30px;
		line-height: 80px;
		margin-left: 20px;
		cursor: pointer;
	}
</style>