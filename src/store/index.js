import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const api = 'http://shop-api.newitd.com/v1'

const USER_NULL = {
  id: -9,
  username: null
}

export default new Vuex.Store({
  state: {
    realHeight: function (X,Y,nowX) {
      return nowX/X*Y
    },
    api: api,
    page: null,
    user: USER_NULL,
    types: []
  },
  mutations: {
    savePage (state, page) {
      state.page = page
    },
    updateUser(state) {
      const that = state.page
      that.$http.get(that.$store.state.api + '/session')
          .then(data => {
            const Data = data.data.data
            console.log(Data)
            state.user = Data
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    logoutUser(state) {
      const that = state.page
      that.$http.delete(that.$store.state.api + '/session')
          .then(data => {
            const Data = data.data
            console.log(Data)
            state.user = USER_NULL
            that.$router.push('/')
            that.$message.success('登出成功')
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    updateTypes(state) {
      const that = state.page
      that.$http.get(that.$store.state.api + '/category')
          .then(data => {
            const Data = data.data.data
            console.log(Data)
            state.types = Data
          })
          .catch(function (error) {
            console.log(error)
          })
    },
  },
  actions: {
  },
  modules: {
  }
})
