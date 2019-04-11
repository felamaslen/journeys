module.exports = {
  plugins: [
    'ava',
    'import',
    'react',
    'react-hooks',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-base',
  ],
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
    react: {
      version: 'detect',
    },
  },
  rules: {
    'arrow-parens': 0,
    'ava/no-only-test': 'error',
    'ava/use-t-well': 'error',
    'ava/use-t': 'error',
    'no-underscore-dangle': 0,
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
    'import/prefer-default-export': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  }
}