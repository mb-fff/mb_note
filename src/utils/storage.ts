/**
 * @description 封装具有时效性的localStorage
 */
export class LocalStorageOfTime {

  // localStorage
  storage = localStorage || window.localStorage

  // 状态
  status = {
    // 成功
    SUCCESS: 'SUCCESS',
    // 失败
    FAILURE: 'ERROR',
    // 数据溢出
    OVERFLOW: 'OVERFLOW',
    // 超时
    TIMEOUT: 'TIMEOUT'
  }

  // 是否删除过期数据(默认为true)
  isRemoveTimeoutData: boolean

  constructor(isRemoveTimeoutData: boolean = true) {
    this.isRemoveTimeoutData = isRemoveTimeoutData
  }

  /**
   * @description 存储数据
   * @param key
   * @param value 
   * @param timeout 超时时长 默认为1000*60*60*2
   * @param cb 回调(可选项)
   */
  set(key: string, value: any, timeout?: number, cb?: Function) {

    // 数据存储状态
    let status = this.status.SUCCESS

    // 获取过期时间
    timeout = LocalStorageOfTime.transferDate(timeout)

    // 数据存储格式
    const res = {
      value,
      timeout
    }

    try {
      this.storage.setItem(key, JSON.stringify(res))
    } catch (error) {
      // 数据溢出
      status = this.status.OVERFLOW
    }

    // 数据存储完成后的回调
    cb && cb(status, key, res)
  }

  /**
   * @description 获取数据
   * @param key 
   * @param cb 回调(可选项)
   */
  get(key: string, cb?: Function) {

    let value: any = null

    try {
      value = this.storage.getItem(key)
    } catch (error) {
      return LocalStorageOfTime.result(this.status.FAILURE, null, cb)
    }

    // 数据不存在
    if (!value) {
      return LocalStorageOfTime.result(this.status.FAILURE, null, cb)
    }

    value = JSON.parse(value)

    // 如果没有timeout字段则默认未超过时间
    const time = value?.timeout || 0

    // 判断是否过期
    if (time > new Date().getTime() || time === 0) {
      return LocalStorageOfTime.result(this.status.SUCCESS, value.value || '', cb)
    }

    // 过期则考虑是否删除数据
    this.isRemoveTimeoutData && this.remove(key)

    return LocalStorageOfTime.result(this.status.TIMEOUT, null, cb)
  }

  /**
   * 
   * @param key 
   * @param cb 
   */
  remove(key: string, cb?: Function) {

    let status = this.status.FAILURE
    let value: any

    try {
      value = this.storage.getItem(key)
    } catch (error) {
      cb && cb(status, null)
      return
    }

    if (!value) {
      cb && cb(status, null)
      return
    }

    try {
      this.storage.removeItem(key)
    } catch (error) {
      cb && cb(status, null)
      return
    }

    status = this.status.SUCCESS
    value = value?.value || value
    cb && cb(status, value)
  }

  /**
   * @description 将超时时长转换为时间戳
   * @param timeout 超时时长
   * @returns 
   */
  private static transferDate(timeout?: number): number {
    if (!timeout) {
      // 默认过期时间设置为两个小时
      return new Date().getTime() + 1000 * 60 * 60 * 2
    }
    return new Date().getTime() + timeout
  }

  /**
   * @description 返回结果
   * @param status 状态
   * @param value 值
   * @param cb 回调(可选)
   * @returns 
   */
  private static result(status: string, value: any, cb?: Function) {
    cb && cb(status, value)
    return {
      status,
      value
    }
  }
}

/**
 * @description 封装不具有时效性的Storage
 */
export class Storage {

  // storage类型
  storage: any
  constructor(storageType: string = 'local') {
    if (storageType === 'local') {
      this.storage = localStorage || window.localStorage
    } else if (storageType === 'session') {
      this.storage = sessionStorage || window.sessionStorage
    }
  }

  set(key: string, value: any) {
    if (!key) return
    value = JSON.stringify({ value })
    this.storage.setItem(key, value)
  }

  get(key: string) {
    let value = this.storage.getItem(key)
    value = value === null ? '' : JSON.parse(value)
    return value.value
  }

  remove(key: string) {
    if (!key) return
    this.storage.removeItem(key)
  }

}
