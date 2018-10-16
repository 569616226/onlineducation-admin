export default {
    state : {
        menus: null
    },
    mutations :{
        UPDATE_MENUS (state, menus) {
            state.menus = menus;
        },
    },
    actions : {
        getMenu({commit,dispatch},) {
            axios.get('/admin/menu/lists').then(res => {
                commit('UPDATE_MENUS',res.data.menus)
            })
        }
    }
}
