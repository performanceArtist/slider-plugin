const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  entry: {
    app: './src/index.ts'
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts']
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  devServer: {
    port: 5000
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              data: '@import "./css/globals";',
              includePaths: [path.join(__dirname, 'src')]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.pug'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
  ]
};

module.exports = (env, options) => {
  if (options.mode === 'production') {
    config.output.publicPath = '/slider/';
  }

  if (options.mode === 'development') {
    config.output.publicPath = '/';
    config.devtool = 'source-map';
  }

  return config;
};
