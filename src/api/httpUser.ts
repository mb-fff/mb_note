import instance from '@/utils/http'
import { IRegisterIn, IGetUserInfoIn } from '@/types/IApi'

class HttpUser {
  // 注册用户
  register(data: IRegisterIn) {
    return instance({ url: '/mb/user/register', data, method: 'POST', responseType: 'json' })
  }
  // 获取用户信息
  getUserInfo(data: IGetUserInfoIn) {
    return instance({ url: '/mb/user/getUserInfo', data, method: 'POST', responseType: 'json' })
  }
}

export default HttpUser