import api from '@/utils/api'
export default {
    state : {
        GenreListsData: [],
        TrainListsData: [],
        NavListsData: [],
        TeacherListsData: [],
        RoleListsData: []
    },
    mutations :{
        GenreListsData (state, data) {
            state.GenreListsData = data
        },
        TrainListsData (state, data) {
            state.TrainListsData = data
        },
        NavListsData (state, data) {
            state.NavListsData = data
        },
        TeacherListsData (state, data) {
            state.TeacherListsData = data
        },
        RoleListsData (state, data) {
            state.RoleListsData = data
        },
    },
    actions : {
        async getGenreLists({state, commit}) {
            const data = await api.getGenreLists()
            commit('GenreListsData', data)
        },
        async getTrainLists({state, commit}) {
            const data = await api.getTrainLists()
            commit('TrainListsData', data)
        },
        async getNavLists({state, commit}) {
            const data = await api.getNavLists()
            commit('NavListsData', data)
        },
        async getTeacherLists({state, commit}) {
            const data = await api.getTeacherLists()
            commit('TeacherListsData', data)
        },
        async getRoleLists({state, commit}) {
            const data = await api.getRoleLists()
            commit('RoleListsData', data)
        }
    }
}
