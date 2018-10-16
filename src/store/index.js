import Vue from 'vue'
import Vuex from 'vuex'
import AuthUser from './modules/auth-user'
import Login from './modules/login'
import Menu from './modules/menu'
import Admin from './modules/admin'

Vue.use(Vuex);

export default new Vuex.Store({

    modules:{
        AuthUser,
        Login,
        Menu,
        Admin
    }
})
