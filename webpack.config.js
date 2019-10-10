const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const packageJson = require('./package.json')
const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development'
})

const MODE = process.env.MODE

//const publicPath = MODE === 'dev' ? '/' : 'https://jhs.dochuang.cn/h5/'
const publicPath = MODE === 'dev' ? '/' : 'https://jhs-test.vsene.cn/h5/'

module.exports = {
  entry: {
    vendor: Object.keys(packageJson.dependencies),
    app: './src/main.js',
  },
  output: {
    filename: '[name].js?[hash:5]',
    path: path.resolve(__dirname, 'dist'),
    publicPath,
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '0.0.0.0',
    port:8082
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?minimize=true', 'sass-loader', 'autoprefixer-loader?browsers=last 4 versions']
      })
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?minimize=false', 'autoprefixer-loader?browsers=last 4 versions']
      })
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'url-loader?limit=100'
      ]
    }, {
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'babel-loader?presets[]=es2015'
    }, {
      test: /\.(png|jpe?g|gif|svg|mp3)$/,
      use: [
        'url-loader?name=images/[name].[ext]?[hash:5]&limit=100'
      ]
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
    new ExtractTextPlugin('index.css?[hash:5]'),
    new UglifyJSPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: 'src/index_temp.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
  ]
}
