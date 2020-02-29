module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      'webpack': {
        'config': 'webpack.common.js'
      }
    }
  },
  rules: {
    'arrow-parens': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'comma-dangle': ['error', 'never'],
    'import/extensions': [
      'error',
      {
        '.js': 'never',
        '.jsx': 'never',
        '.ts': 'never',
        '.tsx': 'never'
      }
    ],
    'react/jsx-filename-extension': [
      'error',
      {
        'extensions': [
          '.jsx',
          '.tsx'
        ]
      }
    ],
    'react/prop-types': 'off',
  }
};