const { task, src, dest, watch, parallel, series, lastRun } = require('gulp')
const gulpif = require('gulp-if')
const gulpLoadPlugins = require('gulp-load-plugins')
const plugins = gulpLoadPlugins()
const clean = require('gulp-clean')
const connect = require('gulp-connect')


const LessAutoprefix = require('less-plugin-autoprefix')
const autoprefix = new LessAutoprefix({ browsers: ['last 5 versions'] })
const less = require('gulp-less')
const cleanCSS = require('gulp-clean-css')

const webpack = require('webpack-stream')
const webpackConfig = require("./webpack.config.js")
const webpackDevConfig = require("./webpack.dev.js")
const webpackProdConfig = require("./webpack.prod.js")

const paths = {
  assets: {
    src: './src/assets/**/*',
    dest: './monopoly/assets/',
    watch: './src/assets/**/*'
  },
  html: {
    src: './src/template/*.html',
    dest: './monopoly/',
    watch: './src/template/**/*.html'
  },
  styles: {
    src: './src/styles/*.less',
    dest: './monopoly/styles/',
    watch: './src/styles/**/*.less',
  },
  scripts: {
    src: './src/scripts/*.js',
    dest: './monopoly/scripts/',
    watch: ['./src/scripts/**/*.js', './src/scripts/**/*.vue'],
  },
}

function connectDev() {
  connect.server({
    root: ['monopoly'],
    port: 8080,
    livereload: true
  })
}

function openBrowser() {
  // 'google-chrome' // Linux 
  // 'chrome' // Windows 
  // 'google chrome' or 'Google Chrome' // OSX 
  var options = {
    uri: 'http://localhost:8080',
    app: 'chrome'
  }
  return src('./monopoly/index.html')
  .pipe(plugins.open(options))
}


function cleanDest() {
  return src('./monopoly', {allowEmpty: true})
  .pipe(clean())
}

function buildHTML() {
  return src(paths.html.src)
  .pipe(dest(paths.html.dest))
  .pipe(connect.reload())
}

function copyAssets() {
  return src(paths.assets.src)
  .pipe(plugins.plumber())
  .pipe(dest(paths.assets.dest))
  .pipe(connect.reload())
}

function buildStylesWithSourceMap() {
  return src(paths.styles.src)
  .pipe(plugins.sourcemaps.init())
  .pipe(less({
    plugins: [autoprefix]
  }))
  .pipe(plugins.sourcemaps.write())
  .pipe(dest(paths.styles.dest))
  .pipe(connect.reload())
}

function buildStyles() {
  return src(paths.styles.src)
  .pipe(less({
    plugins: [autoprefix]
  }))
  .pipe(cleanCSS())
  .pipe(dest(paths.styles.dest))
}

function buildDevScripts() {
  return _buildScripts('dev')
}
function buildProdScripts() {
  return _buildScripts('prod')
}

function _buildScripts(mode) {
  let _webpackConfig =  mode === 'prod' ? webpackProdConfig : webpackDevConfig

  return src(paths.scripts.src)
    .pipe(webpack(_webpackConfig))
    .pipe(dest(paths.scripts.dest))
    .pipe(connect.reload())
  }

function watcher() {
  watch(paths.html.watch, buildHTML)
  watch(paths.styles.watch, buildStylesWithSourceMap)
  watch(paths.assets.watch, copyAssets)
  // watch(paths.scripts.watch,buildScripts) use webpakc watch
}

// public task

function buildDevTask() {
  return parallel(series(cleanDest, buildHTML, copyAssets, buildStylesWithSourceMap, openBrowser, buildDevScripts), watcher, connectDev)
}

function buildProdTask() {
  return series(cleanDest, buildHTML, copyAssets, buildStyles, buildProdScripts)
}

function testTask(cb) {
  return buildScripts()
  cb()
} 

exports.dev = buildDevTask()
exports.build = buildProdTask()
exports.clean = series(cleanDest)
exports.default = buildDevTask()
exports.test = testTask