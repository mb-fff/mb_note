import instance from '@/utils/http'

class HttpFile {
  // 上传文件
  upload(data: FormData) {
    return instance({ url: '/mb/file/upload', data, method: 'POST', responseType: 'json', headers: { 'content-type': 'multipart/form-data' } })
  }
}

export default HttpFile