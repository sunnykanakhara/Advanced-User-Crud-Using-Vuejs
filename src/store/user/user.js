export const user = {
    namespaced: true,
    state: { users: [], loggedIn: null },
    mutations: {
        setUsers(state, payload) {
            state.users.push(payload)
        },

        setLoggedIn(state, payload) {
            state.loggedIn = payload
        },

        setNewUserArray(state, payload) {
            state.users = payload
        }
    },
    actions: {
        addUser({commit}, userData) {
            commit('setUsers', userData);
        },

        loggedIn({commit}, loginData) {
            commit('setLoggedIn', loginData)
        },

        DeleteAccount({commit}, newUserData) {
            commit('setNewUserArray', newUserData)
        },

        UpdateAccount({commit}, updatedUserData) {
            commit('setNewUserArray', updatedUserData)
        }
    },
    getters: {
        users: state => state.users,
        loggedIn: state => state.loggedIn
    }

}