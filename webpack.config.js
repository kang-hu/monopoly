const path = require('path')
const outputDir = path.resolve(__dirname, 'dist/scripts')
const glob = require("glob")
const glob_entries = require('webpack-glob-entries')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  resolve: {
    alias: {
      Scripts: path.resolve(__dirname, 'src/scripts')
    }
  },
  mode: 'development',
  watch: true,
  watchOptions: {
    ignored:  ['monopoly/**/*.js', 'node_modules']
  },
  entry: glob_entries('./src/scripts/*.js'),
  output: {
      path: outputDir,
      filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      }, {
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};