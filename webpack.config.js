var webpack = require('webpack')
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
var path = require('path');
var APP_DIR = path.resolve(__dirname, 'build');

module.exports = {
    entry: [
      'font-awesome-webpack!./font-awesome.config.js',
      './app/entry.js',
    ],
    output: {
      path: APP_DIR,
      filename: 'bundle.js'
    },
    node: {
      __dirname: false,
      __filename: false
    },
    resolve: {
      alias: {},
      modules: [
       'node_modules', './app',
      ]
    }
    target: "electron-main",
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(jpg|jpeg|gif|png|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 8000,
          }
        },
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=10000&mimetype=application/font-woff"
        },
        { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
      ]
    }
}

config.target = webpackTargetElectronRenderer(config)

module.exports = config
