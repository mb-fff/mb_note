<template>
  <!-- 头部 -->
  <header class="m-header">
    <!-- 返回首页 -->
    <el-page-header @back="goBack" :icon="ArrowLeft" title="返回" content="写笔记" />
    <!-- 笔记标题 -->
    <el-input class="m-input-title" size="large" v-model="title" placeholder="输入笔记标题..." />
    <el-input class="m-input-title" size="large" v-model="desc" placeholder="输入笔记描述..." />
    <el-select v-model="noteType" class="m-select-type" size="large" placeholder="Select Note Type">
      <el-option
        v-for="typeItem in typelist"
        :key="typeItem.type"
        :label="typeItem.type_desc"
        :value="typeItem.type"
      ></el-option>
    </el-select>
    <!-- 提示 -->
    <p class="m-p-info">{{ info }}</p>
    <!-- 发布 -->
    <el-button type="success" @click="publishNote">发布</el-button>
    <!-- 头像 -->
    <div class="m-avatar">
      <img src="@/assets/img/avatar.jpg" />
    </div>
  </header>
  <!-- 编辑器 -->
  <main class="m-md-editor">
    <v-md-editor
      height="100%"
      v-model="text"
      :include-level="[1, 2, 3, 4, 5, 6]"
      :default-show-toc="true"
      :disabled-menus="[]"
      @upload-image="handleUploadImage"
      left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | tip emoji todo-list | save"
      @copy-code-success="handleCopyCodeSuccess"
      @save="handleSave"
    ></v-md-editor>
  </main>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import HttpNote from '@/api/httpNote'
import HttpType from '@/api/httpType'
import HttpFile from '@/api/httpFile'

const httpNote = new HttpNote()
const httpType = new HttpType()
const httpFile = new HttpFile()
const $router = useRouter()

// 状态
const state = reactive({
  // 笔记标题
  title: '',
  // 笔记简介
  desc: '',
  // 笔记类型列表
  typelist: [{ type: '', type_desc: '' }],
  // 笔记类型
  noteType: '',
  // 笔记内容
  text: '',
  // 提示
  info: '自动保存'
})

const { title, desc, typelist, noteType, text, info } = toRefs(state)

// 返回首页
const goBack = (): void => {
  $router.push({ name: 'Home' })
}

// 上传图片
const handleUploadImage = async (event: Event, insertImage: Function, files: any) => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  const file = files[files.length - 1]
  const formData = new FormData()
  formData.append('file', file)
  const res = await httpFile.upload(formData)
  const { url, filename } = res.data.data

  // 此处只做示例
  insertImage({
    url,
    desc: filename
  })
}

// 快捷复制
const handleCopyCodeSuccess = (code: string): void => {
  ElMessage.success('copy success')
}

// 保存笔记
const handleSave = (text: string, html: any): void => {
  state.text = text
}

// 获取笔记类型
const getAllType = async () => {
  try {
    const param = {}
    const res = await httpType.getAllType(param)
    const { list } = res.data.data
    state.typelist = []
    list.forEach((item: any) => {
      state.typelist.push({
        type_desc: item.type_desc,
        type: item.type
      })
    })
  } catch (error) {
    console.log(error)
  }
}

// 发布笔记
const publishNote = async () => {
  // 校验
  if (state.title === '') { return ElMessage.error('请输入笔记标题') }
  if (state.noteType === '') { return ElMessage.error('请选择笔记类型') }
  const param = {
    title: state.title,
    author: 'meibo',
    content: state.text,
    desc: state.desc,
    cover_url: '#',
    type: state.noteType,
    views: 0,
    comments: 0
  }

  try {
    const res = await httpNote.createNote(param)
    ElMessage.success('发布成功')
    $router.go(0)
  } catch (error: any) {
    ElMessage.error(error.data.message)
  }
}

getAllType()
</script>

<style lang='scss' scoped>
.m-header {
  width: 100%;
  min-width: 1300px;
  height: 59px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .m-input-title {
    flex: 1;
    margin-left: 20px;
    font-size: 18px;
    :deep(.el-input__inner) {
      border: none;
      color: #000;
    }
  }
  .m-select-type {
    width: 160px;
    :deep(.el-input__inner) {
      border: none;
      color: #000;
      text-align: center;
    }
  }
  .m-p-info {
    color: #c9cdd4;
    margin-right: 12px;
  }
  .m-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    margin-left: 12px;
    img {
      width: 100%;
      height: 100%;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.m-md-editor {
  height: calc(100vh - 60px);
  :deep(.codemirror-wrapper) {
    height: 100%;
    .CodeMirror {
      height: 100%;
    }
  }
}
</style>
