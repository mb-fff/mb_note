/**
 *统一出参格式 
 */

export interface IRes<T> {
  code: number,
  msg: string,
  data: T
}

/**
 * httpAuth.ts
 */

export interface ILoginIn {
  username: string,
  password: string
}

export interface ILoginOut {
  token: string
}

/**
 * httpUser.ts
 */

export interface IRegisterIn {
  username: string,
  password: string,
  nickname: string,
  avatar: string,
  email?: string
}

export interface IRegisterOut {
  id: string,
  username: string,
  nickname: string,
  avatar: string,
  email: string,
  role: string,
  createTime: string,
  updateTime: string
}

export interface IGetUserInfoIn { }

export interface IGetUserInfoOut {
  id: string,
  username: string,
  nickname: string,
  avatar: string,
  email: string,
  role: string,
  createTime: string,
  updateTime: string
}

/**
 * httpNote.ts
 */

export interface ICreateNoteIn {
  title: string,
  author: string,
  content: string,
  desc: string,
  cover_url: string,
  type: string,
  views: number,
  comments: number
}

export interface ICreateNoteOut {
  msg: string
}

export interface IGetAllNoteIn {
  pageNum: number,
  pageSize: number,
  type: number
}

export interface IGetAllNoteOut {
  count: number
  list: Array<INote>
}

export interface IGetNoteByIdIn {
  id: number
}

export interface IGetNoteByIdOut {
  /** 与 INote 一致 */
}

export interface IUpdateNoteIn {
  id: number,
  title?: string,
  content?: string,
  desc?: string,
  cover_url?: string,
  comments?: number,
  views?: number,
  type?: number
}

export interface IUpdateNoteOut {
  msg: string
}

export interface IDeleteNoteIn {
  id: number
}

export interface IDeleteNoteOut {
  msg: string
}

/**
 * httpType.ts
 */

export interface IGetAllTypeIn {

}

export interface IGetAllTypeOut {
  count: number,
  list: Array<IType>
}

/**
 * 公共
 */

export interface INote {
  id: number,
  author: string,
  title: string,
  content: string,
  desc: string,
  create_time: string,
  update_time: string,
  cover_url: string,
  comments: number,
  views: number,
  type: number
}

export interface IType {
  id: number,
  type: number,
  type_desc: string
}
