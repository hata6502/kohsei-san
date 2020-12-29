/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    main: './src/index.tsx',
    lintWorker: './src/lintWorker.ts',
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader',
        options: {
          plugins: ['istanbul'],
          presets: [
            [
              '@babel/preset-env',
              {
                corejs: 3,
                useBuiltIns: 'entry',
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
  },
  plugins: [
    new CopyPlugin([{ from: 'resources' }]),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
