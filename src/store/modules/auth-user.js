/**
 * Created by Administrator on 2017/10/30.
 */
import * as types from './../mutaiton-type'
import Cookie from 'js-cookie'
export default {
	state: {
		authenticated: false,
		name: null,
	},
	mutations: {
		[types.SET_AUTH_USER](state, payload) {
			state.authenticated = true
			state.name = payload.user.nickname
		},
		[types.UNSET_AUTH_USER](state, payload) {
			state.authenticated = false
			state.name = null
		}
	},
	actions: {
		setAuthUser({commit, dispatch}) {
			axios.get('/admin/user/me').then(res => {
				commit({
					type: types.SET_AUTH_USER,
					user: res.data
				})
			}).catch(error => {
				dispatch('refreshToken');
			})
		},
		unsetAuthUser({commit}) {
			commit({
				type: types.UNSET_AUTH_USER
			})
		},
		refreshToken({commit, dispatch}) {
			axios.post('/token/refresh',{
				refreshToken : Cookie.get('auth_id')
		}).then(res => {
				dispatch('loginSuccess',res.data);
			}).catch(error=>{
				dispatch('logoutRequest');
			})
		}
	}
}