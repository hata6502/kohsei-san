/* eslint-disable @typescript-eslint/no-var-requires */
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
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
