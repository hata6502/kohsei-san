/* eslint-disable */

const staticFs = require('babel-plugin-static-fs');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    'kohsei-san-core': './src/index.ts',
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                [
                  staticFs,
                  {
                    target: 'browser',
                    dynamic: false,
                  },
                ],
              ],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    // Prevent to use mjs extension.
    filename: '[name].js',
    library: {
      type: 'module',
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: { os: require.resolve('os-browserify/browser') },
  },
};
