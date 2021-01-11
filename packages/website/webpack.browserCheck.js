/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    browserCheck: './src/browserCheck.ts',
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: 'defaults',
              },
            ],
            '@babel/preset-typescript',
          ],
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'resources'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
