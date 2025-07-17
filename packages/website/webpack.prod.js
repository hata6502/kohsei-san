const staticFs = require('babel-plugin-static-fs');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const { GenerateSW } = require('workbox-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.tsx',
    lintWorker: './src/lintWorker.ts',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
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
          presets: ['@babel/preset-react', '@babel/preset-typescript'],
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'resources' }],
    }),
    new GenerateSW({
      maximumFileSizeToCacheInBytes: 64 * 1024 * 1024,
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      assert: require.resolve('assert'),
      buffer: require.resolve('buffer'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      util: require.resolve('util'),
    },
  },
};
