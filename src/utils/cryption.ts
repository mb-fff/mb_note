import crypto from 'crypto-js'
import { IEncrypt, IDecrypt } from '@/types/IUtils'

/**
 * @description 加密方法
 * @param key 秘钥
 * @param iv 偏移量
 * @param data 需要加密的数据
 * @returns 
 */
export const encrypt: IEncrypt = (key, iv, data): string => {

  if (typeof data === 'object') {
    try {
      data = JSON.stringify(data)
    } catch (error) {
      console.log(error)
    }
  }

  // 将统一传入的字符串转成UTF8编码
  const dataHex = crypto.enc.Utf8.parse(data)
  const keyHex = crypto.enc.Utf8.parse(key)
  const ivHex = crypto.enc.Utf8.parse(iv)
  const encrypted = crypto.AES.encrypt(dataHex, keyHex, {
    iv: ivHex,
    mode: crypto.mode.CBC, // 加密模式
    padding: crypto.pad.Pkcs7
  })

  return encrypted.ciphertext.toString()
}

/**
 * @description 解密方法
 * @param key 秘钥
 * @param iv 偏移量
 * @param encryptedVal 需要解密的数据
 * @returns 
 */
export const decrypt: IDecrypt = (key, iv, encryptedVal): any => {

  // 统一将传入的字符串转成UTF8编码
  const encryptedHexStr = crypto.enc.Hex.parse(encryptedVal)
  const srcs = crypto.enc.Base64.stringify(encryptedHexStr)
  const keyHex = crypto.enc.Utf8.parse(key)
  const ivHex = crypto.enc.Utf8.parse(iv)
  const decrypt = crypto.AES.decrypt(srcs, keyHex, {
    iv: ivHex,
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7
  })
  const decryptedStr = decrypt.toString(crypto.enc.Utf8)

  return JSON.parse(decryptedStr)
}

/**
 * @description 生成随机字符串
 * @returns 
 */
export const randomString = (): string => {
  return encrypt('mb_note', 'mb_note', 'hahaha')
}
