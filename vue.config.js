const path = require('path')
// 开启gzip压缩，部署项目时，nginx配置浏览器直接解析.gz文件（可以优化首屏加载速度）
const CompressionWebpackPlugin = require("compression-webpack-plugin")
// 需要进行gzip压缩的文件（正则匹配）
const productionGzipExtensions = /\.(js|ts|css|json|txt|html|ico|svg)(\?.*)?$/i
// 打包分析
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
// 是否生产环境
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
// 获取绝对路径
const resolve = dir => path.join(__dirname, dir)
// 自动引入依赖
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
  // 打包后的资源公共路径，跟应用的部署路径有关，如果应用被部署在一个子路径上，如 http://www.meibo.com/my-app/，则需要设置publicPath为'/my-app/'
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 打包后生成的index.html的输出路径
  indexPath: 'index.html',
  // 打包构建后的目录
  outputDir: process.env.outputDir || 'dist',
  // 打包后的资源子目录static，存放css、js、img等资源文件
  assetsDir: 'static',
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  lintOnSave: false,
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: true,
  // 生产环境的 source map
  productionSourceMap: !IS_PROD,
  // 向 PWA 插件传递选项。
  pwa: {},
  // webpack配置（链式操作）
  chainWebpack: config => {
    // 修复热更新失效
    config.resolve.symlinks(true)
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = "none"
      return args
    })
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
    // 压缩图片
    // config.module
    //   .rule('images')
    //   .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    //   // 压缩图片
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({
    //     // 压缩jpeg
    //     mozjpeg: { progressive: true, quality: 65 },
    //     // 压缩png
    //     optipng: { enabled: false },
    //     // 压缩png
    //     pngquant: { quality: [0.65, 0.9], speed: 4 },
    //     // 压缩gif
    //     gifsicle: { interlaced: false },
    //     // 压缩webp
    //     webp: { quality: 75 }
    //   })
    // 打包分析
    // 打包之后自动生成一个名叫report.html文件(可忽视)
    if (IS_PROD) {
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
        {
          analyzerMode: "static"
        }
      ])
    }
  },
  // configureWebpack若是函数，可以修改合并配置；若是对象，则会通过webpack- merge合并到最终的配置中
  configureWebpack: config => {
    const plugins = []
    plugins.push(
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    )
    // 生产环境开启 gzip 压缩
    if (IS_PROD) {
      plugins.push(
        new CompressionWebpackPlugin({
          // 压缩后的文件名
          filename: "[path].gz[query]",
          // 压缩方式
          algorithm: "gzip",
          // 正则校验需要进行压缩的文件类型
          test: productionGzipExtensions,
          // 设置压缩文件限制（10k以上）
          threshold: 1024 * 10,
          // 只有压缩率比0.8小的资源才会被处理
          minRatio: 0.8
        })
      )
    }
    config.plugins = [...config.plugins, ...plugins]
  },
  devServer: {
    // 让浏览器 overlay 同时显示警告和错误
    overlay: {
      warnings: true,
      errors: true
    },
    host: 'localhost',
    port: 10002,
    https: false,
    open: true,
    // 代理配置
    proxy: {
      // 标识符
      "/mb": {
        // 代理目标地址
        target: "http://localhost:10010/api",
        // 不保留发起请求所在主机地址
        changeOrigin: true,
        // websocket支持
        ws: false,
        // 默认不接受在https上运行且证书无效的后端服务器，设置为false(接受)
        secure: false,
        // 重写路径（代理后的地址http://localhost:10010/api + 重写后的字段 + url）
        pathRewrite: {
          "^/mb": ""
        }
      }
    }
  }
}