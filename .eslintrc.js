module.exports = {
  plugins: [
    'import',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: false,
    node: true
  },
  extends: ['airbnb-base'],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', './src'],
          ['~test', './test'],
        ],
        extensions: ['.js'],
      },
    },
  },
  rules: {
    'no-underscore-dangle': 0,
    'comma-dangle': 'error',
    'import/prefer-default-export': 0,
  }
}