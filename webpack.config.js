/* global __dirname, require, module */
'use strict'

const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const env = process.env.NODE_ENV

const libraryName = 'Dashizer'
let libraryFileName = libraryName.toLowerCase()
let plugins = []
let outputFile

if (env !== 'development') libraryFileName += '.min'

const extractSass = new MiniCssExtractPlugin({
  filename: `${libraryFileName}.css`
})

plugins.push(extractSass)
plugins.push(new webpack.DefinePlugin({
  VERSION: JSON.stringify(require('./package.json').version)
}))

outputFile = `${libraryFileName}.js`

if (env === 'development') {
  plugins.push(new BrowserSyncPlugin({
    ui: false,
    host: 'localhost',
    port: 4000,
    files: ['./example'],
    proxy: 'localhost:4001'
  }))
}

const config = {
  mode: env,
  entry: path.join(__dirname, '/src/index.js'),
  devtool: 'source-map',
  stats: {
    modules: false,
    children: false
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        // standard-loader as a preloader
        enforce: 'pre',
        test: /\.js?$/,
        loader: 'standard-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
          error: false,
          snazzy: true,
          parser: 'babel-eslint'
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.scss$/,
        use: [
          env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./src'), path.resolve('./node_modules')],
    extensions: ['.js', '.scss']
  },
  plugins: plugins
}

module.exports = config
