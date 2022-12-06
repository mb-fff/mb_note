import { IUserState } from '@/types/IStore'
import HttpUser from '@/api/httpUser'

const httpUser = new HttpUser()

const state: IUserState = {
  // 登陆状态
  loginStatus: false,
  // 登陆人信息
  userInfo: {}
}

const getters = {
  loginStatus: (state: IUserState) => state.loginStatus,
  userInfo: (state: IUserState) => state.userInfo
}

const mutations = {
  // 改变登陆状态
  SET_LOGIN_STATUS(state: IUserState, status: boolean) {
    state.loginStatus = status
  },
  // 设置登陆人信息
  SET_USER_INFO(satte: IUserState, userInfo: object) {
    satte.userInfo = userInfo
  }
}

const actions = {
  // 获取登录人信息
  async getUserInfo({ commit }: any) {
    const param = {}
    const res = await httpUser.getUserInfo(param)
    const { data } = res.data
    commit('SET_USER_INFO', data)
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
}