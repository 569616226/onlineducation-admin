import jwtToken from './../../components/helpers/jwt'
import { Message } from 'element-ui';

export default {

    actions : {
        loginRequest({dispatch},formData) {
          return axios.post('/login', formData,).then(response => {//获取access_token
                dispatch('loginSuccess',response.data);
           }).catch(error => {
                Message({
                  showClose: true,
                  message: error.message,
                  type: 'error'
               });
           })
        },
        loginSuccess({dispatch},tokenResponse) {
            jwtToken.setToken(tokenResponse.token);
            jwtToken.setAuthId(tokenResponse.auth_id);
            dispatch('setAuthUser');
            dispatch('getMenu')
        },
        logoutRequest({dispatch}) {
            return axios.get('/logout').then(res => {
                jwtToken.removeToken()
                dispatch('unsetAuthUser')
            })
        }
    }
}