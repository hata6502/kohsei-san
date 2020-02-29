/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'docs')
  },
  plugins: [new CopyPlugin([{ from: 'resources' }])],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
