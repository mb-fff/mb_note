import axios from 'axios'
import { ElMessage } from 'element-plus'
import { LocalStorageOfTime } from '@/utils/storage'
import { IHttp } from '@/types/IUtils'
const storage = new LocalStorageOfTime()

const instance = axios.create({
  // 携带cookies
  withCredentials: true,
  // 超时
  timeout: 10000
})

// 错误处理
const errorHandle: IHttp = (status, other): void => {
  switch (status) {
    case 400:
      ElMessage.error('信息校验失败')
      break;
    case 401:
      ElMessage.error('认证失败')
      break;
    case 403:
      ElMessage.error('token校验失败')
      break;
    case 404:
      ElMessage.error('请求的资源不存在')
      break;
    default:
      ElMessage.error(other)
      break;
  }
}

// 请求拦截器(post只能接受字符串类型数据)
instance.interceptors.request.use(
  config => {
    const token = 'bearer ' + storage.get('mb_note_token').value
    if (config.headers) {
      config.headers.Authorization = token
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
instance.interceptors.response.use(
  response => Promise.resolve(response),
  error => {
    if (error.response) {
      return Promise.reject(error.response)
    } else {
      ElMessage.error('请求失败')
      return Promise.reject(error)
    }
  }
)

export default instance