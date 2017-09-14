module.exports = {
    entry: './app/entry.js',

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
      }
    ]
  }
}