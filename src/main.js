/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
//
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import App from './App'
import './css/admin.css'
import './css/font.css'
import VueEditor from 'vue2-editor' //富文本编辑器
import VueHtml5Editor from 'vue-html5-editor' //富文本编辑器
import DataTables from 'vue-data-tables' //数据表格
import uploader from 'vue-simple-uploader'
import YDUI from 'vue-ydui';
import Scrollactive from 'vue-scrollactive';
import jwtToken from './components/helpers/jwt';
import Cookie from 'js-cookie'
import valid from './components/helpers/valid';
import apiUrl from './utils/apiUrl'

Vue.config.productionTip = false;
// 添加全局正则
Vue.prototype.$valid = valid;
// 设置全局的上传图片路径
Vue.prototype.$uploadimgurl = `${apiUrl}/admin/image/upload`;

// Vue.use(VueRouter);
// Install the Plugin and set the locale.
Vue.use(ElementUI);
Vue.use(VueEditor);
Vue.use(DataTables);
Vue.use(uploader);
Vue.use(YDUI);
Vue.use(Scrollactive);


axios.interceptors.request.use(
	config => {
		if(jwtToken.getToken) { // 判断是否存在token，如果存在的话，则每个http header都加上token
			config.headers.Accept = 'application/json';
			config.headers.Authorization = 'Bearer ' + jwtToken.getToken();
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	});

axios.interceptors.response.use(

	response => {
		if(response.status == 204) {
			// 返回 204 退出登陆成功返回登陆页面
			window.location.reload();
		}
		return response;
	},
	error => {
		if(error.response) {
			switch(error.response.status) {
				case 403:
					Vue.prototype.$message({
			            showClose: true,
			            message: '你没有操作权限',
			            type: 'warning'
			        })
			}
		}
		return Promise.reject(error.response.data) // 返回接口返回的错误信息
	});




const options = {
	// 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
	showModuleName: true,
	 visibleModules: [
        "text",
        "color",
        "font",
        "align",
        // "list",
        "link",
        "unlink",
        // "tabulation",
        "image",
        "hr",
        "eraser",
        "undo",
        // "full-screen",
        // "info",
    ],
    language: "zh-cn",
     image: {
        server: null,
        //the name for file field in multipart request
        fieldName: "image",
        //max file size
        sizeLimit: 512 * 1024,
        // default true,if set to true,the image will resize by localResizeIMG (https://github.com/think2011/localResizeIMG)
        compress: true,
        //follows are options of localResizeIMG
        width: 680,
        // height: 300,
        quality: 80,
        //handle response data，return image url
        uploadHandler(responseText){
            //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
            var json = JSON.parse(responseText)
            if (!json.ok) {
                alert(json.msg)
            } else {
                return json.data
            }
        }
    },

}
Vue.use(VueHtml5Editor,options);
router.beforeEach((to, from, next) => {
	

	
	if(jwtToken.getToken()) {
		store.dispatch('setAuthUser')
	}
	
	if(to.meta.requireAuth) { // 判断该路由是否需要登录权限
		if(store.state.AuthUser.authenticated || jwtToken.getToken()) { // 通过vuex state获取当前的token是否存在
			store.dispatch('getMenu');

			if(to.path == '/login'){
				next({
					path: '/home',
					query: {
						redirect: to.fullPath
					} // 将跳转的路由path作为参数，登录成功后跳转到该路由
				})
			}

		}else if(Cookie.get('auth_id')){
			store.dispatch('refreshToken',{
				refreshToken : Cookie.get('auth_id')
			})
		}else{
			next({
				path: '/login',
				query: {
					redirect: to.fullPath
				} // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	}

	next();

});

new Vue({
	el: '#app',
	store,
	router,
	template: '<App/>',
	components: {
		App
	}
})