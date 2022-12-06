import { INavState } from "@/types/IStore"

const state: INavState = {
  curNavItem: {
    navName: '首页',
    isActive: true,
    path: 'Homepage'
  }
}

const getters = {
  curNavItem: (state: INavState) => state.curNavItem
}

const mutations = {
  SET_CUR_NAV_ITEM(state: INavState, curNavItem: object) {
    state.curNavItem = curNavItem
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations
}