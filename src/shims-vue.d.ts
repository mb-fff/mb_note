/**
 * eslint-disable
 * 该文件作用：为ts做的适配定义文件，因为ts无法识别 .vue文件是干嘛的
 * 加上这一段是告诉ts，vue文件是这种类型的。
 * 删除之后，会发现import的所有vue类型文件会报错
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "@kangc/v-md-editor/lib/codemirror-editor"
declare module "@kangc/v-md-editor/lib/theme/github.js"
declare module "codemirror"
declare module "hljs"
declare module "@kangc/v-md-editor/lib/plugins/tip/index.js"
declare module "@kangc/v-md-editor/lib/plugins/emoji/index.js"
declare module "@kangc/v-md-editor/lib/plugins/todo-list/index.js"
declare module "@kangc/v-md-editor/lib/plugins/highlight-lines/index.js"
declare module "@kangc/v-md-editor/lib/plugins/copy-code/index.js"
declare module "@kangc/v-md-editor/lib/plugins/align"
declare module "crypto-js"
