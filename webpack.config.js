const path = require('path');

module.exports = {
  mode: 'production',
  target: 'web',

  entry: path.join(__dirname, 'resource/index.ts'),
  output: {
    library: { type: 'commonjs' },
    path: path.join(__dirname, 'build'),
    filename: 'express-icbon.min.js',
  },

  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts'],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
};
