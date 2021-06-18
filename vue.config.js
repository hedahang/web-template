const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const HtmlWebpackPlugin = require("html-webpack-plugin");

// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin; // 打包分析
const IS_PROD = ["production"].includes(process.env.NODE_ENV);
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  publicPath: "./", // 公共路径
  indexPath: "index.html", // 相对于打包路径index.html的路径
  outputDir: "dist", // 'dist', 生产环境构建文件的目录
  assetsDir: "static", // 相对于outputDir的静态资源(js、css、img、fonts)目录s
  lintOnSave: false, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: false, // 生产环境的 source map
  // parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  // pwa: {}, // 向 PWA 插件传递选项。
  transpileDependencies: ["echarts", "swiper", "vue-native-websocket", "dom7"],
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复热更新失效
    config.resolve.alias // 添加别名
      .set("@", resolve("src"));
    // 打包分析, 打包之后自动生成一个名叫report.html文件(可忽视)
    // if (IS_PROD) {
    //   config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
    //     {
    //       analyzerMode: "static"
    //     }
    //   ]);
    // }
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/assets/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", config => {
      config.optimization.splitChunks({
        chunks: "all",
        // maxInitialRequests: 6,
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single"),
        {
          from: path.resolve(__dirname, "./public/robots.txt"), //防爬虫文件
          to: "./" //到根目录下
        };
    });
  },
  configureWebpack: config => {
    // 开启 gzip 压缩
    // 需要 npm i -D compression-webpack-plugin
    const plugins = [];
    if (IS_PROD) {
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      );
    }
    config.plugins.forEach(val => {
      if (val instanceof HtmlWebpackPlugin) {
        val.options.title = "web-template"; // 修改输出文件名
      }
    });
    config.plugins = [...config.plugins, ...plugins];
  },
  css: {
    extract: IS_PROD,
    // requireModuleExtension: false, // 去掉文件名中的 .module
    loaderOptions: {
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // `globalVars` 定义全局对象，可加入全局变量
        globalVars: {
          primary: "#333"
        }
      }
    }
  },
  devServer: {
    overlay: {
      // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    host: "0.0.0.0",
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    hotOnly: true, // 热更新
    proxy: "http://localhost:3724" // 配置跨域处理,只有一个代理
    // proxy: {
    //   "/api": {
    //     target: "http://192.168.1.129:8080", // 测试环境
    //     ws: false, // 关闭socket支持，解决与mocker冲突问题
    //     pathRewrite: {
    //       "/api": ""
    //     }
    //   }
    // }
  }
};
