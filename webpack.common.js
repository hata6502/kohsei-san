/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  module: {
    noParse: /browserfs\.js/,
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.yml$/i,
        use: 'raw-loader'
      }
    ]
  },
  node: {
    process: false,
    Buffer: false
  },
  output: {
    path: path.resolve(__dirname, 'docs')
  },
  plugins: [
    new CopyPlugin([{ from: 'resources' }]),
    new webpack.ProvidePlugin({
      BrowserFS: 'bfsGlobal',
      process: 'processGlobal',
      Buffer: 'bufferGlobal'
    })
  ],
  resolve: {
    alias: {
      fs: 'browserfs/dist/shims/fs.js',
      buffer: 'browserfs/dist/shims/buffer.js',
      path: 'browserfs/dist/shims/path.js',
      processGlobal: 'browserfs/dist/shims/process.js',
      bufferGlobal: 'browserfs/dist/shims/bufferGlobal.js',
      bfsGlobal: require.resolve('browserfs')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
