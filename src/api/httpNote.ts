import instance from '@/utils/http'
import { ICreateNoteIn, IGetAllNoteIn, IGetNoteByIdIn, IUpdateNoteIn, IDeleteNoteIn } from '@/types/IApi'

class HttpNote {
  // 创建笔记
  createNote(data: ICreateNoteIn) {
    return instance({ url: '/mb/note/createNote', data, method: 'POST', responseType: 'json' })
  }
  // 查询所有笔记
  getAllNote(data: IGetAllNoteIn) {
    return instance({ url: '/mb/note/getAllNote', data, method: 'POST', responseType: 'json' })
  }
  // 查询指定笔记
  getNoteById(data: IGetNoteByIdIn) {
    return instance({ url: '/mb/note/getNoteById', data, method: 'POST', responseType: 'json' })
  }
  // 更新笔记
  updateNote(data: IUpdateNoteIn) {
    return instance({ url: '/mb/note/updateNote', data, method: 'POST', responseType: 'json' })
  }
  // 删除笔记
  deleteNote(data: IDeleteNoteIn) {
    return instance({ url: '/mb/note/deleteNote', data, method: 'POST', responseType: 'json' })
  }
}

export default HttpNote