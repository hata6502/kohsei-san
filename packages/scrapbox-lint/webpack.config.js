/* eslint-disable */

const staticFs = require('babel-plugin-static-fs');
const webpack = require('webpack');

const commonConfig = {
  mode: 'production',
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

module.exports = [
  {
    ...commonConfig,
    entry: {
      'scrapbox-lint-main': './src/index.ts',
    },
    output: {
      ...commonConfig.output,
      library: {
        type: 'module',
      },
    },
  },
  {
    ...commonConfig,
    entry: {
      'scrapbox-lint-worker': './src/worker.ts',
    },
  },
];
