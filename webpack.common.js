const path = require('path')

const glob_entries = require('webpack-glob-entries')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const outputDir = path.resolve(__dirname, 'monopoly/scripts')

module.exports = {
  resolve: {
    alias: {
      Scripts: path.resolve(__dirname, 'src/scripts')
    }
  },
  entry: glob_entries('./src/scripts/*.js'),
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
  ],
  output: {
    path: outputDir,
    filename: '[name].js'
  },
};