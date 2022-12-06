import instance from '@/utils/http'
import { ILoginIn } from '@/types/IApi'

class HttpAuth {
  // 用户名登陆
  login(data: ILoginIn) {
    return instance({ url: '/mb/auth/login', data, method: 'POST', responseType: 'json' })
  }
}

export default HttpAuth