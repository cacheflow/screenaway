const webpack = require('webpack')

module.exports = {
    entry: [
      'font-awesome-webpack!./font-awesome.config.js',
      './app/entry.js',
    ],
    output: {
      path: __dirname + '/build',
      publicPath: 'build/',
      filename: 'bundle.js'
    },
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
