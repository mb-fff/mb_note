import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'
// codemirror编辑器的相关资源
import Codemirror from 'codemirror'
// mode
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/vue/vue'
// edit
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
// placeholder
import 'codemirror/addon/display/placeholder'
// active-line
import 'codemirror/addon/selection/active-line'
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
// style
import 'codemirror/lib/codemirror.css'
// tip
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index.js'
import '@kangc/v-md-editor/lib/plugins/tip/tip.css'
// 表情
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index.js'
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css'
// todo-list
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index.js'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'
// 高亮代码行
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index.js'
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css'
// 快捷复制代码 
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index.js'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
// 内容定位
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align'

VMdEditor.Codemirror = Codemirror
VMdEditor
  .use(githubTheme, {
    Hljs: hljs
  })
  .use(createTipPlugin())
  .use(createEmojiPlugin())
  .use(createTodoListPlugin())
  .use(createHighlightLinesPlugin())
  .use(createCopyCodePlugin())
  .use(createAlignPlugin())
VMdEditor.xss.extend({
  // 扩展白名单
  whiteList: {
    source: []
  }
})

export default VMdEditor