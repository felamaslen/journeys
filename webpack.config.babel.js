import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import { version } from './package.json';

function sassLoader(config) {
  const common = [
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        config: {
          path: path.resolve(__dirname, './src/client/sass/postcss.config.js'),
        },
      },
    },
    'sass-loader',
    {
      loader: '@epegzz/sass-vars-loader',
      options: {
        syntax: 'scss',
        files: [
          path.resolve(__dirname, './src/client/constants/styles.js'),
        ],
      },
    },
  ];

  if (config.__DEV__) {
    return ['style-loader', ...common];
  }

  return [MiniCssExtractPlugin.loader, ...common];
}

function getPlugins(config) {
  const common = [
    new HtmlWebpackPlugin({
      hash: true,
      template: path.resolve(__dirname, './src/client/index.html'),
      filename: 'index.html',
      favicon: path.resolve(__dirname, './src/client/images/favicon.png'),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(version),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ];

  if (config.__DEV__) {
    return [
      ...common,
      new webpack.HotModuleReplacementPlugin(),
    ];
  }

  return [
    ...common,
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css?v=[hash]',
      chunkFilename: '[name].chunk.css?v=[chunkHash]',
    }),
  ];
}

function getEntry(config) {
  const common = [
    '@babel/polyfill',
    './src/client',
  ];

  if (config.__DEV__) {
    return [
      'webpack/hot/only-dev-server',
      'webpack-hot-middleware/client?reload=true',
      ...common,
    ];
  }

  return common;
}

const assetPath = path.join(__dirname, 'dist/public');

const publicPath = process.env.PUBLIC_PATH || '/';

export default (config = { __DEV__: process.env.NODE_ENV === 'development' }) => ({
  entry: getEntry(config),
  devtool: config.__DEV__
    ? 'cheap-module-eval-source-map'
    : false,
  mode: process.env.NODE_ENV || 'production',
  output: {
    path: assetPath,
    publicPath,
    filename: '[name].bundle.js?v=[hash]',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: { minimize: true },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /workers\/(.*)\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'worker-loader',
            options: {
              name: '[name].worker.js',
              inline: true,
            },
          },
          'babel-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: sassLoader(config),
      },
      {
        test: /\.css$/,
        use: 'css-loader',
      },
      {
        test: /\.(woff2?|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /node_modules/,
        loader: 'file-loader',
      },
      {
        test: /\.(png|jpg|wav|mp3|mp4)$/,
        exclude: [/node_modules/, /favicon\.png/],
        use: 'file-loader',
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'react-svg-loader',
            query: {
              svgo: {
                pretty: true,
                plugins: [{ removeStyleElement: true }],
              },
            },
          },
        ],
      },
      {
        test: /favicon\.png/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'favicon.ico',
            path: assetPath,
            publicPath,
          },
        },
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: [
      '.js',
      '.scss',
    ],
  },
  optimization: {
    minimize: !config.__DEV__,
    minimizer: [
      new TerserPlugin(),
      new OptimizeCssAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
      name: 'common',
      cacheGroups: {
        fonts: {
          test: /fonts\.scss/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: getPlugins(config),
});
