/**
 * nav.ts
 */

export interface INavState {
  curNavItem: object
}

/**
 * user.ts
 */

export interface IUserState {
  // 登陆状态
  loginStatus: boolean
  // 登陆人信息
  userInfo: object
}
