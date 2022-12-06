import { createStore } from 'vuex'
import user from './modules/user'
import nav from './modules/nav'

export default createStore({
  modules: {
    user,
    nav
  }
})
