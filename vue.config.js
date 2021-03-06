const autoprefixer = require('autoprefixer')
const pxtoviewport = require('postcss-px-to-viewport')
const webpack = require('webpack')

module.exports = {
  // proxyTable: {
  //     '/api': {  //使用"/api"来代替"http://f.apiplus.c"
  //         target: 'http://192.168.0.225:8000', //源地址
  //         changeOrigin: true, //改变源
  //         pathRewrite: {
  //             '^/api': 'http://192.168.0.225:8000' //路径重写
  //         }
  //     }
  // } ,
  devServer: {
    proxy: {
      //配置跨域
      '/api': {
        // target: 'http://192.168.0.225:8000/', //这里后台的地址模拟的;应该填写你们真实的后台接口
        target: 'http://192.168.0.222:8001/', //这里后台的地址模拟的;应该填写你们真实的后台接口
        //http://192.168.0.222:8001/sap/bc/zh/eam/spapplylist?sap-client=800&query=bukrs ,
        changOrigin: true, //允许跨域
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  //android低版本
  configureWebpack: (config) => {
    let e = ['@babel/polyfill', './src/main.js']
    config.entry = e
  },

  outputDir: 'dist',

  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
            viewportHeight: 667, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
            unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
            selectorBlackList: ['.ignore'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
            minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
            mediaQuery: false, // 允许在媒体查询中转换`px`
          }),
        ],
      },
    },
  },
}
