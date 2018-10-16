import Cookie from 'js-cookie'
/*保存token*/
export default{
    setToken(token){
        window.localStorage.setItem('jwt_token',token);
    },
    getToken(){
        return window.localStorage.getItem('jwt_token');
    },
    removeToken(){
        window.localStorage.removeItem('jwt_token');
        // window.localStorage.removeItem('menus');
        // window.localStorage.removeItem('userName');
        Cookie.remove('auth_id');
    },
    setAuthId(authId){
        Cookie.set('auth_id',authId);
    }


}
