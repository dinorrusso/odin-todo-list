const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',             // entry point (your main JS file)
  output: {
    filename: 'bundle.js',             // output bundle filename
    path: path.resolve(__dirname, 'dist'),  // output directory 'dist'
    clean: true,                      // cleans old files in dist before build
  },
  devServer: {
  static: {
    directory: path.join(__dirname, 'public'),
  },
  compress: true,
  port: 8080,
  open: true,
},

  module: {
    rules: [
      {
        test: /\.css$/,               // handle CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,  // handle images
        type: 'asset/resource',           // emits image files to output folder
      },
      /*
      {
        test: /\.js$/,                 // transpile JS if needed
        exclude: /node_modules/,
        use: 'babel-loader',           // if you use Babel (optional)
      },
      */
    ],
  },
  plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    
  }),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'public', to: '.' }
    ],
  }),
],

  mode: 'development',   // or 'production' for optimized build
  devtool: 'source-map', // optional, for easier debugging
};
