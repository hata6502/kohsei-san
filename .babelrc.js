module.exports = {
  plugins: ['istanbul'],
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'entry'
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ]
};
