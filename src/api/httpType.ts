import instance from '@/utils/http'
import { IGetAllTypeIn } from '@/types/IApi'

class HttpType {
  // 获取笔记类型
  getAllType(data: IGetAllTypeIn) {
    return instance({ url: '/mb/type/getAllType', data, method: 'POST', responseType: 'json' })
  }
}

export default HttpType