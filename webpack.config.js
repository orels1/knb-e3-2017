/**
 * Created by orel- on 24/May/17.
 */
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractStyles = new ExtractTextPlugin({
  filename: './styles.css',
});

module.exports = {
  entry: {
    bundle: './app/main.js',
    styles: './styles.sass'
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: './[name].js',
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        exclude: /node_modules/,
        use: extractStyles.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    extractStyles,
  ],
};
